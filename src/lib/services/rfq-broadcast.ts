/**
 * RFQ Broadcast Service
 * Sends RFQ requests to all matching vendors/contacts from database, CRM, and web discovery
 */

import { createSupabaseAdmin } from '@/lib/database/supabase-client';
import { OpenAI } from 'openai';

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return new OpenAI({ apiKey });
}

export interface RFQBroadcastRequest {
  rfq_id: string;
  parts_description: string;
  technical_requirements?: Record<string, any>;
  quantity?: number;
  urgency?: 'standard' | 'rush' | 'emergency';
  due_date?: Date;
  channels?: ('email' | 'linkedin' | 'portal' | 'sms')[];
}

export interface VendorMatch {
  vendor_id: string;
  vendor_name: string;
  email?: string;
  linkedin_url?: string;
  match_confidence: number;
  match_reasons: string[];
  capabilities: string[];
  discovered_via: string;
}

export class RFQBroadcastService {
  /**
   * Find all vendors who could potentially fulfill an RFQ
   * Uses AI to match part requirements with vendor capabilities
   */
  async findMatchingVendors(
    partsDescription: string,
    technicalRequirements?: Record<string, any>
  ): Promise<VendorMatch[]> {
    const supabase = createSupabaseAdmin();
    const matches: VendorMatch[] = [];

    // 1. Search existing vendors in database
    const { data: vendors, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('is_verified', true);

    if (error) {
      console.error('Error fetching vendors:', error);
      return matches;
    }

    if (!vendors || vendors.length === 0) {
      return matches;
    }

    // 2. Use AI to match vendors based on capabilities
    const matchingPrompt = `Analyze this RFQ request and match it with vendor capabilities.

RFQ Request: ${partsDescription}
Technical Requirements: ${JSON.stringify(technicalRequirements || {})}

For each vendor, determine:
1. Match confidence (0-1): How well their capabilities match the RFQ
2. Match reasons: Why they match (specific capabilities, materials, processes)
3. Relevant capabilities: Which of their capabilities are relevant

Vendor List:
${vendors.map((v, i) => `
Vendor ${i + 1}:
- Name: ${v.vendor_name}
- Capabilities: ${JSON.stringify(v.capabilities || [])}
- Materials: ${JSON.stringify(v.materials || [])}
- Processes: ${JSON.stringify(v.processes || [])}
- Certifications: ${JSON.stringify(v.certifications || [])}
`).join('\n')}

Return JSON array of matches with format:
[
  {
    "vendor_index": 0,
    "match_confidence": 0.85,
    "match_reasons": ["Capable of precision machining", "Has ISO 9001 certification"],
    "relevant_capabilities": ["CNC Machining", "Quality Control"]
  }
]`;

    try {
      const openai = getOpenAI();
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at matching manufacturing RFQs with vendor capabilities. Return only valid JSON.',
          },
          {
            role: 'user',
            content: matchingPrompt,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const responseContent = completion.choices[0].message.content || '{}';
      let aiMatches: any[] = [];
      
      try {
        const parsed = JSON.parse(responseContent);
        aiMatches = parsed.matches || parsed || [];
        if (!Array.isArray(aiMatches)) {
          aiMatches = [];
        }
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        aiMatches = [];
      }

      // 3. Build vendor matches
      for (const aiMatch of aiMatches) {
        const vendor = vendors[aiMatch.vendor_index];
        if (vendor && aiMatch.match_confidence >= 0.5) {
          matches.push({
            vendor_id: vendor.vendor_id,
            vendor_name: vendor.vendor_name,
            email: vendor.contact_email || undefined,
            linkedin_url: vendor.linkedin_url || undefined,
            match_confidence: aiMatch.match_confidence,
            match_reasons: aiMatch.match_reasons || [],
            capabilities: aiMatch.relevant_capabilities || [],
            discovered_via: vendor.discovered_via || 'database',
          });
        }
      }
    } catch (error) {
      console.error('AI matching error:', error);
      // Fallback: return all vendors if AI fails
      vendors.forEach((vendor) => {
        matches.push({
          vendor_id: vendor.vendor_id,
          vendor_name: vendor.vendor_name,
          email: vendor.contact_email || undefined,
          match_confidence: 0.5,
          match_reasons: ['Vendor in database'],
          capabilities: (vendor.capabilities || []) as string[],
          discovered_via: vendor.discovered_via || 'database',
        });
      });
    }

    // 4. Search contacts (trade shows, LinkedIn, etc.)
    const { data: contacts } = await supabase
      .from('contacts')
      .select('*')
      .or('email.not.is.null,linkedin_url.not.is.null');

    if (contacts) {
      // Use AI to match contacts
      for (const contact of contacts) {
        // Simple keyword matching for contacts (can be enhanced with AI)
        if (this.contactMatchesRFQ(contact, partsDescription)) {
          matches.push({
            vendor_id: contact.contact_id,
            vendor_name: contact.company || contact.name,
            email: contact.email || undefined,
            linkedin_url: contact.linkedin_url || undefined,
            match_confidence: 0.6,
            match_reasons: ['Contact from database'],
            capabilities: [],
            discovered_via: 'trade_show',
          });
        }
      }
    }

    // Sort by match confidence
    return matches.sort((a, b) => b.match_confidence - a.match_confidence);
  }

  private contactMatchesRFQ(contact: any, partsDescription: string): boolean {
    const description = partsDescription.toLowerCase();
    const companyName = (contact.company || '').toLowerCase();
    const notes = (contact.notes || '').toLowerCase();

    // Check for manufacturing keywords
    const keywords = [
      'manufactur', 'machin', 'fabricat', 'mold', 'cast', 'cnc',
      'precision', 'custom', 'part', 'component',
    ];

    return keywords.some((keyword) =>
      description.includes(keyword) &&
      (companyName.includes(keyword) || notes.includes(keyword))
    );
  }

  /**
   * Broadcast RFQ to all matching vendors via multiple channels
   */
  async broadcastRFQ(request: RFQBroadcastRequest): Promise<{
    success: boolean;
    vendors_contacted: number;
    channels_used: string[];
    errors?: string[];
  }> {
    const supabase = createSupabaseAdmin();
    const errors: string[] = [];
    const channelsUsed = new Set<string>();
    let vendorsContacted = 0;

    // 1. Find matching vendors
    const matches = await this.findMatchingVendors(
      request.parts_description,
      request.technical_requirements
    );

    if (matches.length === 0) {
      return {
        success: false,
        vendors_contacted: 0,
        channels_used: [],
        errors: ['No matching vendors found'],
      };
    }

    // 2. Send RFQ to each vendor via selected channels
    const channels = request.channels || ['email', 'portal'];
    
    for (const match of matches) {
      try {
        // Record RFQ-vendor relationship
        const { error: rfqVendorError } = await supabase
          .from('rfq_vendors')
          .insert({
            rfq_id: request.rfq_id,
            vendor_id: match.vendor_id,
            channel: channels[0], // Primary channel
            sent_date: new Date().toISOString(),
          });

        if (rfqVendorError && !rfqVendorError.message.includes('duplicate')) {
          errors.push(`Failed to record RFQ for ${match.vendor_name}: ${rfqVendorError.message}`);
          continue;
        }

        // Send via each channel
        for (const channel of channels) {
          try {
            await this.sendViaChannel(channel, match, request);
            channelsUsed.add(channel);
            vendorsContacted++;
          } catch (error: any) {
            errors.push(`Failed to send to ${match.vendor_name} via ${channel}: ${error.message}`);
          }
        }
      } catch (error: any) {
        errors.push(`Error processing vendor ${match.vendor_name}: ${error.message}`);
      }
    }

    // 3. Update RFQ status
    await supabase
      .from('rfqs')
      .update({ status: 'sent' })
      .eq('rfq_id', request.rfq_id);

    return {
      success: errors.length < matches.length,
      vendors_contacted: vendorsContacted,
      channels_used: Array.from(channelsUsed),
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  private async sendViaChannel(
    channel: string,
    vendor: VendorMatch,
    request: RFQBroadcastRequest
  ): Promise<void> {
    switch (channel) {
      case 'email':
        if (vendor.email) {
          await this.sendEmail(vendor.email, vendor, request);
        }
        break;
      case 'linkedin':
        if (vendor.linkedin_url) {
          await this.sendLinkedInMessage(vendor.linkedin_url, vendor, request);
        }
        break;
      case 'portal':
        // Portal posting handled separately
        break;
      case 'sms':
        // SMS sending (implement if needed)
        break;
    }
  }

  private async sendEmail(
    email: string,
    vendor: VendorMatch,
    request: RFQBroadcastRequest
  ): Promise<void> {
    // TODO: Implement email sending via SendGrid/Resend
    // For now, log it
    console.log(`Sending RFQ email to ${email}`, {
      vendor: vendor.vendor_name,
      rfq_id: request.rfq_id,
    });
  }

  private async sendLinkedInMessage(
    linkedinUrl: string,
    vendor: VendorMatch,
    request: RFQBroadcastRequest
  ): Promise<void> {
    // TODO: Implement LinkedIn messaging via LinkedIn API
    console.log(`Sending LinkedIn message to ${linkedinUrl}`, {
      vendor: vendor.vendor_name,
      rfq_id: request.rfq_id,
    });
  }
}

export const rfqBroadcastService = new RFQBroadcastService();


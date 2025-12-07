/**
 * Vendor Discovery Service
 * Web scraping and search to find US manufacturers who can make custom parts
 */

import { createSupabaseAdmin } from '@/lib/database/supabase-client';
import { OpenAI } from 'openai';
import * as cheerio from 'cheerio';

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return new OpenAI({ apiKey });
}

export interface VendorDiscoveryRequest {
  part_description: string;
  technical_requirements?: Record<string, any>;
  materials?: string[];
  processes?: string[];
  quantity?: number;
  geographic_preference?: string[];
}

export interface DiscoveredVendor {
  company_name: string;
  website?: string;
  email?: string;
  phone?: string;
  location?: string;
  capabilities: string[];
  match_confidence: number;
  source: string;
  raw_data?: Record<string, any>;
}

export class VendorDiscoveryService {
  /**
   * Discover vendors via web scraping and search
   */
  async discoverVendors(request: VendorDiscoveryRequest): Promise<DiscoveredVendor[]> {
    const vendors: DiscoveredVendor[] = [];

    // 1. Search Google for manufacturers
    const searchResults = await this.searchGoogle(request);
    vendors.push(...searchResults);

    // 2. Scrape manufacturer directories
    const directoryResults = await this.scrapeDirectories(request);
    vendors.push(...directoryResults);

    // 3. Search industry-specific databases
    const industryResults = await this.searchIndustryDatabases(request);
    vendors.push(...industryResults);

    // 4. Deduplicate and rank
    return this.deduplicateAndRank(vendors);
  }

  /**
   * Search Google for US manufacturers
   */
  private async searchGoogle(request: VendorDiscoveryRequest): Promise<DiscoveredVendor[]> {
    // TODO: Implement Google Custom Search API or SerpAPI
    // For now, return mock data structure
    const searchQuery = this.buildSearchQuery(request);
    
    console.log('Searching Google for:', searchQuery);
    
    // Example query: "custom electric motor parts manufacturer USA"
    // This would use Google Custom Search API or SerpAPI
    
    return [];
  }

  /**
   * Scrape manufacturer directories (ThomasNet, MFG.com, etc.)
   */
  private async scrapeDirectories(request: VendorDiscoveryRequest): Promise<DiscoveredVendor[]> {
    const vendors: DiscoveredVendor[] = [];

    // Directory URLs to scrape
    const directories = [
      'https://www.thomasnet.com',
      'https://www.mfg.com',
      'https://www.mfgquote.com',
      // Add more directories
    ];

    for (const directoryUrl of directories) {
      try {
        const results = await this.scrapeDirectory(directoryUrl, request);
        vendors.push(...results);
      } catch (error) {
        console.error(`Error scraping ${directoryUrl}:`, error);
      }
    }

    return vendors;
  }

  private async scrapeDirectory(
    directoryUrl: string,
    request: VendorDiscoveryRequest
  ): Promise<DiscoveredVendor[]> {
    // TODO: Implement Puppeteer/Playwright scraping
    // This would:
    // 1. Navigate to directory
    // 2. Search for keywords
    // 3. Extract vendor listings
    // 4. Parse vendor details
    
    return [];
  }

  /**
   * Search industry-specific databases
   */
  private async searchIndustryDatabases(
    request: VendorDiscoveryRequest
  ): Promise<DiscoveredVendor[]> {
    // Industry databases:
    // - NEMA member directory
    // - IEEE member companies
    // - Manufacturing association directories
    
    return [];
  }

  /**
   * Use AI to extract vendor information from scraped data
   */
  async extractVendorInfo(html: string, url: string): Promise<Partial<DiscoveredVendor> | null> {
    const $ = cheerio.load(html);
    
    // Extract basic info
    const textContent = $('body').text().slice(0, 5000); // Limit to avoid token limits
    
    const extractionPrompt = `Extract vendor/manufacturer information from this webpage content.

URL: ${url}
Content: ${textContent}

Extract:
1. Company name
2. Email address (if visible)
3. Phone number (if visible)
4. Location/address
5. Capabilities (manufacturing processes, materials, services)
6. Industries served

Return JSON:
{
  "company_name": "Company Name",
  "email": "email@example.com",
  "phone": "+1-xxx-xxx-xxxx",
  "location": "City, State",
  "capabilities": ["CNC Machining", "Injection Molding", ...],
  "industries": ["Automotive", "Aerospace", ...]
}`;

    try {
      const openai = getOpenAI();
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You extract structured vendor information from web pages. Return only valid JSON.',
          },
          {
            role: 'user',
            content: extractionPrompt,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const extracted = JSON.parse(completion.choices[0].message.content || '{}');
      
      return {
        company_name: extracted.company_name,
        email: extracted.email,
        phone: extracted.phone,
        location: extracted.location,
        capabilities: extracted.capabilities || [],
        source: 'web_scraping',
        raw_data: extracted,
      };
    } catch (error) {
      console.error('AI extraction error:', error);
      return null;
    }
  }

  /**
   * Save discovered vendors to database
   */
  async saveDiscoveredVendor(vendor: DiscoveredVendor): Promise<string | null> {
    const supabase = createSupabaseAdmin();

    // Check if vendor already exists
    const { data: existing } = await supabase
      .from('vendors')
      .select('vendor_id')
      .eq('vendor_name', vendor.company_name)
      .single();

    if (existing) {
      return existing.vendor_id;
    }

    // Insert new vendor
    const { data, error } = await supabase
      .from('vendors')
      .insert({
        vendor_name: vendor.company_name,
        contact_email: vendor.email,
        contact_phone: vendor.phone,
        website: vendor.website,
        address: vendor.location ? { location: vendor.location } : {},
        capabilities: vendor.capabilities,
        discovered_via: 'scraping',
        is_verified: false,
        notes: `Discovered via web scraping. Match confidence: ${vendor.match_confidence}`,
      })
      .select('vendor_id')
      .single();

    if (error) {
      console.error('Error saving vendor:', error);
      return null;
    }

    return data?.vendor_id || null;
  }

  private buildSearchQuery(request: VendorDiscoveryRequest): string {
    const parts = [
      'custom',
      request.part_description,
      'manufacturer',
      'USA',
    ];

    if (request.materials && request.materials.length > 0) {
      parts.push(request.materials[0]);
    }

    if (request.processes && request.processes.length > 0) {
      parts.push(request.processes[0]);
    }

    return parts.join(' ');
  }

  private deduplicateAndRank(vendors: DiscoveredVendor[]): DiscoveredVendor[] {
    // Group by company name
    const vendorMap = new Map<string, DiscoveredVendor>();

    for (const vendor of vendors) {
      const key = vendor.company_name.toLowerCase().trim();
      const existing = vendorMap.get(key);

      if (!existing || vendor.match_confidence > existing.match_confidence) {
        vendorMap.set(key, vendor);
      } else {
        // Merge data
        if (!existing.email && vendor.email) existing.email = vendor.email;
        if (!existing.phone && vendor.phone) existing.phone = vendor.phone;
        if (!existing.website && vendor.website) existing.website = vendor.website;
        existing.capabilities = [...new Set([...existing.capabilities, ...vendor.capabilities])];
      }
    }

    // Sort by confidence
    return Array.from(vendorMap.values())
      .sort((a, b) => b.match_confidence - a.match_confidence);
  }
}

export const vendorDiscoveryService = new VendorDiscoveryService();


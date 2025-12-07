import { NextRequest, NextResponse } from 'next/server';

// Vapi.ai Voice Webhook Handler
// Handles incoming voice calls and routes to appropriate agents

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { type, message, call } = payload;

    console.log('Voice webhook received:', type);

    switch (type) {
      case 'call.started':
        return handleCallStarted(call);

      case 'transcript':
        return handleTranscript(message, call);

      case 'function.call':
        return handleFunctionCall(payload);

      case 'call.ended':
        return handleCallEnded(call);

      default:
        return NextResponse.json({ received: true });
    }
  } catch (error) {
    console.error('Voice webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

function handleCallStarted(call: unknown) {
  console.log('Call started:', call);
  
  // TODO: Log call in database
  // TODO: Look up caller info if phone number recognized
  
  return NextResponse.json({
    received: true,
    greeting: 'Thank you for calling Ace Electric Motor and Pump Company. How can I help you today?',
  });
}

function handleTranscript(message: string, call: unknown) {
  console.log('Transcript:', message, call);
  
  // Analyze the transcript for intent
  const intent = analyzeVoiceIntent(message);
  
  return NextResponse.json({
    received: true,
    intent,
    shouldTransfer: intent === 'human_transfer',
  });
}

async function handleFunctionCall(payload: { function: { name: string; arguments: Record<string, unknown> } }) {
  const { function: func } = payload;
  
  switch (func.name) {
    case 'search_parts':
      // TODO: Query parts database
      return NextResponse.json({
        result: {
          found: true,
          parts: [],
          message: 'I found several matching parts. Would you like me to email you the details?',
        },
      });

    case 'create_quote_request':
      // TODO: Create RFQ in database
      return NextResponse.json({
        result: {
          success: true,
          rfqNumber: `RFQ-${Date.now()}`,
          message: 'I\'ve created a quote request. Our team will contact you within 24 hours.',
        },
      });

    case 'check_stock':
      // TODO: Check inventory
      return NextResponse.json({
        result: {
          inStock: true,
          quantity: 5,
          leadTime: '1-2 business days',
        },
      });

    case 'transfer_to_human':
      return NextResponse.json({
        result: {
          transfer: true,
          department: func.arguments.department || 'sales',
          message: 'Let me transfer you to our team now.',
        },
      });

    default:
      return NextResponse.json({
        result: { error: 'Unknown function' },
      });
  }
}

function handleCallEnded(call: unknown) {
  console.log('Call ended:', call);
  
  // TODO: Log call summary
  // TODO: Create follow-up tasks if needed
  
  return NextResponse.json({ received: true });
}

function analyzeVoiceIntent(transcript: string): string {
  const lower = transcript.toLowerCase();
  
  if (lower.includes('speak to') || lower.includes('talk to') || lower.includes('transfer')) {
    return 'human_transfer';
  }
  if (lower.includes('quote') || lower.includes('price')) {
    return 'quote_request';
  }
  if (lower.includes('order') || lower.includes('status')) {
    return 'order_inquiry';
  }
  if (lower.includes('stock') || lower.includes('available')) {
    return 'stock_check';
  }
  if (lower.includes('part') || lower.includes('motor') || lower.includes('pump')) {
    return 'part_search';
  }
  
  return 'general_inquiry';
}

// Vapi Assistant Configuration Export
export async function GET() {
  // Return Vapi assistant configuration for reference
  return NextResponse.json({
    assistant: {
      name: 'Ace Electric Assistant',
      voice: 'jennifer', // Vapi voice
      model: 'gpt-4o-mini',
      systemPrompt: `You are a helpful assistant for Ace Electric Motor and Pump Company in Stockton, California.

Your role is to:
1. Help customers find parts (motors, pumps, gearboxes)
2. Create quote requests
3. Check stock availability
4. Answer technical questions about industrial equipment
5. Transfer to human agents when needed

Be professional, friendly, and efficient. If you don't know something, offer to transfer to a human agent.

Company hours: Monday-Friday 7am-5pm PST
Emergency line available 24/7 for critical equipment failures.`,
      functions: [
        {
          name: 'search_parts',
          description: 'Search for parts in the catalog',
          parameters: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'Part search query' },
              category: { type: 'string', description: 'Part category (motors, pumps, gearboxes)' },
            },
          },
        },
        {
          name: 'create_quote_request',
          description: 'Create a new quote request',
          parameters: {
            type: 'object',
            properties: {
              partDescription: { type: 'string', description: 'Description of needed part' },
              quantity: { type: 'number', description: 'Quantity needed' },
              urgency: { type: 'string', description: 'Urgency level' },
            },
          },
        },
        {
          name: 'check_stock',
          description: 'Check if a part is in stock',
          parameters: {
            type: 'object',
            properties: {
              partNumber: { type: 'string', description: 'Part number to check' },
            },
          },
        },
        {
          name: 'transfer_to_human',
          description: 'Transfer the call to a human agent',
          parameters: {
            type: 'object',
            properties: {
              department: { type: 'string', description: 'Department (sales, support, technical)' },
              reason: { type: 'string', description: 'Reason for transfer' },
            },
          },
        },
      ],
    },
  });
}


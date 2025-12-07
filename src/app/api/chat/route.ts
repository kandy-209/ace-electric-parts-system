import { NextRequest, NextResponse } from 'next/server';

// AI Chat endpoint - processes customer questions and routes to appropriate agents
export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    // Analyze intent from message
    const intent = analyzeIntent(message);

    // Generate response based on intent
    const response = await generateResponse(message, intent, history);

    return NextResponse.json({ response, intent });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

function analyzeIntent(message: string): string {
  const lowerMessage = message.toLowerCase();

  // Part search intent
  if (
    lowerMessage.includes('find') ||
    lowerMessage.includes('looking for') ||
    lowerMessage.includes('need') ||
    lowerMessage.includes('part')
  ) {
    return 'part_search';
  }

  // Quote request intent
  if (
    lowerMessage.includes('quote') ||
    lowerMessage.includes('price') ||
    lowerMessage.includes('cost') ||
    lowerMessage.includes('how much')
  ) {
    return 'quote_request';
  }

  // Stock check intent
  if (
    lowerMessage.includes('stock') ||
    lowerMessage.includes('available') ||
    lowerMessage.includes('in stock') ||
    lowerMessage.includes('availability')
  ) {
    return 'stock_check';
  }

  // Order status intent
  if (
    lowerMessage.includes('order') ||
    lowerMessage.includes('status') ||
    lowerMessage.includes('shipping') ||
    lowerMessage.includes('tracking')
  ) {
    return 'order_status';
  }

  // Support/sales intent
  if (
    lowerMessage.includes('speak') ||
    lowerMessage.includes('talk') ||
    lowerMessage.includes('call') ||
    lowerMessage.includes('help')
  ) {
    return 'human_support';
  }

  // Technical question
  if (
    lowerMessage.includes('specs') ||
    lowerMessage.includes('specification') ||
    lowerMessage.includes('compatible') ||
    lowerMessage.includes('fit')
  ) {
    return 'technical_question';
  }

  return 'general';
}

async function generateResponse(
  message: string,
  intent: string,
  _history: unknown[]
): Promise<string> {
  // TODO: Integrate with OpenAI GPT-4o for intelligent responses
  // For now, return helpful pre-built responses based on intent

  switch (intent) {
    case 'part_search':
      return `I'd be happy to help you find a part! To give you the best results, could you provide any of the following:

• Part number (if known)
• Manufacturer name
• Motor/pump specifications (HP, voltage, RPM)
• Application or equipment it's used in

You can also browse our catalog at /parts or submit a detailed RFQ at /rfq and our team will find exactly what you need.`;

    case 'quote_request':
      return `Great! I can help you get a quote. Here are your options:

1. **Quick Quote**: Tell me the part number and quantity, and I'll provide an estimate.

2. **Detailed RFQ**: Visit /rfq to submit a formal request with all specifications. Our team responds within 24 hours.

3. **Call Us**: For immediate pricing, call (209) 555-1234.

What part are you looking to get pricing on?`;

    case 'stock_check':
      return `I can check stock availability for you. Please provide:

• The part number, OR
• A description of the part (manufacturer, specs)

Most common parts are in stock with 1-2 day shipping. For specialty items, we can usually source within 1-2 weeks.

What part would you like me to check?`;

    case 'order_status':
      return `I'd be happy to check your order status! Please provide your:

• Order number, OR
• PO number

If you don't have your order number handy, you can also call our team at (209) 555-1234 with your company name.`;

    case 'human_support':
      return `Absolutely! Here's how to reach our team:

📞 **Phone**: (209) 555-1234
📧 **Email**: sales@aceelectricmotor.com
🕐 **Hours**: Mon-Fri 7am-5pm PST

For urgent after-hours needs, call our emergency line: (209) 555-9999

Would you like me to have someone call you back?`;

    case 'technical_question':
      return `I can help with technical questions! Our expertise includes:

• **Motors**: NEMA frame dimensions, efficiency ratings, enclosure types
• **Pumps**: Flow rates, head calculations, material compatibility
• **Gearboxes**: Ratios, torque ratings, mounting configurations
• **Drives & Controls**: VFD sizing, PLC integration

What specific technical question do you have?`;

    default:
      return `Thanks for reaching out to Ace Electric Motor! I'm here to help with:

• 🔍 **Finding parts** - motors, pumps, gearboxes, controls
• 💰 **Getting quotes** - competitive pricing, quick turnaround
• 📦 **Checking stock** - real-time availability
• 🔧 **Technical support** - specs, compatibility, applications

What can I help you with today?`;
  }
}


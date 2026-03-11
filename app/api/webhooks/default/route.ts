import { NextResponse } from 'next/server';

// POST /api/webhooks/default - Default webhook handler
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Log the webhook event
    console.log('[Webhook] Received event:', {
      timestamp: new Date().toISOString(),
      path: request.url,
      body,
    });

    // Process the webhook
    // Add your custom logic here
    const result = {
      success: true,
      message: 'Webhook received',
      timestamp: new Date().toISOString(),
      data: body,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

// GET /api/webhooks/default - Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/webhooks/default',
    methods: ['GET', 'POST'],
  });
}

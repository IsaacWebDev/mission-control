import { NextRequest, NextResponse } from 'next/server';
import { fetchHealth } from '@/lib/openclaw';
import { handleApiError } from '@/lib/errorHandler';
import { GatewayError } from '@/lib/errors';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const health = await fetchHealth();
    
    if (!health) {
      throw new GatewayError('Health check returned no data');
    }
    
    return NextResponse.json(health, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

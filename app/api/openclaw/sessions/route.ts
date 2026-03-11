import { NextRequest, NextResponse } from 'next/server';
import { fetchSessions } from '@/lib/openclaw';
import { handleApiError } from '@/lib/errorHandler';
import { GatewayError, ValidationError } from '@/lib/errors';
import type { ApiResponse, SessionListResponse, Session } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<SessionListResponse>>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const agentId = searchParams.get('agentId');
    const activeOnly = searchParams.get('active');
    
    // Validate activeOnly parameter
    if (activeOnly && isNaN(parseInt(activeOnly))) {
      throw new ValidationError('Invalid active filter value', {
        received: activeOnly,
        expected: 'number (milliseconds)'
      });
    }
    
    // Fetch sessions from gateway
    const data = await fetchSessions(agentId || undefined);
    
    if (!data || !data.sessions) {
      throw new GatewayError('Failed to fetch sessions from gateway');
    }
    
    let sessions = (data.sessions || []).map((s: any) => ({
      sessionId: s.sessionKey || s.sessionId || '',
      agentId: s.agentId || 'main',
      status: (s.state === 'running' || s.ageMs < 300000) ? 'active' : 'idle',
      createdAt: new Date(s.startedAt).getTime(),
      updatedAt: new Date(s.updatedAt).getTime(),
      ageMs: s.ageMs || 0,
    })) as Session[];
    
    // Filter active sessions
    if (activeOnly) {
      const maxAge = parseInt(activeOnly);
      sessions = sessions.filter((s: Session) => s.ageMs < maxAge);
    }
    
    return NextResponse.json({
      data: {
        sessions,
        total: data.count || sessions.length,
        active: sessions.filter((s: Session) => s.status === 'active').length,
        timestamp: new Date(),
      },
      timestamp: new Date(),
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

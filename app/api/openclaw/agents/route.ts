import { NextRequest, NextResponse } from 'next/server';
import { fetchHealth, transformAgent } from '@/lib/openclaw';
import type { Agent, AgentListResponse, ApiResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<AgentListResponse>>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const statusFilter = searchParams.get('status');
    const searchQuery = searchParams.get('search');
    
    const health = await fetchHealth();
    let agents: Agent[] = health.agents.map(transformAgent);
    
    // Filter by status
    if (statusFilter) {
      agents = agents.filter((a) => a.status === statusFilter);
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      agents = agents.filter((a) =>
        a.agentId.toLowerCase().includes(query)
      );
    }
    
    return NextResponse.json({
      data: {
        agents,
        total: agents.length,
        timestamp: new Date(),
      },
      timestamp: new Date(),
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Agents fetch error:', error);
    
    return NextResponse.json(
      {
        error: {
          code: 'AGENTS_FETCH_FAILED',
          message: errorMessage,
        },
        timestamp: new Date(),
      },
      { status: 500 }
    );
  }
}

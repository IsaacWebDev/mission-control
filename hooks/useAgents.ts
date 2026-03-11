import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { AgentFilter, AgentListResponse } from '@/lib/types';

export function useAgents(filter?: AgentFilter): UseQueryResult<AgentListResponse, Error> {
  return useQuery({
    queryKey: ['agents', filter],
    queryFn: async (): Promise<AgentListResponse> => {
      const params = new URLSearchParams();
      if (filter?.status) params.set('status', filter.status);
      if (filter?.search) params.set('search', filter.search);
      
      const response = await fetch(`/api/openclaw/agents?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }
      return response.json();
    },
    refetchInterval: 15 * 1000, // 15 seconds
    retry: 3,
    staleTime: 5 * 1000,
  });
}

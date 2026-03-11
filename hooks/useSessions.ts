import { useQuery } from '@tanstack/react-query';
import type { ApiResponse, SessionListResponse, SessionFilter } from '@/lib/types';

export function useSessions(filter?: SessionFilter) {
  return useQuery({
    queryKey: ['sessions', filter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter?.agentId) params.set('agentId', filter.agentId);
      if (filter?.active !== undefined) {
        const activeValue = typeof filter.active === 'number' ? filter.active : 7200000;
        params.set('active', activeValue.toString());
      }
      
      const response = await fetch(`/api/openclaw/sessions?${params}`);
      
      if (!response.ok) {
        const errorData: ApiResponse<never> = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch sessions');
      }
      
      const result: ApiResponse<SessionListResponse> = await response.json();
      
      // Return data in expected format for backwards compatibility
      return {
        sessions: result.data?.sessions || [],
        count: result.data?.total || 0,
        total: result.data?.total || 0,
        active: result.data?.active || 0,
      };
    },
    refetchInterval: 10 * 1000, // 10 seconds
    retry: 3,
    staleTime: 5 * 1000,
  });
}

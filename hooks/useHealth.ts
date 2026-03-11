import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { SystemHealth } from '@/lib/types';

export function useHealth(): UseQueryResult<SystemHealth, Error> {
  return useQuery({
    queryKey: ['health'],
    queryFn: async (): Promise<SystemHealth> => {
      const response = await fetch('/api/openclaw/health');
      if (!response.ok) {
        throw new Error('Health check failed');
      }
      return response.json();
    },
    refetchInterval: 30 * 1000, // 30 seconds
    retry: 3,
    staleTime: 10 * 1000, // Consider fresh for 10 seconds
  });
}

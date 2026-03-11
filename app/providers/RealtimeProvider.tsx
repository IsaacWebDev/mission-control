'use client';

import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  // Initialize realtime notifications
  useRealtimeNotifications();

  return <>{children}</>;
}

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useWebSocket } from './useWebSocket';
import type { WebSocketMessage } from '@/lib/types';

interface NotificationData {
  message?: string;
  error?: string;
  source?: string;
  context?: string;
  task?: string;
  description?: string;
  agentId?: string;
  sessionId?: string;
}

export function useRealtimeNotifications() {
  const { isConnected, lastMessage } = useWebSocket({
    url: 'ws://127.0.0.1:18789',
    autoReconnect: true,
    onOpen: () => {
      console.log('[Notifications] WebSocket connected');
    },
    onClose: () => {
      console.log('[Notifications] WebSocket disconnected');
    },
  });

  useEffect(() => {
    if (!lastMessage) return;

    handleNotification(lastMessage);
  }, [lastMessage]);

  return { isConnected };
}

function handleNotification(message: WebSocketMessage) {
  const { type, payload } = message;
  const data = payload as NotificationData;

  switch (type) {
    case 'error':
      toast.error(data.message || data.error || 'An error occurred', {
        description: data.source || data.context,
        duration: 5000,
      });
      break;

    case 'task_completed':
      toast.success(`Task completed: ${data.task || data.description}`, {
        description: data.agentId ? `Agent: ${data.agentId}` : undefined,
        duration: 4000,
      });
      break;

    case 'agent_spawned':
      toast.info(`Agent spawned: ${data.agentId}`, {
        description: data.task ? `Task: ${data.task}` : undefined,
        duration: 3000,
      });
      break;

    case 'session_started':
      toast.info('New session started', {
        description: data.agentId || data.sessionId?.slice(0, 12),
        duration: 3000,
      });
      break;

    case 'session_ended':
      toast.info('Session ended', {
        description: data.sessionId?.slice(0, 12),
        duration: 3000,
      });
      break;

    case 'warning':
      toast.warning(data.message || 'Warning', {
        description: data.context,
        duration: 4000,
      });
      break;

    default:
      // Don't show toast for unknown events
      console.log('[Notifications] Unhandled event type:', type);
  }
}

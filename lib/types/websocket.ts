export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface WebSocketMessage {
  type: string;
  payload: unknown;
  timestamp: number;
}

export interface RealtimeNotification {
  id: string;
  type: 'agent' | 'session' | 'health' | 'log';
  action: 'created' | 'updated' | 'deleted';
  data: unknown;
  timestamp: number;
}

export interface WebSocketState {
  status: WebSocketStatus;
  error?: Error;
  lastMessage?: WebSocketMessage;
  reconnectAttempts: number;
}

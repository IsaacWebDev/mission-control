export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}

// Specific error types
export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(
      'NOT_FOUND',
      `${resource}${id ? ` with id ${id}` : ''} not found`,
      404
    );
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super('VALIDATION_ERROR', message, 400, details);
  }
}

export class GatewayError extends AppError {
  constructor(message: string) {
    super('GATEWAY_ERROR', 'OpenClaw Gateway is unavailable', 503, { original: message });
  }
}

export class RateLimitError extends AppError {
  constructor() {
    super('RATE_LIMIT_EXCEEDED', 'Too many requests. Please try again later.', 429);
  }
}

// User-friendly error messages
export const ERROR_MESSAGES = {
  GATEWAY_OFFLINE: 'Unable to connect to OpenClaw. Please check if the gateway is running.',
  AGENTS_FETCH_FAILED: 'Failed to load agents. Please try again.',
  SESSIONS_FETCH_FAILED: 'Failed to load sessions. Please try again.',
  INVALID_REQUEST: 'Invalid request. Please check your input.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again later.',
};

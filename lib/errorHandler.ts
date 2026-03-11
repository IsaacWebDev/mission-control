import { NextResponse } from 'next/server';
import { AppError, ERROR_MESSAGES } from './errors';

export interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: Date;
}

export function handleApiError(error: unknown): NextResponse<ApiResponse<never>> {
  console.error('API Error:', error);

  // Known AppError
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.toJSON(),
        timestamp: new Date(),
      },
      { status: error.statusCode }
    );
  }

  // Unknown error - don't expose internals
  const userMessage = error instanceof Error 
    ? ERROR_MESSAGES.UNKNOWN_ERROR 
    : ERROR_MESSAGES.UNKNOWN_ERROR;

  return NextResponse.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: userMessage,
      },
      timestamp: new Date(),
    },
    { status: 500 }
  );
}

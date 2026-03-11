export interface ApiError {
  ok: false;
  error: string;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  timestamp?: Date;
}

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type FilterParams = {
  search?: string;
  status?: string;
  agent?: string;
  timeRange?: string;
};

export interface ErrorResponse {
  ok: false;
  error: string;
  message: string;
}

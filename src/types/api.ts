// API Response wrapper
export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

// Error response
export interface ApiError {
  error: string;
  message?: string;
}

// Pagination
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

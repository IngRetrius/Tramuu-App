export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

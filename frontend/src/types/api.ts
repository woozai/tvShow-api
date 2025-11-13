// Generic list response used by our API wrappers
export interface ApiListResponse<T> {
  page?: number;
  count: number;
  items: T[];
}

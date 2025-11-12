// Generic list response used by our API wrappers
export interface ApiListResponse<T> {
  count: number;
  items: T[];
}

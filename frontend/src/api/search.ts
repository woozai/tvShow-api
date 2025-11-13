import type { ApiListResponse } from "../types/api";
import type { SearchResult } from "../types/saerchResults";
import { apiGet } from "./client";

export function searchShows(
  query: string
): Promise<ApiListResponse<SearchResult>> {
  return apiGet<ApiListResponse<SearchResult>>(
    `/api/search?q=${encodeURIComponent(query)}`
  );
}

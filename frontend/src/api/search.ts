import type { ApiListResponse } from "../types/api";
import { apiGet } from "./client";

export function searchShows(query: string): Promise<ApiListResponse<Show>> {
  return apiGet<ApiListResponse<Show>>(
    `/api/search?q=${encodeURIComponent(query)}`
  );
}

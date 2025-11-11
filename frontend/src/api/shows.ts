import type { ApiListResponse } from "../types/api";
import type { Show } from "../types/show";
import { apiGet } from "./client";

export async function getPopularShows(): Promise<ApiListResponse<Show>> {
  const res = await apiGet<ApiListResponse<Show>>("/api/shows");
  return res;
}

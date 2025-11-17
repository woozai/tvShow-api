import type { ApiListResponse } from "../types/api";
import type { Show } from "../types/show";
import { apiGet } from "./client";

export async function getPopularShows(
  page: number = 0,
  limit: number = 20
): Promise<ApiListResponse<Show>> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));

  return apiGet<ApiListResponse<Show>>(`/api/shows?${params.toString()}`);
}
export async function getShowWithSeasonsAndCast(id: number): Promise<Show> {
  return apiGet<Show>(`/api/shows/${id}?embed[]=seasons&embed[]=cast`);
}

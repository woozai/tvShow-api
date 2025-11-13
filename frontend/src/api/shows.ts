import type { ApiListResponse } from "../types/api";
import type { Show } from "../types/show";
import { apiGet } from "./client";

export async function getPopularShows(): Promise<ApiListResponse<Show>> {
  const res = await apiGet<ApiListResponse<Show>>("/api/shows");
  return res;
}
export async function getShowWithSeasonsAndCast(id: number): Promise<Show> {
  return apiGet<Show>(`/api/shows/${id}?embed[]=seasons&embed[]=cast`);
}
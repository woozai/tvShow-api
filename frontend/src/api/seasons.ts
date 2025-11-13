import type { ApiListResponse } from "../types/api";
import type { Episode } from "../types/show";
import { apiGet } from "./client";

/** Fetch episodes for a given TVMaze season id */
export async function getSeasonEpisodes(
  seasonId: number
): Promise<ApiListResponse<Episode>> {
  const res = await apiGet<ApiListResponse<Episode>>(
    `/api/seasons/${seasonId}/episodes`
  );
  return res;
}

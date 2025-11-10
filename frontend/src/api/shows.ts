import type { Show } from "../types/show";
import { apiGet } from "./client";

export function getPopularShows(): Promise<Show[]> {
  return apiGet<Show[]>("/api/shows");
}

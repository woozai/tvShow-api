import { httpGet } from "../utils/httpClient";
import type { TVMazeSearchResult } from "../types/api";

export async function searchShows(query: string) {
  return httpGet<TVMazeSearchResult[]>("/search/shows", {
    params: { q: query },
    timeoutMs: 8000,
  });
}

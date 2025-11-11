import { TVMazeShow } from "../types/api";
import { FilterParams } from "../types/filters";
import { applyFilters, applyLimit, applySort } from "../utils/filters";
import { httpGet } from "../utils/httpClient";
import { searchShows } from "./search.service";

export async function getShows(page: number = 0) {
  return httpGet<any[]>("/shows", {
    params: { page },
    timeoutMs: 8000,
  });
}

export async function getShowById(id: number) {
  return httpGet<any>(`/shows/${id}`, { timeoutMs: 8000 });
}

export async function getEpisodesByShowId(id: number) {
  return httpGet<any[]>(`/shows/${id}/episodes`, { timeoutMs: 8000 });
}

export async function getEpisodeById(id: number) {
  return httpGet<any>(`/episodes/${id}`, { timeoutMs: 8000 });
}

export async function getFilteredShows(p: FilterParams): Promise<TVMazeShow[]> {
  // Source selection
  let candidates: TVMazeShow[];
  if (p.q && p.q.trim()) {
    const searchResults = await searchShows(p.q.trim());
    // TVMaze search returns [{ score, show }], map to shows
    candidates = searchResults.map((r) => r.show);
  } else {
    const page = Number.isFinite(p.page) ? (p.page as number) : 0;
    candidates = await getShows(page);
  }

  const filtered = applyFilters(candidates, p);
  const sorted = applySort(filtered, p.sort, p.order ?? "desc");
  return applyLimit(sorted, p.limit ?? undefined);
}

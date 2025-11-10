import type { SearchResult } from "../types/searchResults";
import { apiGet } from "./client";

export function searchShows(query: string): Promise<SearchResult[]> {
  console.log(query);
  return apiGet<SearchResult[]>(`/api/search?q=${encodeURIComponent(query)}`);
}

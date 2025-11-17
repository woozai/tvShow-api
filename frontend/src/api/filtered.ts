import type { ApiListResponse } from "../types/api";
import type { Show } from "../types/show";
import type { FilterParams } from "../types/filterParams";
import { apiGet } from "./client";

// Helper: encode genres array to comma-separated string
function encodeGenres(genres?: string[]) {
  return genres && genres.length ? genres.join(",") : undefined;
}
// Helper: add number param only if defined and finite
function setNumberParam(
  params: URLSearchParams,
  key: string,
  value: number | undefined
) {
  if (typeof value === "number" && Number.isFinite(value)) {
    params.set(key, String(value));
  }
}
/** Build query string from FilterParams (only defined values) */
function toQuery(p: FilterParams): string {
  const params = new URLSearchParams();

  // Text search (backend reads as q)
  if (p.q) params.set("q", p.q);

  // Genres: backend expects `genres=Drama,Comedy`
  const genres = encodeGenres(p.genres);
  if (genres) params.set("genres", genres);

  // Language, status
  if (p.language) params.set("language", p.language);
  if (p.status) params.set("status", p.status);

  // Numeric filters
  setNumberParam(params, "rating_gte", p.rating_gte);
  setNumberParam(params, "year_min", p.year_min);
  setNumberParam(params, "year_max", p.year_max);

  // Sorting
  if (p.sort) params.set("sort", p.sort);
  if (p.order) params.set("order", p.order);

  // Pagination for filtered results (backend uses page + limit for offset)
  setNumberParam(params, "page", p.page);
  setNumberParam(params, "limit", p.limit);

  return params.toString();
}

// Fetch filtered shows from backend.
export async function getFilteredShows(
  p: FilterParams
): Promise<ApiListResponse<Show>> {
  const qs = toQuery(p);
  const url = qs ? `/api/shows/filter?${qs}` : "/api/shows/filter";
  return apiGet<ApiListResponse<Show>>(url);
}


// http://localhost:3000/api/shows/filter?genres=Drama&page=0&limit=20
// http://localhost:3000/api/shows/filter?genres=Comedy&sort=rating&order=desc&page=1&limit=20

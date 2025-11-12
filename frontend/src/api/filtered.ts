import type { ApiListResponse } from "../types/api";
import type { Show } from "../types/show";
import type { FilterParams } from "../types/filterParams";
import { apiGet } from "./client";

/** Helper: encode genres array to comma-separated string */
function encodeGenres(genres?: string[]) {
  return genres && genres.length ? genres.join(",") : undefined;
}

/** Build query string from FilterParams (only defined values) */
function toQuery(p: FilterParams): string {
  const params = new URLSearchParams();

  if (p.q) params.set("q", p.q);
  const genresCsv = encodeGenres(p.genres);
  if (genresCsv) params.set("genres", genresCsv);

  if (p.language) params.set("language", p.language);
  if (typeof p.rating_gte === "number")
    params.set("rating_gte", String(p.rating_gte));
  if (typeof p.year_min === "number")
    params.set("year_min", String(p.year_min));
  if (typeof p.year_max === "number")
    params.set("year_max", String(p.year_max));
  if (p.status) params.set("status", p.status);
  if (p.sort) params.set("sort", p.sort);
  if (p.order) params.set("order", p.order);
  if (typeof p.page === "number") params.set("page", String(p.page));
  if (typeof p.limit === "number") params.set("limit", String(p.limit));

  return params.toString();
}

// Fetch filtered shows from backend.
export async function getFilteredShows(
  p: FilterParams
): Promise<ApiListResponse<Show>> {
  const qs = toQuery(p);
  // example final URL: /api/shows/filter?genres=Drama,Comedy&language=English
  return apiGet<ApiListResponse<Show>>(`/api/shows/filter?${qs}`);
}

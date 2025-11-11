import { TVMazeShow } from "../types/api";
import { FilterParams } from "../types/filters";

export function applyShowsFilters(
  shows: TVMazeShow[],
  p: FilterParams
): TVMazeShow[] {
  let out = shows;

  // Filter by gnres

  if (p.genre) {
    const g = p.genre.toLowerCase();
    out = out.filter((s) =>
      (s.genres || []).some((x) => x.toLowerCase() === g)
    );
  }

  // Filter by rating, above chosen rating
  if (typeof p.rating_gte === "number") {
    out = out.filter((s) => (s.rating?.average ?? 0) >= p.rating_gte!);
  }

  // Filter by premiered year
  if (typeof p.year_min === "number" || typeof p.year_max === "number") {
    out = out.filter((s) => {
      const y = s.premiered ? Number(s.premiered.slice(0, 4)) : NaN;
      if (Number.isNaN(y)) return false;
      if (typeof p.year_min === "number" && y < p.year_min!) return false;
      if (typeof p.year_max === "number" && y > p.year_max!) return false;
      return true;
    });
  }

  // Filter by status
  if (p.status) {
    const st = p.status.toLowerCase();
    out = out.filter((s) => (s.status || "").toLowerCase() === st);
  }

  if (p.language) {
    const lang = p.language.toLowerCase();
    out = out.filter((s) => (s.language || "").toLowerCase() === lang);
  }

  return out;
}

// Sort
export function applyShowsSort(
  shows: TVMazeShow[],
  sort?: FilterParams["sort"],
  order: "asc" | "desc" = "desc"
) {
  if (!sort) return shows;
  const dir = order === "asc" ? 1 : -1;

  const cloned = [...shows];
  cloned.sort((a, b) => {
    let av = 0 as number | string;
    let bv = 0 as number | string;

    if (sort === "rating") {
      av = a.rating?.average ?? 0;
      bv = b.rating?.average ?? 0;
    }
    if (sort === "name") {
      av = a.name ?? "";
      bv = b.name ?? "";
    }
    if (sort === "premiered") {
      av = a.premiered ?? "";
      bv = b.premiered ?? "";
    }

    if (typeof av === "number" && typeof bv === "number")
      return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });

  return cloned;
}

export function applyShowsLimit<T>(shows: T[], limit?: number) {
  if (!limit || limit <= 0) return shows;
  return shows.slice(0, limit);
}

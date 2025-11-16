import { TVMazeEpisode, TVMazeSeason, TVMazeShow } from "../types/api";
import { FilterParams } from "../types/filters";
import {
  applyShowsFilters,
  applyShowsLimit,
  applyShowsSort,
} from "../utils/filters";
import { httpGet } from "../utils/httpClient";
import { searchShows } from "./search.service";

// TVMaze cache TTLs
const TVMAZE_SHOWS_PAGE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const TVMAZE_SHOW_DETAILS_TTL_MS = 30 * 60 * 1000; // 30 minutes
const TVMAZE_EPISODES_BY_SHOW_TTL_MS = 45 * 60 * 1000; // 45 minutes
const TVMAZE_EPISODES_BY_SEASON_TTL_MS = 45 * 60 * 1000; // 45 minutes
const MAX_FILTER_SCAN_UPSTREAM_PAGES = 19;

export interface FilterPagination {
  page: number;
  limit: number;
  offset: number;
}

/**
 * Compute pagination window from FilterParams.
 * Falls back to page=0 and limit=20 when not provided.
 */
export function getFilterPagination(p: FilterParams): FilterPagination {
  const rawPage = typeof p.page === "number" && p.page >= 0 ? p.page : 0;
  const rawLimit = typeof p.limit === "number" && p.limit > 0 ? p.limit : 20;

  const page = Math.floor(rawPage);
  const limit = Math.floor(rawLimit);
  const offset = page * limit;

  return { page, limit, offset };
}

// safety cap for scanning
export async function getShows(page: number = 0) {
  return httpGet<TVMazeShow[]>("/shows", {
    params: { page },
    timeoutMs: 8000,
    cacheTtlMs: TVMAZE_SHOWS_PAGE_TTL_MS,
  });
}

export async function getShowById(
  showId: number,
  opts?: { embed?: string | string[] }
) {
  const params: any = {};
  if (opts?.embed) {
    if (Array.isArray(opts.embed)) {
      // Multiple → TVMaze expects repeated "embed[]" keys
      params["embed[]"] = opts.embed;
    } else {
      // Single → "embed"
      params.embed = opts.embed;
    }
  }
  return httpGet<TVMazeShow>(`/shows/${showId}`, {
    params,
    timeoutMs: 8000,
    cacheTtlMs: TVMAZE_SHOW_DETAILS_TTL_MS,
  });
}

export async function getEpisodesByShowId(showId: number) {
  return httpGet<TVMazeEpisode[]>(`/shows/${showId}/episodes`, {
    timeoutMs: 8000,
    cacheTtlMs: TVMAZE_EPISODES_BY_SHOW_TTL_MS,
  });
}

export async function getEpisodesBySeasonId(seasonId: number) {
  return httpGet<TVMazeEpisode[]>(`/seasons/${seasonId}/episodes`, {
    timeoutMs: 8000,
    cacheTtlMs: TVMAZE_EPISODES_BY_SEASON_TTL_MS,
  });
}

export async function getFilteredShows(
  params: FilterParams
): Promise<TVMazeShow[]> {
  const limit = params.limit ?? 20;

  const collectedShows: TVMazeShow[] = [];
  let upstreamPageIndex = 0;
  let hasMoreUpstream = true;

  // -----------------------------------------------------
  // SAFETY LIMIT → do NOT fetch more than 30 TVMaze pages
  // -----------------------------------------------------
  while (
    collectedShows.length < limit &&
    hasMoreUpstream &&
    upstreamPageIndex < MAX_FILTER_SCAN_UPSTREAM_PAGES
  ) {
    // Cached fetch thanks to getShows() TTL
    const upstreamShows = await getShows(upstreamPageIndex);

    if (upstreamShows.length === 0) {
      // No more TVMaze pages
      hasMoreUpstream = false;
      break;
    }

    // Apply your existing filter logic
    const filteredOnPage = applyShowsFilters(upstreamShows, params);

    collectedShows.push(...filteredOnPage);

    upstreamPageIndex++;
  }

  // Final sort & slicing
  const sortedShows = applyShowsSort(
    collectedShows,
    params.sort,
    params.order ?? "desc"
  );

  // Return only up to limit
  return applyShowsLimit(sortedShows, limit);
}

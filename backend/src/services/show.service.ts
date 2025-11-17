import { TVMazeEpisode, TVMazeSeason, TVMazeShow } from "../types/api";
import { FilterParams } from "../types/filters";
import { applyShowsFilters, applyShowsSort } from "../utils/filters";
import { httpGet } from "../utils/httpClient";
import { getFilterPagination } from "../utils/pagination";
import { searchShows } from "./search.service";

// TVMaze cache TTLs
const TVMAZE_SHOWS_PAGE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const TVMAZE_SHOW_DETAILS_TTL_MS = 30 * 60 * 1000; // 30 minutes
const TVMAZE_EPISODES_BY_SHOW_TTL_MS = 45 * 60 * 1000; // 45 minutes
const TVMAZE_EPISODES_BY_SEASON_TTL_MS = 45 * 60 * 1000; // 45 minutes

const MAX_FILTER_SCAN_UPSTREAM_PAGES = 19;

export interface FilteredShowsResult {
  page: number;
  count: number; // total matches in THIS batch
  items: TVMazeShow[]; // up to `limit` items
}

export interface PagedShowsResult {
  page: number; // frontend page index (0-based)
  count: number; // number of items in this batch (<= limit)
  items: TVMazeShow[]; // the actual shows
}

// ----------------- low-level TVMaze access -----------------
export async function getShows(page: number = 0) {
  return httpGet<TVMazeShow[]>("/shows", {
    params: { page },
    timeoutMs: 8000,
    cacheTtlMs: TVMAZE_SHOWS_PAGE_TTL_MS,
  });
}

// Windowed pagination across multiple TVMaze /shows?page=N pages.
// - page: frontend page (0-based) -> 0 = first 20, 1 = next 20, etc.
// - limit: how many shows per frontend page (default 20)
export async function getShowsWindow(
  page: number = 0,
  limit: number = 20
): Promise<PagedShowsResult> {
  const safePage = !Number.isFinite(page) || page < 0 ? 0 : Math.floor(page);
  const safeLimit =
    !Number.isFinite(limit) || limit <= 0 ? 20 : Math.floor(limit);

  const startIndex = safePage * safeLimit; // global offset
  const items: TVMazeShow[] = [];

  let remainingToSkip = startIndex;
  let upstreamPageIndex = 0;
  let scannedPages = 0;
  const MAX_UPSTREAM_PAGES = 50; // safety guard

  while (items.length < safeLimit && scannedPages < MAX_UPSTREAM_PAGES) {
    const upstreamShows = await getShows(upstreamPageIndex);
    scannedPages++;

    // No more data from TVMaze → stop
    if (!upstreamShows.length) break;

    let from = 0;

    // Skip initial shows until we reach 'startIndex'
    if (remainingToSkip > 0) {
      if (remainingToSkip >= upstreamShows.length) {
        // skip whole page
        remainingToSkip -= upstreamShows.length;
        upstreamPageIndex++;
        continue;
      } else {
        // skip part of this page
        from = remainingToSkip;
        remainingToSkip = 0;
      }
    }

    const remainingInPage = upstreamShows.length - from;
    const remainingNeeded = safeLimit - items.length;
    const take = Math.min(remainingInPage, remainingNeeded);

    if (take > 0) {
      items.push(...upstreamShows.slice(from, from + take));
    }

    upstreamPageIndex++;
  }

  return {
    page: safePage,
    count: items.length,
    items,
  };
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

// ----------------- filtered shows helpers -----------------

/**
 * Collect candidate shows using TVMaze search API, then apply filters.
 */
async function collectFilteredShowsFromSearch(
  params: FilterParams
): Promise<TVMazeShow[]> {
  const q = params.q?.trim();
  if (!q) return [];

  const searchResults = await searchShows(q);
  const candidates = searchResults.map(({ show }) => show);

  return applyShowsFilters(candidates, params);
}

/**
 * Scan TVMaze /shows?page=N pages and collect matches that pass filters.
 * Uses getShows() which is cached.
 */
async function collectFilteredShowsFromUpstream(
  params: FilterParams
): Promise<TVMazeShow[]> {
  const allMatches: TVMazeShow[] = [];

  let upstreamPageIndex = 0;
  let hasMoreUpstream = true;

  while (
    hasMoreUpstream &&
    upstreamPageIndex < MAX_FILTER_SCAN_UPSTREAM_PAGES
  ) {
    const upstreamShows = await getShows(upstreamPageIndex);

    if (!upstreamShows.length) {
      hasMoreUpstream = false;
      break;
    }

    const filteredOnPage = applyShowsFilters(upstreamShows, params);
    if (filteredOnPage.length) {
      allMatches.push(...filteredOnPage);
    }

    upstreamPageIndex++;
  }

  return allMatches;
}

// ----------------- main filtered entrypoint -----------------

export async function getFilteredShows(
  params: FilterParams
): Promise<FilteredShowsResult> {
  const { page, limit, offset } = getFilterPagination(params);

  // 1) Collect matches (search mode vs scan mode)
  let matches: TVMazeShow[];
  if (params.q && params.q.trim()) {
    matches = await collectFilteredShowsFromSearch(params);
  } else {
    matches = await collectFilteredShowsFromUpstream(params);
  }

  // 2) Sort according to requested key + order
  const sortedMatches = applyShowsSort(
    matches,
    params.sort,
    params.order ?? "desc"
  );

  // 3) Slice the requested window
  const total = sortedMatches.length;
  const items = sortedMatches.slice(offset, offset + limit);

  return { page, count: total, items };
}

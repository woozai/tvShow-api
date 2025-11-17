import { Request, Response, NextFunction } from "express";
import * as showService from "../services/show.service";
import { FilterParams, SortKey } from "../types/filters";
import { getFilteredShows } from "../services/show.service";
import { qs, qn, qenum, qorder } from "../utils/queryParsers";
import { ApiError } from "../middlewares/errorHandler";

// ----------------- helpers -----------------

/**
 * Parse TVMaze embed query from Express query object.
 * Supports:
 *   ?embed=episodes
 *   ?embed[]=episodes&embed[]=cast
 */
function parseEmbedQuery(
  query: Request["query"]
): string | string[] | undefined {
  const e1 = query.embed;
  const e2 = (query as any)["embed[]"];

  if (Array.isArray(e1)) return e1 as string[];
  if (typeof e1 === "string" && e1) return e1;
  if (Array.isArray(e2)) return e2 as string[];
  if (typeof e2 === "string" && e2) return [e2];

  return undefined;
}

/**
 * Build FilterParams object from query string values.
 * Keeps all parsing / defaults in one place.
 */
function buildFilterParamsFromQuery(query: Request["query"]): FilterParams {
  const genresRaw = query.genres;
  const genres =
    typeof genresRaw === "string"
      ? genresRaw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  const q = qs(query.q);
  const language = qs(query.language);
  const ratingGte = qn(query.rating_gte);
  const yearMin = qn(query.year_min);
  const yearMax = qn(query.year_max);
  const status = qs(query.status);

  const sort =
    qenum<SortKey>(query.sort, ["rating", "name", "premiered"] as const) ??
    "rating";
  const order = qorder(query.order) ?? "desc";
  const page = qn(query.page) ?? 0;
  const limit = qn(query.limit) ?? 20;

  const p: FilterParams = {
    sort,
    order,
    page,
    limit,
  };

  if (q) p.q = q;
  if (genres.length) p.genres = genres;
  if (typeof ratingGte === "number") p.rating_gte = ratingGte;
  if (typeof yearMin === "number") p.year_min = yearMin;
  if (typeof yearMax === "number") p.year_max = yearMax;
  if (status) p.status = status;
  if (language) p.language = language;

  return p;
}

// ----------------- controllers -----------------

export async function listShows(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const rawPage = Number(req.query.page ?? 0);
    if (Number.isNaN(rawPage) || rawPage < 0) {
      return next(new ApiError(400, "'page' must be a non-negative number"));
    }

    // Fixed page size 20 for frontend
    const limit = 20;

    const result = await showService.getShowsWindow(rawPage, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function listEpisodesBySeason(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const seasonId = Number(req.params.seasonId);
    if (!Number.isFinite(seasonId) || seasonId <= 0) {
      return next(new ApiError(400, "Invalid season id"));
    }

    const items = await showService.getEpisodesBySeasonId(seasonId);

    // sort by episode number
    items.sort((a, b) => (a.number ?? 0) - (b.number ?? 0));

    res.json({ count: items.length, items });
  } catch (err) {
    next(err);
  }
}

export async function getShow(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return next(new ApiError(400, "Invalid show id"));
    }

    const embed = parseEmbedQuery(req.query);

    const data = await showService.getShowById(
      id,
      embed !== undefined ? { embed } : undefined
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function listEpisodesForShow(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return next(new ApiError(400, "Invalid show id"));
    }

    const data = await showService.getEpisodesByShowId(id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function listShowsWithFilters(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const params = buildFilterParamsFromQuery(req.query);
    const result = await getFilteredShows(params);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

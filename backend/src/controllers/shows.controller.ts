// apply same pattern to all early-returns
import { Request, Response, NextFunction } from "express";
import * as showService from "../services/show.service";
import { FilterParams, SortKey } from "../types/filters";
import { getFilteredShows } from "../services/show.service";
import { qs, qn, qenum, qorder } from "../utils/queryParsers";
import { ApiError } from "../middlewares/errorHandler";

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

    // Fixed page size 20 for frontend (can be made configurable via ?limit=… if you want)
    const limit = 20;

    const result = await showService.getShowsWindow(rawPage, limit);

    // result already has { page, count, items }
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
    // sort by episode number
    const items = await showService.getEpisodesBySeasonId(seasonId);
    items.sort((a, b) => (a.number ?? 0) - (b.number ?? 0));
    res.json({ count: items.length, items });
  } catch (err) {
    next(err);
  }
}

export async function getShow(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return next(new ApiError(400, "Invalid show id"));
    // Support both ?embed=episodes and ?embed[]=episodes&embed[]=cast

    const e1 = req.query.embed;
    const e2 = (req.query as any)["embed[]"];
    let embed: string | string[] | undefined;
    if (Array.isArray(e1)) embed = e1 as string[];
    else if (typeof e1 === "string" && e1) embed = e1;
    else if (Array.isArray(e2)) embed = e2 as string[];
    else if (typeof e2 === "string" && e2) embed = [e2];

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
    if (Number.isNaN(id)) return next(new ApiError(400, "Invalid show id"));

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
    // parse raw values
    const genresRaw = req.query.genres;
    const genresArr =
      typeof genresRaw === "string"
        ? genresRaw
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
    const q = qs(req.query.q);
    const language = qs(req.query.language);
    const ratingGte = qn(req.query.rating_gte);
    const yearMin = qn(req.query.year_min);
    const yearMax = qn(req.query.year_max);
    const status = qs(req.query.status);
    const sort =
      qenum<SortKey>(req.query.sort, [
        "rating",
        "name",
        "premiered",
      ] as const) ?? "rating";
    const order = qorder(req.query.order) ?? "desc";
    const page = qn(req.query.page) ?? 0;
    const limit = qn(req.query.limit) ?? 20;

    const p: FilterParams = { order, sort, page, limit };
    if (q) p.q = q;
    if (genresArr.length) p.genres = genresArr;
    if (typeof ratingGte === "number") p.rating_gte = ratingGte;
    if (typeof yearMin === "number") p.year_min = yearMin;
    if (typeof yearMax === "number") p.year_max = yearMax;
    if (status) p.status = status;
    if (typeof page === "number") p.page = page;
    if (typeof limit === "number") p.limit = limit;
    if (language) p.language = language;

    const result = await getFilteredShows(p);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

import { Request, Response, NextFunction } from "express";
import * as showService from "../services/show.service";
import { FilterParams, SortKey } from "../types/filters";
import { getFilteredShows } from "../services/show.service";
import { qs, qn, qenum, qorder } from "../utils/queryParsers";

export async function listShows(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const page = Number(req.query.page ?? 0);
    if (Number.isNaN(page) || page < 0)
      return res
        .status(400)
        .json({ error: "'page' must be a non-negative number" });

    const shows = await showService.getShows(page);
    res.json({
      page,
      count: shows.length,
      items: shows,
    });
  } catch (err) {
    next(err);
  }
}

export async function getShow(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id))
      return res.status(400).json({ error: "Invalid show id" });

    // Support both ?embed=episodes and ?embed[]=episodes&embed[]=cast
    const e1 = req.query.embed;
    const e2 = (req.query as any)["embed[]"];

    let embed: string | string[] | undefined;
    if (Array.isArray(e1)) embed = e1 as string[]; // rare with default parser
    else if (typeof e1 === "string" && e1) embed = e1;
    else if (Array.isArray(e2)) embed = e2 as string[];
    else if (typeof e2 === "string" && e2) embed = [e2];

    const data = await showService.getShowById(id, embed !== undefined ? { embed } : undefined);
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
    if (Number.isNaN(id))
      return res.status(400).json({ error: "Invalid show id" });

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
    const sort = qenum<SortKey>(req.query.sort, [
      "rating",
      "name",
      "premiered",
    ] as const);
    const order = qorder(req.query.order) ?? "desc";
    const page = qn(req.query.page);
    const limit = qn(req.query.limit);

    // build params without ever assigning `undefined`
    const p: FilterParams = { order }; // safe to always set
    if (q) p.q = q;
    if (genresArr.length) p.genres = genresArr;
    if (typeof ratingGte === "number") p.rating_gte = ratingGte;
    if (typeof yearMin === "number") p.year_min = yearMin;
    if (typeof yearMax === "number") p.year_max = yearMax;
    if (status) p.status = status;
    if (sort) p.sort = sort;
    if (typeof page === "number") p.page = page;
    if (typeof limit === "number") p.limit = limit;
    if (language) p.language = language;

    const items = await getFilteredShows(p);
    res.json({ count: items.length, items });
  } catch (err) {
    next(err);
  }
}

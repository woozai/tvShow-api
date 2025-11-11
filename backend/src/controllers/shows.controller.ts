import { Request, Response, NextFunction } from "express";
import * as showService from "../services/show.service";
import { FilterParams, SortKey } from "../types/filters";
import { getFilteredShows } from "../services/show.service";

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

    const data = await showService.getShows(page);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getShow(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id))
      return res.status(400).json({ error: "Invalid show id" });

    const data = await showService.getShowById(id);
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

// ---- helpers: parse query types safely ----
function qs(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}
function qn(v: unknown): number | undefined {
  if (typeof v !== "string") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}
function qenum<T extends string>(
  v: unknown,
  allowed: readonly T[]
): T | undefined {
  const s = qs(v);
  return s && (allowed as readonly string[]).includes(s) ? (s as T) : undefined;
}
function qorder(v: unknown): "asc" | "desc" | undefined {
  const s = qs(v)?.toLowerCase();
  return s === "asc" || s === "desc" ? s : undefined;
}

export async function listShowsWithFilters(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // parse raw values
    const q = qs(req.query.q);
    const language = qs(req.query.language);
    const genre = qs(req.query.genre);
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
    if (genre) p.genre = genre;
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

// only the guard change
import { Request, Response, NextFunction } from "express";
import * as searchService from "../services/search.service";
import { ApiError } from "../middlewares/errorHandler";

export async function searchShows(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const q = String(req.query.q || "").trim();
    if (!q) return next(new ApiError(400, "Query param 'q' is required"));

    const results = await searchService.searchShows(q);
    res.json({ count: results.length, items: results, page: 0 });
  } catch (err) {
    next(err);
  }
}

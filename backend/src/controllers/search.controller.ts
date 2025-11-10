import { Request, Response, NextFunction } from "express";
import * as searchService from "../services/search.service";

export async function searchShows(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const q = String(req.query.q || "").trim();
    if (!q)
      return res.status(400).json({ error: "Query param 'q' is required" });

    const results = await searchService.searchShows(q);
    res.json(results);
  } catch (err) {
    next(err);
  }
}

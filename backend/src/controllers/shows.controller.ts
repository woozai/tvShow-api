import { Request, Response, NextFunction } from "express";
import * as showService from "../services/show.service";

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

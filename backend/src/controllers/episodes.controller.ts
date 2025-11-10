import { Request, Response, NextFunction } from "express";
import { getEpisodeById } from "../services/show.service";

export async function getEpisode(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id))
      return res.status(400).json({ error: "Invalid episode id" });

    const data = await getEpisodeById(id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

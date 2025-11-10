import { Router } from "express";
import {
  listShows,
  getShow,
  listEpisodesForShow,
} from "../controllers/shows.controller";

const router = Router();

// GET /api/shows?page=0
router.get("/", listShows);

// GET /api/shows/:id
router.get("/:id", getShow);

// GET /api/shows/:id/episodes
router.get("/:id/episodes", listEpisodesForShow);

export default router;

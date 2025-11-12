import { Router } from "express";
import {
  listShows,
  getShow,
  listEpisodesForShow,
  listShowsWithFilters,
} from "../controllers/shows.controller";

const router = Router();

// GET /api/shows?page=0
router.get("/", listShows);

router.get("/:filter", listShowsWithFilters);
// GET /api/shows/:id
router.get("/:id", getShow);

// GET /api/shows/:id/episodes
router.get("/:id/episodes", listEpisodesForShow);

export default router;

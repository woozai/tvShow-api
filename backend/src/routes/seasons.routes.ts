import { Router } from "express";
import { listEpisodesBySeason } from "../controllers/shows.controller";

const router = Router();

router.get("/:seasonId/episodes", listEpisodesBySeason);

export default router;

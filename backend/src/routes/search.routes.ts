import { Router } from "express";
import { searchShows } from "../controllers/search.controller";

const router = Router();
router.get("/", searchShows); // GET /api/search?q=...
export default router;

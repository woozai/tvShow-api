import { Router } from "express";
import searchRoutes from "./search.routes";
import showRoutes from "./shows.routes";
// import episodeRoutes from "./episodes.routes";
import seasonsRoutes from "./seasons.routes";

const router = Router();

// Mount each route group
router.use("/search", searchRoutes);
router.use("/shows", showRoutes);
// router.use("/episodes", episodeRoutes);
router.use("/seasons", seasonsRoutes);

export default router;

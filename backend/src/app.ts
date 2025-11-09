import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { logger } from "./utils/logger";
import apiRouter from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api", apiRouter);

// Centralized error handler (must be last)
app.use(errorHandler);

export default app;

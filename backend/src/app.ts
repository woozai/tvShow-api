import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import { requestLogger } from "./middlewares/requestLogger";

import { z } from "zod";
import { validate } from "./middlewares/validate";

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.get(
  "/test-validate",
  validate(
    z.object({
      page: z.coerce.number().int().min(0),
    }),
    "query"
  ),
  (req, res) => {
    res.json({ ok: true, parsed: req.query });
  }
);

// app.use("/api", apiRouter);

// Centralized error handler (must be last)
app.use(errorHandler);

export default app;

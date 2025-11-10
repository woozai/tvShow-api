import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
};

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;

    // pick color
    const color =
      status >= 500 ? colors.red : status >= 400 ? colors.yellow : colors.green;

    logger.info(
      `${req.method} ${req.originalUrl} -> ${color}${status}${colors.reset} ${duration}ms`
    );
  });

  next();
}

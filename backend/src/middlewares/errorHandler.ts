// replace entire file with this
import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

/** Custom application error */
export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

/** Central error handler – consistent shape */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Known application error
  if (err instanceof ApiError) {
    logger.error(`ApiError: ${err.status} ${err.message}`);
    return res.status(err.status).json({
      message: err.message,
      ...(err.details !== undefined ? { details: err.details } : {}),
    });
  }

  // External fetch wrapper (HttpError from utils/httpClient)
  if (err instanceof Error && "status" in err) {
    const anyErr = err as any;
    logger.error(`Upstream service error: ${anyErr.status} ${anyErr.message}`);
    return res.status(anyErr.status || 502).json({
      message: anyErr.message || "Upstream service error",
      ...(anyErr.body !== undefined ? { details: anyErr.body } : {}),
    });
  }

  // Unknown error
  logger.error(`Unknown error: ${err instanceof Error ? err.message : "Internal Server Error"}`);
  return res.status(500).json({
    message: err instanceof Error ? err.message : "Internal Server Error",
  });
}

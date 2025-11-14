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

/** Central error handler */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Our known error
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      message: err.message,
      details: err.details,
    });
  }

  // Fetch wrapper error (HttpError)
  if (err instanceof Error && "status" in err) {
    const anyErr = err as any;
    return res.status(anyErr.status || 500).json({
      message: anyErr.message || "External API error",
      external: anyErr.body,
    });
  }

  // Unknown/unexpected errors
  return res.status(500).json({
    message: err instanceof Error ? err.message : "Internal Server Error",
  });
}

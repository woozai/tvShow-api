import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "./errorHandler";

export function validate(
  schema: ZodType,
  source: "query" | "params" | "body" = "query"
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const raw = (req as any)[source];
    const result = schema.safeParse(raw);

    if (!result.success) {
      const details = result.error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
        code: i.code,
      }));
      return next(new ApiError(400, "Validation error", details));
    }

    // Store parsed values without mutating Express getters
    res.locals.validated = res.locals.validated || {};
    (res.locals.validated as any)[source] = result.data;

    return next();
  };
}

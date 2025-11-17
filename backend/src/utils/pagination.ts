// backend/src/utils/pagination.ts
import type { FilterParams } from "../types/filters";

// Small pagination shape used by filtered endpoints.
export interface FilterPagination {
  page: number;
  limit: number;
  offset: number;
}

// Compute pagination window from FilterParams.
// Falls back to page=0 and limit=20 when not provided.
export function getFilterPagination(p: FilterParams): FilterPagination {
  const rawPage = typeof p.page === "number" && p.page >= 0 ? p.page : 0;
  const rawLimit = typeof p.limit === "number" && p.limit > 0 ? p.limit : 20;

  const page = Math.floor(rawPage);
  const limit = Math.floor(rawLimit);
  const offset = page * limit;

  return { page, limit, offset };
}

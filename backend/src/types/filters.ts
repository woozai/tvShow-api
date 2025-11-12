export type SortKey = "rating" | "name" | "premiered";

export interface FilterParams {
  q?: string;
  genres?: string[];
  language?: string;
  rating_gte?: number;
  year_min?: number;
  year_max?: number;
  status?: string;
  sort?: SortKey;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
  _links?: Record<string, unknown>;
}

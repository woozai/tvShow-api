export type SortKey = "rating" | "name" | "premiered";

export interface FilterParams {
  q?: string;
  genre?: string;
  rating_gte?: number;
  year_gte?: number;
  year_lte?: number;
  status?: string; // "Running" | "Ended" | etc. (free string for MVP)
  sort?: SortKey;
  order?: "asc" | "desc";
  page?: number; // TVMaze page (0..n)
  limit?: number; // slice after filtering/sorting
}

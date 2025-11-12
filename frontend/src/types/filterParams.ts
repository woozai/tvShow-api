// Frontend filter params (kept minimal & aligned with backend)
export type SortKey = "rating" | "name" | "premiered";

export interface FilterParams {
  q?: string;
  genres?: string[]; // e.g., ["Drama", "Comedy"]
  language?: string; // e.g., "English"
  rating_gte?: number; // optional for future use
  year_min?: number; // optional for future use
  year_max?: number; // optional for future use
  status?: string; // optional for future use
  sort?: SortKey; // optional for future use
  order?: "asc" | "desc"; // default "desc" server-side
  page?: number; // optional for future use
  limit?: number; // optional for future use
}

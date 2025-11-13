// src/types/searchResults.ts
import type { Show } from "./show";

export type SearchResult = {
  score: number;
  show: Show;
};

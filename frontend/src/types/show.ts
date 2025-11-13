export interface Show {
  language: string;
  id: number;
  name: string;
  summary?: string | null;
  genres?: string[];
  status?: string;
  premiered?: string | null;
  rating?: { average?: number | null };
  image?: { medium?: string; original?: string } | null;
  _links?: Record<string, unknown>;
  page?: number;
  limit?: number;
  _embedded?: string;
}

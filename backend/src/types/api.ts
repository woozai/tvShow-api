// Minimal TVMaze response types (expand later if needed)

export type TVMazeSearchResult = {
  show: TVMazeShow;
};

export type TVMazeShow = {
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
};

export type TVMazeEpisode = {
  id: number;
  name: string;
  season: number;
  number: number | null;
  airdate?: string | null;
  airtime?: string | null;
  airstamp?: string | null;
  runtime?: number | null;
  summary?: string | null;
  image?: { medium?: string; original?: string } | null;
  _links?: Record<string, unknown>;
  page?: number;
  limit?: number;
};

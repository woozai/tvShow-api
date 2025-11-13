export type TVMazeSearchResult = {
  show: TVMazeShow;
};

export type Links = {
  self: {
    href: string;
  };
  show?: {
    href: string;
    name: string;
  };
};
export type Images = { medium?: string; original?: string } | null;

export type TVMazePerson = {
  id: number;
  name: string;
  url: string;
  image?: Images;
  _links?: Links;
};
export type TVMazeCharacter = {
  id: number;
  name: string;
  url: string;
  image?: Images;
  _links?: Links;
};

// What TVMaze nests under _embedded when you pass ?embed=...
export type TVMazeEmbedded = {
  episodes?: TVMazeEpisode[];
  seasons?: TVMazeSeason[];
  cast?: { person: TVMazePerson; character: TVMazeCharacter }[];
  [key: string]: unknown;
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
  image?: Images;
  _links?: Links;
  page?: number;
  limit?: number;
  _embedded?: string;
};

export type TVMazeSeason = {
  id: number;
  url: string;
  number: number;
  name: string;
  episodeOrder: number;
  premiereDate?: string | null;
  summary?: string | null;
  image?: Images;
  _links?: Links;
};

export type TVMazeEpisode = {
  id: number;
  name: string;
  season: number;
  number: number | null;
  type: string;
  airdate?: string | null;
  airtime?: string | null;
  airstamp?: string | null;
  runtime?: number | null;
  rating?: { average?: number | null };
  summary?: string | null;
  image?: Images;
  _links?: Links;
  page?: number;
  limit?: number;
};

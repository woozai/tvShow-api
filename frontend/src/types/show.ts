export interface Links {
  self: {
    href: string;
  };
  show?: {
    href: string;
    name: string;
  };
}
export type Images = {
  medium?: string;
  original?: string;
} | null;

export interface Person {
  id: number;
  name: string;
  url: string;
  image?: Images;
  _links?: Links;
}
export interface Character {
  id: number;
  name: string;
  url: string;
  image?: Images;
  _links?: Links;
}

export interface Embedded {
  episodes?: Episode[];
  seasons?: Season[];
  cast?: { person: Person; character: Character }[];
  guestcast?: { person: Person; character: Character }[];
  [key: string]: unknown;
}

export interface Show {
  language: string;
  url: string;
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
  _embedded?: Embedded;
}

export interface Season {
  id: number;
  url: string;
  number: number;
  name: string;
  episodeOrder: number;
  premiereDate?: string | null;
  summary?: string | null;
  image?: Images;
  _links?: Links;
}

export interface Episode {
  url: string;
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
}

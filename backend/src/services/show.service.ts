import { httpGet } from "../utils/httpClient";

export async function getShows(page: number = 0) {
  return httpGet<any[]>("/shows", {
    params: { page },
    timeoutMs: 8000,
  });
}

export async function getShowById(id: number) {
  return httpGet<any>(`/shows/${id}`, { timeoutMs: 8000 });
}

export async function getEpisodesByShowId(id: number) {
  return httpGet<any[]>(`/shows/${id}/episodes`, { timeoutMs: 8000 });
}

export async function getEpisodeById(id: number) {
  return httpGet<any>(`/episodes/${id}`, { timeoutMs: 8000 });
}

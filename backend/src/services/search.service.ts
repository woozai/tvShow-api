import { httpGet } from "../utils/httpClient";

export async function searchShows(query: string) {
  return httpGet<any[]>("/search/shows", {
    params: { q: query },
    timeoutMs: 8000,
  });
}

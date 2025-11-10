export const API_BASE = import.meta.env.VITE_API_URL;

export async function apiGet<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`);

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

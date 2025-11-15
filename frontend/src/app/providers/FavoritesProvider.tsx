import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  FavoritesContext,
  type FavoritesContextValue,
} from "../contexts.ts/FavoritesContext";

const KEY = "favorite_shows_v1";

function load(): number[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "number") : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load once on mount
  useEffect(() => {
    setFavorites(load());
  }, []);

  // Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(favorites));
    } catch {
      /* ignore */
    }
  }, [favorites]);

  const toggle = useCallback((id: number) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((x) => x !== id) : [...prev, id];
      return next;
    });
  }, []);

  const isFav = useCallback(
    (id: number) => favorites.includes(id),
    [favorites]
  );

  const value: FavoritesContextValue = { favorites, toggle, isFav };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

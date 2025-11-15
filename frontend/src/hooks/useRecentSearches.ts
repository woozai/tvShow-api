import { useCallback, useEffect, useState } from "react";

const KEY = "recent_searches_v1"; // localStorage key name
const MAX = 10; // maximum number of stored searches

/** Load saved searches safely from localStorage */
function load(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

// Save current list back to localStorage
function save(items: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch { /* empty */ }
}

/**
 * Custom React hook that manages a persistent list of recent searches.
 * - Keeps items in local state and in localStorage.
 * - Avoids duplicates.
 * - Newest item always on top.
 * - Provides add, remove, and clear functions.
 */
export function useRecentSearches() {
  const [items, setItems] = useState<string[]>([]);

  // Load once when component mounts
  useEffect(() => setItems(load()), []);

  //Add new search term
  const add = useCallback(
    (q: string) => {
      const term = q.trim();
      if (!term) return;

      // Move to top and remove duplicates, keep max length
      const next = [
        term,
        ...items.filter((x) => x.toLowerCase() !== term.toLowerCase()),
      ].slice(0, MAX);

      setItems(next);
      save(next);
    },
    [items]
  );

  // Remove a single term
  const remove = useCallback(
    (q: string) => {
      const next = items.filter((x) => x !== q);
      setItems(next);
      save(next);
    },
    [items]
  );

  // Clear all history
  const clear = useCallback(() => {
    setItems([]);
    save([]);
  }, []);

  return { items, add, remove, clear };
}

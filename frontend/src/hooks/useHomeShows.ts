// src/app/hooks/useHomeShows.ts
import { useEffect, useState } from "react";
import type { Show } from "../types/show";
import type { FilterParams } from "../types/filterParams";
import { getPopularShows } from "../api/shows";
import { getFilteredShows } from "../api/filtered";

interface ApplyFiltersInput {
  genres: string[];
  language?: string;
  rating_gte?: number;
}

export function useHomeShows(pageSize: number) {
  const [page, setPage] = useState(0); // 0-based
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [params, setParams] = useState<FilterParams>({});
  const [filtersEnabled, setFiltersEnabled] = useState(false);
  const [pageCount, setPageCount] = useState(0); // how many items returned in this page

  const hasSavedFilters = Boolean(
    (params.genres && params.genres.length) ||
      params.language ||
      params.rating_gte
  );

  // Scroll + change page
  const handlePageChange = (nextPage: number) => {
    if (typeof window !== "undefined") {
      // 1) window
      window.scrollTo(0, 0);

      // 2) <html> & <body>
      const html = document.documentElement;
      const body = document.body;
      if (html) html.scrollTop = 0;
      if (body) body.scrollTop = 0;

      // 3) React root / app container (if scrollable)
      const root = document.getElementById("root");
      if (root) root.scrollTop = 0;
    }

    setPage(nextPage);
  };

  // Load data when page / filters change
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      try {
        if (!filtersEnabled) {
          // Popular shows (no filters)
          const data = await getPopularShows(page, pageSize);
          if (cancelled) return;
          setShows(data.items);
          setPageCount(data.items.length);
        } else {
          // Filtered shows
          const res = await getFilteredShows({
            ...params,
            page,
            limit: pageSize,
          });
          if (cancelled) return;
          setShows(res.items);
          setPageCount(res.items.length);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [page, filtersEnabled, params, pageSize]);

  // Called from FilterModal when user clicks "Apply"
  async function applyFilters(next: ApplyFiltersInput) {
    const hasGenres = Array.isArray(next.genres) && next.genres.length > 0;
    const hasLanguage = !!next.language;
    const hasRating_gte = !!next.rating_gte;

    const noFiltersChosen = !hasGenres && !hasLanguage && !hasRating_gte;

    if (noFiltersChosen) {
      // Clear filters -> back to popular
      setFiltersEnabled(false);
      setParams({});
      setPage(0);
    } else {
      const newParams: FilterParams = {
        ...params,
        genres: hasGenres ? next.genres : undefined,
        language: next.language || undefined,
        rating_gte: hasRating_gte ? next.rating_gte : undefined,
      };

      setParams(newParams);
      setFiltersEnabled(true);
      setPage(0); // always restart filtered results from first page
    }

    setIsFilterOpen(false);
  }

  function resetFilters() {
    setParams({});
    setFiltersEnabled(false);
    setPage(0);
  }

  // Toggle only enables/disables filters. It re-uses saved params.
  async function handleToggle() {
    if (filtersEnabled) {
      // Turn OFF filters → back to popular
      setFiltersEnabled(false);
      setPage(0);
      return;
    }

    // Turn ON filters only if we have saved ones
    if (hasSavedFilters) {
      setFiltersEnabled(true);
      setPage(0);
    } else {
      // No saved filters → open modal to choose
      setIsFilterOpen(true);
    }
  }

  return {
    // state
    page,
    shows,
    loading,
    isFilterOpen,
    params,
    filtersEnabled,
    pageCount,
    hasSavedFilters,

    // handlers
    handlePageChange,
    setIsFilterOpen,
    applyFilters,
    resetFilters,
    handleToggle,
  };
}

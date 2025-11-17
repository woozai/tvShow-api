import { useEffect, useState } from "react";
import { ShowCard } from "../components/showCard/ShowCard";
import type { Show } from "../../types/show";
import { getPopularShows } from "../../api/shows";
import { FilterButton } from "../components/filters/FilterButton";
import type { FilterParams } from "../../types/filterParams";
import { getFilteredShows } from "../../api/filtered";
import { ShowCardPlaceholder } from "../components/showCard/ShowCardPlaceholder";
import { FilterModal } from "../components/filters/FilterModal";
import { Pagination } from "../components/pagination";
import { useSearchParams } from "react-router-dom";

const PAGE_SIZE = 20;

export function HomePage() {
  const [page, setPage] = useState(0); // 0-based
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [params, setParams] = useState<FilterParams>({});
  const [filtersEnabled, setFiltersEnabled] = useState(false);
  const [pageCount, setPageCount] = useState(0); // how many items returned in this page

  const genresOptions = [
    "Drama",
    "Comedy",
    "Action",
    "Science-Fiction",
    "Romance",
    "Thriller",
    "Horror",
    "Fantasy",
  ];
  const languageOptions = [
    "English",
    "Japanese",
    "Korean",
    "Spanish",
    "German",
  ];

  const hasSavedFilters = Boolean(
    (params.genres && params.genres.length) ||
      params.language ||
      params.rating_gte
  );

  // 🔹 Single effect: load data whenever page / filters change
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      try {
        if (!filtersEnabled) {
          // Popular shows (no filters)
          const data = await getPopularShows(page, PAGE_SIZE);
          if (cancelled) return;
          setShows(data.items);
          setPageCount(data.items.length);
        } else {
          // Filtered shows
          const res = await getFilteredShows({
            ...params,
            page,
            limit: PAGE_SIZE,
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
  }, [page, filtersEnabled, params]);

  // 🔹 Called from FilterModal when user clicks "Apply"
  async function applyFilters(next: {
    genres: string[];
    language?: string;
    rating_gte?: number;
  }) {
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

  // 🔹 Toggle only enables/disables filters.
  //     It re-uses saved params, and lets the effect refetch.
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">
          {filtersEnabled ? "Filtered Shows" : "Popular Shows"}
        </h2>

        <FilterButton
          onClick={() => setIsFilterOpen(true)}
          onToggle={handleToggle}
          active={filtersEnabled}
          hasSavedFilters={hasSavedFilters}
        >
          Filters
        </FilterButton>
      </div>

      {/* List area */}
      <div className="flex flex-col gap-6">
        {loading ? (
          <div className="flex flex-col gap-6">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <ShowCardPlaceholder key={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {shows.map((s) => (
              <ShowCard key={s.id} show={s} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination controls */}
      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        itemsCount={pageCount}
        loading={loading}
        onPageChange={setPage}
      />

      {/* Filter modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        genresOptions={genresOptions}
        languageOptions={languageOptions}
        initialGenres={params.genres ?? []}
        initialRating={params.rating_gte}
        initialLanguage={params.language}
        onReset={resetFilters}
        onApply={applyFilters}
      />
    </div>
  );
}

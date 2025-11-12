import { useEffect, useState } from "react";
import { ShowCard } from "../components/ShowCard/ShowCard";
import type { Show } from "../../types/show";
import { getPopularShows } from "../../api/shows";
import { FilterButton } from "../components/filters/FilterButton";
import { FilterModal } from "../components/filters/FilterModal";
import type { FilterParams } from "../../types/filterParams";
import { getFilteredShows } from "../../api/filtered";
import { ShowCardPlaceholder } from "../components/ShowCard/ShowCardPlaceHolder";

export function HomePage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [params, setParams] = useState<FilterParams>({});
  const [filtersEnabled, setFiltersEnabled] = useState(false);

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
      params.rating_gte ||
      params.year_min ||
      params.year_max ||
      params.status
  );

  // Load initial popular shows
  useEffect(() => {
    (async () => {
      try {
        const data = await getPopularShows();
        setShows(data.items);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function applyFilters(next: { genres: string[]; language?: string }) {
    setLoading(true);
    try {
      const noFiltersChosen =
        (!next.genres || next.genres.length === 0) && !next.language;

      if (noFiltersChosen) {
        // ✅ No filters selected → deactivate toggle + show popular
        setFiltersEnabled(false);
        setParams({});
        const data = await getPopularShows();
        setShows(data.items);
      } else {
        // ✅ Filters chosen → save + enable + apply
        const newParams: FilterParams = {
          ...params,
          genres: next.genres?.length ? next.genres : undefined,
          language: next.language || undefined,
        };
        setParams(newParams);
        setFiltersEnabled(true);

        const res = await getFilteredShows(newParams);
        setShows(res.items);
      }
    } finally {
      setLoading(false);
      setIsFilterOpen(false);
    }
  }

  function resetFilters() {
    setParams({});
  }

  async function handleToggle() {
    if (filtersEnabled) {
      setFiltersEnabled(false);
      setLoading(true);
      try {
        const data = await getPopularShows();
        setShows(data.items);
      } finally {
        setLoading(false);
      }
      return;
    }

    setFiltersEnabled(true);
    if (params.genres?.length || params.language) {
      setLoading(true);
      try {
        const res = await getFilteredShows(params);
        setShows(res.items);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
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

      {/* Grid area */}
      <div className="relative min-h-[300px]">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <ShowCardPlaceholder key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {shows.map((s) => (
              <ShowCard key={s.id} show={s} />
            ))}
          </div>
        )}
      </div>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        genresOptions={genresOptions}
        languageOptions={languageOptions}
        initialGenres={params.genres ?? []}
        initialLanguage={params.language}
        onReset={resetFilters}
        onApply={applyFilters}
      />
    </div>
  );
}

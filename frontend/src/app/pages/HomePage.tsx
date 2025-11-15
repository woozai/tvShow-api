import { useEffect, useState } from "react";
import { ShowCard } from "../components/showCard/ShowCard";
import type { Show } from "../../types/show";
import { getPopularShows } from "../../api/shows";
import { FilterButton } from "../components/filters/FilterButton";
import type { FilterParams } from "../../types/filterParams";
import { getFilteredShows } from "../../api/filtered";
import { ShowCardPlaceholder } from "../components/showCard/ShowCardPlaceHolder";
import { FilterModal } from "../components/filters/FilterModal";

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
      params.rating_gte
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

  async function applyFilters(next: {
    genres: string[];
    language?: string;
    rating_gte?: number;
  }) {
    setLoading(true);
    try {
      const hasGenres = Array.isArray(next.genres) && next.genres.length > 0;
      const hasLanguage = !!next.language;
      const hasRating_gte = !!next.rating_gte;

      const noFiltersChosen = !hasGenres && !hasLanguage && !hasRating_gte;

      if (noFiltersChosen) {
        setFiltersEnabled(false);
        setParams({});
        const data = await getPopularShows();
        setShows(data.items);
      } else {
        const newParams: FilterParams = {
          ...params,
          genres: hasGenres ? next.genres : undefined,
          language: next.language || undefined,
          rating_gte: hasRating_gte ? next.rating_gte : undefined,
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
    if (params.genres?.length || params.language || params.rating_gte) {
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

      {/* List area */}
      <div className="flex flex-col gap-6">
        {loading ? (
          <div className="flex flex-col gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
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

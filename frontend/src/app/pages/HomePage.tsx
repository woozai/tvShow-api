// src/app/pages/HomePage.tsx
import { ShowCard } from "../components/showCard/ShowCard";
import { ShowCardPlaceholder } from "../components/showCard/ShowCardPlaceholder";
import { FilterButton } from "../components/filters/FilterButton";
import { FilterModal } from "../components/filters/FilterModal";
import { Pagination } from "../components/pagination";
import { genresOptions, languageOptions } from "../constants/filters";
import { useHomeShows } from "../../hooks/useHomeShows";

const PAGE_SIZE = 20;

export function HomePage() {
  const {
    page,
    shows,
    loading,
    isFilterOpen,
    filtersEnabled,
    pageCount,
    hasSavedFilters,
    handlePageChange,
    setIsFilterOpen,
    applyFilters,
    resetFilters,
    params,
    handleToggle,
  } = useHomeShows(PAGE_SIZE);

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
        onPageChange={handlePageChange}
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

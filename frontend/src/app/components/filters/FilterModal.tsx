import { useEffect, useState, type KeyboardEvent } from "react";
import { GenresFilter } from "./FilterGenres";
import { LanguagesFilter } from "./FilterLanguages";
import { RatingFilter } from "./FilterRating";

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  genresOptions: string[];
  languageOptions: string[];
  initialGenres?: string[];
  initialLanguage?: string;
  initialRating?: number;
  onReset: () => void;
  onApply: (params: {
    genres: string[];
    language?: string;
    rating_gte?: number;
  }) => void;
}

/**
 * FilterModal
 * - Fullscreen backdrop + centered panel
 * - Holds Genres, Language and Rating filters
 * - Theme-aware styling (light + dark)
 */
export function FilterModal({
  isOpen,
  onClose,
  genresOptions,
  languageOptions,
  initialGenres = [],
  initialLanguage,
  initialRating,
  onReset,
  onApply,
}: FilterModalProps) {
  const [genres, setGenres] = useState<string[]>(initialGenres);
  const [language, setLanguage] = useState<string | undefined>(initialLanguage);
  const [rating, setRating] = useState<number | undefined>(initialRating);

  // Sync local state when modal reopens
  useEffect(() => {
    if (isOpen) {
      setGenres(initialGenres);
      setLanguage(initialLanguage);
      setRating(initialRating);
    }
  }, [isOpen, initialGenres, initialLanguage, initialRating]);

  if (!isOpen) return null;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Filter modal"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="
          relative z-10 w-full max-w-lg rounded-2xl p-5 shadow-xl border
          bg-white text-zinc-900 border-zinc-200
          dark:bg-[#151922] dark:text-white dark:border-zinc-800
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Filters
          </h3>
          <button
            onClick={onClose}
            className="
              text-sm opacity-80 hover:opacity-100
              text-zinc-500 hover:text-zinc-800
              dark:text-zinc-400 dark:hover:text-white
            "
            aria-label="Close filters"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Sections */}
        <GenresFilter
          options={genresOptions}
          value={genres}
          onChange={setGenres}
        />

        <LanguagesFilter
          options={languageOptions}
          value={language}
          onChange={setLanguage}
        />

        <RatingFilter value={rating} onChange={setRating} />

        {/* Actions */}
        <div className="mt-4 flex justify-between">
          {/* Reset */}
          <button
            type="button"
            className="
              rounded-md border px-4 py-2 text-sm
              border-zinc-300 text-zinc-700 hover:bg-zinc-100
              dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-white/10
            "
            onClick={() => {
              onReset();
              setGenres([]);
              setLanguage(undefined);
              setRating(undefined);
            }}
          >
            Reset
          </button>

          {/* Apply */}
          <button
            type="button"
            className="
              rounded-md bg-red-500 px-4 py-2 text-sm text-white
              hover:bg-red-600 active:scale-95 transition
            "
            onClick={() => onApply({ genres, language, rating_gte: rating })}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

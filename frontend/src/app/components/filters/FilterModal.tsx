import { useEffect, useState, type KeyboardEvent } from "react";
import { GenresFilter } from "./FilterGenres";
import { LanguageFilter } from "./FilterLanguages";
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
        className="relative z-10 w-full max-w-lg rounded-2xl bg-[#151922] p-5 shadow-xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Filters</h3>
          <button
            onClick={onClose}
            className="text-sm opacity-70 hover:opacity-100"
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

        <LanguageFilter
          options={languageOptions}
          value={language}
          onChange={setLanguage}
        />

        {/* Rating */}
        <RatingFilter value={rating} onChange={setRating} />

        {/* Actions */}
        <div className="flex justify-between">
          <button
            type="button"
            className="rounded-md border border-white/15 px-4 py-2 text-sm hover:bg-white/10"
            onClick={() => {
              onReset();
              setGenres([]);
              setLanguage(undefined);
              setRating(undefined);
            }}
          >
            Reset
          </button>

          <button
            type="button"
            className="rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 active:scale-95 transition"
            onClick={() => onApply({ genres, language, rating_gte: rating })}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

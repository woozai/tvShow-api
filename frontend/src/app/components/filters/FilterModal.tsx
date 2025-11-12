import { useEffect, useState, type KeyboardEvent } from "react";

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;

  // Available options to render in the UI
  genresOptions: string[];
  languageOptions: string[];

  // Initial (controlled-from-parent) values
  initialGenres?: string[];
  initialLanguage?: string;

  // Actions
  onReset: () => void;
  onApply: (params: { genres: string[]; language?: string }) => void;
}

export function FilterModal({
  isOpen,
  onClose,
  genresOptions,
  languageOptions,
  initialGenres = [],
  initialLanguage,
  onReset,
  onApply,
}: FilterModalProps) {
  const [genres, setGenres] = useState<string[]>(initialGenres);
  const [language, setLanguage] = useState<string | undefined>(initialLanguage);

  // Sync local state with parent-provided initial values whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setGenres(initialGenres);
      setLanguage(initialLanguage);
    }
  }, [isOpen, initialGenres, initialLanguage]);

  if (!isOpen) return null;

  const toggleGenre = (g: string) => {
    setGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  };

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

        {/* Genres */}
        <section className="mb-4">
          <div className="mb-2 text-sm font-medium opacity-80">Genres</div>
          <div className="flex flex-wrap gap-2">
            {genresOptions.map((g) => {
              const active = genres.includes(g);
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGenre(g)}
                  className={`rounded-full px-3 py-1 text-xs border transition focus:outline-none focus:ring-2 focus:ring-white/30 ${
                    active
                      ? "bg-red-500 text-white border-red-500"
                      : "border-white/15 hover:bg-white/10"
                  }`}
                  aria-pressed={active}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </section>

        {/* Language */}
        <section className="mb-6">
          <div className="mb-2 text-sm font-medium opacity-80">Language</div>
          <div className="flex flex-wrap gap-2">
            {languageOptions.map((lang) => (
              <label
                key={lang}
                className={`cursor-pointer rounded-full border px-3 py-1 text-xs transition select-none focus-within:ring-2 focus-within:ring-white/30 ${
                  language === lang
                    ? "bg-white text-black border-white"
                    : "border-white/15 hover:bg-white/10"
                }`}
                title={lang}
              >
                <input
                  type="radio"
                  name="language"
                  value={lang}
                  className="hidden"
                  checked={language === lang}
                  onChange={() => setLanguage(lang)}
                />
                {lang}
              </label>
            ))}

            {/* Any / clear selection */}
            <label
              className={`cursor-pointer rounded-full border px-3 py-1 text-xs transition select-none focus-within:ring-2 focus-within:ring-white/30 ${
                !language
                  ? "bg-white text-black border-white"
                  : "border-white/15 hover:bg-white/10"
              }`}
              title="Any language"
            >
              <input
                type="radio"
                name="language"
                value=""
                className="hidden"
                checked={!language}
                onChange={() => setLanguage(undefined)}
              />
              Any
            </label>
          </div>
        </section>

        {/* Actions */}
        <div className="flex justify-between">
          <button
            type="button"
            className="rounded-md border border-white/15 px-4 py-2 text-sm hover:bg-white/10"
            onClick={() => {
              onReset();
              setGenres([]);
              setLanguage(undefined);
            }}
          >
            Reset
          </button>

          <button
            type="button"
            className="rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 active:scale-95 transition"
            onClick={() => onApply({ genres, language })}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

import type { FilterParams } from "../../../types/filterParams";

type Props = {
  isOpen: boolean;
  params: FilterParams;
  onParamsChange: (next: FilterParams) => void;
  onReset: () => void;
  onApply?: () => void;
};

const GENRES = [
  "",
  "Drama",
  "Comedy",
  "Action",
  "Thriller",
  "Science-Fiction",
  "Romance",
  "Horror",
  "Mystery",
  "Crime",
  "Adventure",
  "Fantasy",
];

const LANGUAGES = [
  "",
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Japanese",
  "Korean",
  "Chinese",
  "Portuguese",
  "Hindi",
];

export function FilterBar({
  isOpen,
  params,
  onParamsChange,
  onReset,
  onApply,
}: Props) {
  if (!isOpen) return null;

  const set = (patch: Partial<FilterParams>) =>
    onParamsChange({ ...params, ...patch });

  return (
    <div className="mt-3 rounded-xl border border-neutral-800 bg-[#1a1e24] p-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-300">Filters</div>
        <div className="flex gap-2">
          <button
            type="button"
            className="text-xs rounded-md border border-neutral-700 px-3 py-1 hover:bg-neutral-800"
            onClick={onReset}
          >
            Reset
          </button>
          {onApply && (
            <button
              type="button"
              className="text-xs rounded-md bg-red-500 px-3 py-1 text-white hover:bg-red-600"
              onClick={onApply}
            >
              Apply
            </button>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Genre */}
        <label className="flex flex-col gap-1">
          <span className="text-xs text-neutral-400">Genre</span>
          <select
            className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm"
            value={params.genre ?? ""}
            onChange={(e) => set({ genre: e.target.value || undefined })}
          >
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g || "Any"}
              </option>
            ))}
          </select>
        </label>

        {/* Language */}
        <label className="flex flex-col gap-1">
          <span className="text-xs text-neutral-400">Language</span>
          <select
            className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm"
            value={params.language ?? ""}
            onChange={(e) => set({ language: e.target.value || undefined })}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l || "Any"}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

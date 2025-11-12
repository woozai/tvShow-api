import { memo } from "react";

interface RatingFilterProps {
  title?: string;
  value?: number; // 0–10; undefined = Any
  onChange: (next: number | undefined) => void;
}

export const RatingFilter = memo(function RatingFilter({
  title = "Minimum Rating",
  value,
  onChange,
}: RatingFilterProps) {
  const isAny = value === undefined;

  return (
    <section className="mb-6">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium opacity-80">{title}</span>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4">
        {/* Any button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className={`rounded-full border px-3 py-1 text-xs transition ${
              isAny
                ? "bg-white text-black border-white shadow-sm"
                : "border-white/15 hover:bg-white/10"
            }`}
            onClick={() => onChange(undefined)}
            aria-pressed={isAny}
            aria-label="Any rating"
            title="Any rating"
          >
            Any
          </button>
          <div
            className={`flex items-center justify-center gap-1 rounded-full border px-3 py-1 text-xs shadow-sm transition ${
              isAny
                ? "opacity-0 pointer-events-none"
                : "border-white/20 bg-white/10 text-white opacity-100"
            }`}
          >
            <span className="text-yellow-400">⭐</span>
            <span className="font-medium">
              {value ? value.toFixed(1) : "N/A"}
            </span>
          </div>
        </div>

        {/* Slider with min/max labels */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] opacity-60 w-4 text-right">0</span>
          <input
            type="range"
            min={0}
            max={10}
            step={0.5}
            value={isAny ? 0 : value!}
            onMouseDown={() => {
              if (isAny) onChange(0);
            }}
            onChange={(e) => {
              const v = Number(e.target.value);
              onChange(Number.isNaN(v) ? undefined : v);
            }}
            className={`flex-1 accent-white transition-opacity ${
              isAny ? "opacity-50" : "opacity-100"
            }`}
            aria-label="Minimum rating"
          />
          <span className="text-[11px] opacity-60 w-4 text-left">10</span>
        </div>
      </div>
    </section>
  );
});

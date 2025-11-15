import { memo } from "react";
import { ButtonInFilter } from "./ButtonInFilter";

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
      {/* Header row: label + summary */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
          {title}
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {isAny ? "Any" : `${value!.toFixed(1)}+`}
        </span>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4">
        {/* Any + star pill */}
        <div className="flex items-center gap-3">
          {/* Any button – same pill style as genres/languages */}
          <ButtonInFilter
            key={"any"}
            buttonType={"any"}
            isActive={isAny}
            onToggle={() => onChange(undefined)}
          ></ButtonInFilter>

          {/* Star + numeric value */}
          <div className="flex items-center justify-center gap-1 rounded-full px-3 py-1 text-xs">
            <span className="text-red-500 dark:text-red-400">⭐</span>
            <span className="font-medium">
              {isAny ? "N/A" : value!.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Slider with min/max labels */}
        <div className="flex items-center gap-3">
          <span className="w-4 text-right text-[11px] opacity-60">0</span>
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
            className={`flex-1 accent-red-500 transition-opacity ${
              isAny ? "opacity-50" : "opacity-100"
            }`}
            aria-label="Minimum rating"
          />
          <span className="w-4 text-left text-[11px] opacity-60">10</span>
        </div>
      </div>
    </section>
  );
});

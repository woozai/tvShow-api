import { memo } from "react";
import { ButtonInFilter } from "./ButtonInFilter";

interface GenresFilterProps {
  title?: string;
  options: string[];
  value: string[]; // 0 = Any, 1 = chosen genre
  onChange: (next: string[]) => void;
}

/**
 * GenresFilter
 * - Single-select (0 or 1 genre)
 * - Empty array = Any
 */
export const GenresFilter = memo(function GenresFilter({
  title = "Genres",
  options,
  value,
  onChange,
}: GenresFilterProps) {
  // Allow only 0 or 1 selected genre
  const toggle = (g: string) => {
    const isSelected = value.includes(g);

    if (isSelected) {
      // clicking again clears selection → Any
      onChange([]);
    } else {
      // always keep only this one genre
      onChange([g]);
    }
  };

  const selectedGenre = value[0]; // either undefined or single genre

  return (
    <section className="mb-6">
      {/* Header row: label + selection summary */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
          {title}
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {selectedGenre ?? "Any"}
        </span>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-2">
        {options.map((g) => {
          const active = value.includes(g);

          return (
            <ButtonInFilter
              key={g}
              buttonType={g}
              isActive={active}
              onToggle={() => toggle(g)}
            />
          );
        })}
      </div>
    </section>
  );
});

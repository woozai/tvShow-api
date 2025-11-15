import { memo } from "react";
import { ButtonInFilter } from "./ButtonInFilter";

interface GenresFilterProps {
  title?: string;
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
}

/**
 * GenresFilter
 * - Multi-select pill list
 * - Theme-aware styles (light + dark)
 */
export const GenresFilter = memo(function GenresFilter({
  title = "Genres",
  options,
  value,
  onChange,
}: GenresFilterProps) {
  // Toggle a genre in/out of the selected list
  const toggle = (g: string) => {
    const exists = value.includes(g);
    if (exists) {
      onChange(value.filter((x) => x !== g));
    } else {
      onChange([...value, g]);
    }
  };

  const selectedCount = value.length;

  return (
    <section className="mb-6">
      {/* Header row: label + selection summary */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
          {title}
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {selectedCount ? `${selectedCount} selected` : "Any"}
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
            ></ButtonInFilter>
          );
        })}
      </div>
    </section>
  );
});

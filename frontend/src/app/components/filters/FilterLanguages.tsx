import { memo } from "react";
import { ButtonInFilter } from "./ButtonInFilter";

interface LanguagesFilterProps {
  title?: string;
  options: string[];
  /** Selected language, undefined/null means "Any" */
  value?: string;
  onChange: (next: string | undefined) => void;
}

/**
 * LanguagesFilter
 * - Single-select pill list (no "Any" button)
 * - Click again to unselect (→ Any)
 * - Styles aligned with Genres pills
 */
export const LanguagesFilter = memo(function LanguagesFilter({
  title = "Language",
  options,
  value,
  onChange,
}: LanguagesFilterProps) {
  const handleClick = (lang: string) => {
    // If clicking the same language → unselect → Any
    if (value === lang) {
      onChange(undefined);
    } else {
      onChange(lang);
    }
  };

  return (
    <section className="mb-6">
      {/* Header row */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
          {title}
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {value || "Any"}
        </span>
      </div>

      {/* Pills (no separate "Any" chip) */}
      <div className="flex flex-wrap gap-2">
        {options.map((lang) => {
          const active = value === lang;

          return (
            <ButtonInFilter
              key={lang}
              buttonType={lang}
              isActive={active}
              onToggle={handleClick}
            ></ButtonInFilter>
          );
        })}
      </div>
    </section>
  );
});

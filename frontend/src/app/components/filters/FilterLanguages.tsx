import { memo } from "react";

interface LanguageFilterProps {
  title?: string;
  options: string[];
  value?: string;
  onChange: (next: string | undefined) => void;
  includeAny?: boolean; // default true
}

export const LanguageFilter = memo(function LanguageFilter({
  title = "Language",
  options,
  value,
  onChange,
  includeAny = true,
}: LanguageFilterProps) {
  return (
    <section className="mb-6">
      <div className="mb-2 text-sm font-medium opacity-80">{title}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((lang) => (
          <label
            key={lang}
            className={`cursor-pointer rounded-full border px-3 py-1 text-xs transition select-none focus-within:ring-2 focus-within:ring-white/30 ${
              value === lang
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
              checked={value === lang}
              onChange={() => onChange(lang)}
            />
            {lang}
          </label>
        ))}

        {includeAny && (
          <label
            className={`cursor-pointer rounded-full border px-3 py-1 text-xs transition select-none focus-within:ring-2 focus-within:ring-white/30 ${
              !value
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
              checked={!value}
              onChange={() => onChange(undefined)}
            />
            Any
          </label>
        )}
      </div>
    </section>
  );
});

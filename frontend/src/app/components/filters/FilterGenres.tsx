import { memo } from "react";

interface GenresFilterProps {
  title?: string;
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
}

export const GenresFilter = memo(function GenresFilter({
  title = "Genres",
  options,
  value,
  onChange,
}: GenresFilterProps) {
  const toggle = (g: string) => {
    const has = value.includes(g);
    onChange(has ? value.filter((x) => x !== g) : [...value, g]);
  };

  return (
    <section className="mb-4">
      <div className="mb-2 text-sm font-medium opacity-80">{title}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((g) => {
          const active = value.includes(g);
          return (
            <button
              key={g}
              type="button"
              onClick={() => toggle(g)}
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
  );
});

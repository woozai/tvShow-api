import { useTheme } from "../../../hooks/useTheme";

export function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-md border border-black/10 dark:border-white/10
                 px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10 transition"
      aria-label="Toggle color theme"
      title="Toggle theme"
    >
      <span className="text-base leading-none">{isDark ? "🌙" : "☀️"}</span>
      <span className="hidden sm:inline">{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}

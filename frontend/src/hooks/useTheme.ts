import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * Keeps <html class="dark"> in sync with:
 * 1) localStorage('theme') if present
 * 2) else system preference (prefers-color-scheme)
 */
export function useTheme() {
  const getInitial = (): Theme => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  };

  const [theme, setTheme] = useState<Theme>(getInitial);

  // Apply to <html> and persist
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // React to OS changes when user didn't explicitly choose
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark") return; // user choice wins
      setTheme(e.matches ? "dark" : "light");
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, setTheme, toggle, isDark: theme === "dark" };
}

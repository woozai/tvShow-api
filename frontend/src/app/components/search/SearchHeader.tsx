import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { useRecentSearches } from "../../../hooks/useRecentSearches";
import { HomeButton } from "../HomeButton";
import { ThemeToggle } from "../theme/ThemeToggle";

type DropPos = { left: number; top: number; width: number } | null;

export function SearchHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  // --- search state
  const [query, setQuery] = useState("");
  const dq = useDebouncedValue(query, 400);

  // --- recent searches
  const {
    items: recent,
    add: addRecent,
    remove: removeRecent,
    clear: clearRecent,
  } = useRecentSearches();

  // --- dropdown open state + positioning
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dropPos, setDropPos] = useState<DropPos>(null);

  // Sync input with the URL (single source of truth)
  useEffect(() => {
    if (location.pathname === "/search") {
      setQuery(params.get("q") ?? "");
    } else {
      setQuery("");
    }
  }, [location.pathname, params]);

  // Debounced navigation (live search)
  useEffect(() => {
    const current = params.get("q") ?? "";
    const next = dq.trim();

    if (location.pathname === "/search" && next === current) return;

    if (next) {
      navigate(`/search?q=${encodeURIComponent(next)}`);
    } else if (location.pathname === "/search") {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dq]);

  // Submit: navigate + store in history (only here, not on debounce)
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = query.trim();
      if (!q) return;

      addRecent(q); // save to history
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setOpen(false);
    },
    [addRecent, navigate, query]
  );

  // Pick from history: navigate + bubble to top
  const handlePickRecent = useCallback(
    (value: string) => {
      addRecent(value); // move to top of history
      setQuery(value); // update input
      navigate(`/search?q=${encodeURIComponent(value)}`);
      setOpen(false); // close dropdown
    },
    [addRecent, navigate]
  );

  // Measure the input and compute dropdown position (under it, 8px gap)
  const updateDropdownPosition = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setDropPos({
      left: r.left,
      top: r.bottom + 8, // 8px margin
      width: r.width,
    });
  }, []);

  // When opening dropdown, measure + listen to resize/scroll
  useEffect(() => {
    if (!open) return;

    // initial measure
    updateDropdownPosition();

    const onResize = () => updateDropdownPosition();
    const onScroll = () => updateDropdownPosition();

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, updateDropdownPosition]);

  return (
    <header
      className="sticky top-0 z-40
        backdrop-blur
        border-b
        px-6 py-3
        bg-white/70 dark:bg-[#0b0e13]/70
        border-zinc-200 dark:border-zinc-800"
    >
      <div className="flex items-center gap-4 max-w-6xl mx-auto">
        {/* Left: Home */}
        <HomeButton />

        {/* Middle: Search input */}
        <form onSubmit={handleSubmit} className="flex-1">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            // small delay so clicks in dropdown aren't killed immediately
            onBlur={() => setTimeout(() => setOpen(false), 120)}
            placeholder="Search TV Shows..."
            aria-label="Search shows"
            className="
              w-full rounded-lg px-4 py-2
              border
              bg-zinc-100 text-zinc-900
              dark:bg-[#1a1e24] dark:text-white
              border-zinc-200 dark:border-zinc-700
              focus:outline-none focus:ring-2 focus:ring-red-500
            "
          />
        </form>

        {/* Right: Theme toggle */}
        <ThemeToggle />
      </div>

      {/* Recent searches dropdown (portal, same file) */}
      {open &&
        recent.length > 0 &&
        dropPos &&
        createPortal(
          <div
            role="listbox"
            style={{
              position: "fixed",
              left: dropPos.left,
              top: dropPos.top,
              width: dropPos.width,
            }}
            className="
              z-50
              rounded-lg border shadow-xl overflow-hidden
              bg-white border-zinc-200
              dark:bg-[#0b0e13] dark:border-zinc-800
            "
          >
            {/* Header row */}
            <div className="flex items-center justify-between px-3 py-2 text-xs text-zinc-600 dark:text-white/70">
              <span>Recent searches</span>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()} // keep input focus
                onClick={() => clearRecent()}
                className="hover:text-red-500"
                title="Clear all"
              >
                Clear
              </button>
            </div>

            {/* Items */}
            <ul className="max-h-64 overflow-auto">
              {recent.map((r) => (
                <li
                  key={r}
                  className="group flex items-center justify-between px-3"
                >
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handlePickRecent(r)}
                    className="w-full text-left py-2 text-sm
                               text-zinc-800 hover:text-black
                               dark:text-white/90 dark:hover:text-white"
                    title={r}
                  >
                    {r}
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${r}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => removeRecent(r)}
                    className="opacity-0 group-hover:opacity-100 text-xs px-2 py-1
                               text-zinc-500 hover:text-red-500
                               dark:text-white/60 dark:hover:text-red-400"
                    title="Remove"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>,
          document.body
        )}
    </header>
  );
}

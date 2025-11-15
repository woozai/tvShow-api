import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { HomeButton } from "./HomeButton";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useRecentSearches } from "../../hooks/useRecentSearches"; // ✅ add

export function SearchHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const [query, setQuery] = useState("");
  const dq = useDebouncedValue(query, 400);
  const {
    items: recent,
    add: addRecent,
    remove: removeRecent,
    clear: clearRecent,
  } = useRecentSearches(); // ✅

  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // Sync input with the URL (single source of truth)
  useEffect(() => {
    if (location.pathname === "/search") {
      setQuery(params.get("q") ?? "");
    } else {
      setQuery("");
    }
  }, [location.pathname, params]);

  useEffect(() => {
    const current = params.get("q") ?? "";
    const next = dq.trim();
    addRecent(dq); // store on submit

    if (location.pathname === "/search" && next === current) return;

    if (next) navigate(`/search?q=${encodeURIComponent(next)}`);
    else if (location.pathname === "/search") navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dq]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setOpen(false);
  }

  return (
    <header className="flex items-center gap-4 px-6 py-4 sticky top-0 z-40 backdrop-blur">
      <HomeButton />

      <div className="relative flex-1" ref={boxRef}>
        <form onSubmit={handleSubmit}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            className="w-full bg-[#1a1e24] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Search TV Shows..."
            aria-label="Search"
          />
        </form>

        {/* Recent dropdown */}
        {open && recent.length > 0 && (
          <div
            role="listbox"
            className="absolute mt-2 w-full rounded-lg border border-white/10 bg-[#0b0e13] shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-3 py-2 text-xs text-white/70">
              <span>Recent searches</span>
              <button
                type="button"
                onClick={() => clearRecent()}
                className="text-white/60 hover:text-red-400"
              >
                Clear
              </button>
            </div>
            <ul className="max-h-64 overflow-auto">
              {recent.map((r) => (
                <li
                  key={r}
                  className="group flex items-center justify-between px-3"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setQuery(r);
                      navigate(`/search?q=${encodeURIComponent(r)}`);
                      setOpen(false);
                    }}
                    className="w-full text-left px-0 py-2 text-sm text-white/90 hover:text-white"
                  >
                    {r}
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${r}`}
                    onClick={() => removeRecent(r)}
                    className="opacity-0 group-hover:opacity-100 text-xs px-2 py-1 text-white/60 hover:text-red-400"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { HomeButton } from "./HomeButton";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

export function SearchHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const [query, setQuery] = useState("");
  const dq = useDebouncedValue(query, 400);



  // Sync input with the URL (single source of truth)
  useEffect(() => {
    if (location.pathname === "/search") {
      setQuery(params.get("q") ?? "");
    } else {
      // Clear when leaving the search page
      setQuery("");
    }
  }, [location.pathname, params]);

  useEffect(() => {
    const current = params.get("q") ?? "";
    const next = dq.trim();

    // Nothing to do if value didn't change
    if (location.pathname === "/search" && next === current) return;

    if (next) {
      navigate(`/search?q=${encodeURIComponent(next)}`);
    } else if (location.pathname === "/search") {
      // No query → go back to home
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dq]); // depend only on the debounced value

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <>
      <header className="flex items-center gap-4 px-6 py-4 sticky top-0 z-40 backdrop-blur">
        <HomeButton />

        <form onSubmit={handleSubmit} className="flex-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#1a1e24] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Search TV Shows..."
          />
        </form>
      </header>
    </>
  );
}

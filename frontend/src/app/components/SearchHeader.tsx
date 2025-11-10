import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export function SearchHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const [query, setQuery] = useState("");

  // ✅ When leaving /search, clear the input
  useEffect(() => {
    if (location.pathname !== "/search") {
      setQuery("");
    }
  }, [location.pathname]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${query}`);
  }

  return (
    <header className="flex items-center gap-6 px-6 py-4 sticky top-0 backdrop-blur">
      <h1 className="text-2xl font-bold text-red-500">TVMuse</h1>

      <form onSubmit={handleSubmit} className="flex-1">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-[#1a1e24] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Search TV Shows..."
        />
      </form>
    </header>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SearchHeader() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${query}`);
  }

  return (
    <header className="flex items-center gap-6 px-6 py-4 bg-transparent sticky top-0 z-40 backdrop-blur">
      <h1 className="text-2xl font-bold text-red-500">TVMuse</h1>

      <form onSubmit={handleSubmit} className="flex-1">
        <input
          className="w-full bg-[#1a1e24] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Search TV Shows..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
    </header>
  );
}

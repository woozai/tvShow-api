import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ShowCard } from "../components/ShowCard";
import type { SearchResult } from "../../types/searchResults";
import { searchShows } from "../../api/search";

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    async function load() {
      if (!q.trim()) return;

      const data = await searchShows(q);
      setResults(data);
    }

    load();
  }, [q]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        Search Results for: <span className="text-red-500">{q}</span>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {results.map((item: SearchResult) => (
          <ShowCard key={item.show.id} show={item.show} />
        ))}
      </div>
    </div>
  );
}

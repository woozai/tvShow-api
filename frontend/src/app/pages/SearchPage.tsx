import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ShowCard } from "../components/ShowCard";
import type { SearchResult } from "../../types/searchResults";
import { searchShows } from "../../api/search";
import { Loader } from "../components/Loader";
import { BackButton } from "../components/BackButton";

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!q.trim()) return;
      setLoading(true);

      const data = await searchShows(q);
      setResults(data);

      setLoading(false);
    }

    load();
  }, [q]);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <BackButton />

      <h2 className="text-xl font-semibold mb-4">
        Search Results for: <span className="text-red-500">{q}</span>
      </h2>

      {/* ✅ No results */}
      {results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-gray-400 text-lg mb-2">
            No matching TV shows found
          </p>
          <p className="text-gray-500 text-sm">Try searching something else</p>
        </div>
      )}

      {/* ✅ Results */}
      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {results.map((item: SearchResult) => (
            <ShowCard key={item.show.id} show={item.show} />
          ))}
        </div>
      )}
    </div>
  );
}

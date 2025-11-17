import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchShows } from "../../api/search";
import { ShowCard } from "../components/showCard/ShowCard";
import { ShowCardPlaceholder } from "../components/showCard/ShowCardPlaceholder";
import type { SearchResult } from "../../types/saerchResults";

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]); // ✅ array
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const query = q.trim();
      if (!query) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await searchShows(query);
        // res: ApiListResponse<SearchResult>
        setResults(res.items); //
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [q]);

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">
          Search Results for: <span className="text-red-500">{q}</span>
        </h2>
      </div>

      <div className="flex flex-col gap-6">
        {loading ? (
          <div className="flex flex-col gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <ShowCardPlaceholder key={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {results.map((item) => (
              <ShowCard key={item.show.id} show={item.show} /> // ✅ pass the show
            ))}
          </div>
        )}

        {!loading && results.length === 0 && q.trim() && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-400 text-lg mb-2">
              No matching TV shows found
            </p>
            <p className="text-gray-500 text-sm">
              Try searching something else
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

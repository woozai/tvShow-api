import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ShowCard } from "../components/ShowCard";
import type { SearchResult } from "../../types/searchResults";
import { searchShows } from "../../api/search";
import { Loader } from "../components/Loader";

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  function goBack() {
    navigate(-1); // go back to previous page
  }

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
      <h2 className="text-xl font-semibold mb-4">
        Search Results for: <span className="text-red-500">{q}</span>
      </h2>
      <button
        onClick={goBack}
        className="mb-4 text-sm text-red-400 hover:text-red-300 transition"
      >
        ← Back
      </button>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {results.map((item: SearchResult) => (
          <ShowCard key={item.show.id} show={item.show} />
        ))}
      </div>
    </div>
  );
}

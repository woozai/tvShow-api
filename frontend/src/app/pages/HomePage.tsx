import { useEffect, useState } from "react";
import { ShowCard } from "../components/ShowCard";
import { Loader } from "../components/Loader";
import type { Show } from "../../types/show";
import { getPopularShows } from "../../api/shows";

export function HomePage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPopularShows();
        console.log(data);
        setShows(data.items);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Popular Shows</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {shows.map((s) => (
          <ShowCard key={s.id} show={s} />
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import type { Show } from "../../types/show";
import { getShowWithSeasonsAndCast } from "../../api/shows";
import { useFavorites } from "../../hooks/useFavorites";
import { ShowCard } from "../components/showCard/ShowCard";
import { ShowCardPlaceholder } from "../components/showCard/ShowCardPlaceholder";

export function FavoritesPage() {
  const { favorites } = useFavorites(); // array of show IDs
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // No favorites → nothing to load
    if (!favorites.length) {
      setShows([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const data = await Promise.all(
          favorites.map((id) => getShowWithSeasonsAndCast(id))
        );
        if (!cancelled) {
          setShows(data);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [favorites]);

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Favorite Shows</h2>
      </div>

      {!favorites.length && !loading && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          You have no favorite shows yet. Tap the ❤️ icon on any show to add it
          here.
        </p>
      )}

      <div className="flex flex-col gap-6 mt-4">
        {loading ? (
          <div className="flex flex-col gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ShowCardPlaceholder key={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {shows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

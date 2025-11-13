import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { Episode, Show } from "../../types/show";
import { getShowWithSeasonsAndCast } from "../../api/shows";
import { getSeasonEpisodes } from "../../api/seasons";
import { BackButton } from "../components/BackButton";
import { ShowHeader } from "../components/showPage/ShowHeader";
import { SeasonBlock } from "../components/showPage/SeasonBlock";
import { CastList } from "../components/showPage/CastList";

type EpisodesMap = Record<number, Episode[] | undefined>;
type LoadingMap = Record<number, boolean>;
type OpenMap = Record<number, boolean>;

export default function ShowPage() {
  const { id } = useParams<{ id: string }>();
  const showId = Number(id);
  const isValidId = Number.isFinite(showId) && String(showId) === id;

  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [episodesBySeason, setEpisodesBySeason] = useState<EpisodesMap>({});
  const [loadingSeason, setLoadingSeason] = useState<LoadingMap>({});
  const [openSeason, setOpenSeason] = useState<OpenMap>({});

  const seasons = useMemo(() => show?._embedded?.seasons ?? [], [show]);
  const cast = useMemo(() => show?._embedded?.cast ?? [], [show]);

  useEffect(() => {
    if (!isValidId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getShowWithSeasonsAndCast(showId);
        if (!cancelled) setShow(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isValidId, showId]);

  async function onToggleSeason(seasonId: number) {
    setOpenSeason((m) => ({ ...m, [seasonId]: !m[seasonId] }));
    if (!episodesBySeason[seasonId]) {
      setLoadingSeason((m) => ({ ...m, [seasonId]: true }));
      try {
        const res = await getSeasonEpisodes(seasonId);
        setEpisodesBySeason((m) => ({ ...m, [seasonId]: res.items }));
      } finally {
        setLoadingSeason((m) => ({ ...m, [seasonId]: false }));
      }
    }
  }

  if (!isValidId) {
    return (
      <div className="p-6">
        <p className="opacity-80">Invalid show id.</p>
        <BackButton fallback="/" label="Back" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <BackButton fallback="/" label="Back" />

      {loading && <div className="h-40 rounded-lg bg-white/5 animate-pulse" />}
      {error && <div className="text-sm text-red-400">{error}</div>}

      {!loading && show && (
        <>
          <ShowHeader show={show} />

          {/* Seasons */}
          <section className="mt-8">
            <h2 className="text-lg font-medium mb-3">Seasons</h2>
            {!seasons.length && (
              <div className="text-sm opacity-70">No seasons available.</div>
            )}

            <div className="space-y-3">
              {seasons.map((s) => (
                <SeasonBlock
                  key={s.id}
                  season={s}
                  isOpen={!!openSeason[s.id]}
                  isLoading={!!loadingSeason[s.id]}
                  episodes={episodesBySeason[s.id]}
                  onToggle={onToggleSeason}
                />
              ))}
            </div>
          </section>

          {/* Cast */}
          <section className="mt-10">
            <h2 className="text-lg font-medium mb-3">Cast</h2>
            <CastList cast={cast} />
          </section>
        </>
      )}
    </div>
  );
}

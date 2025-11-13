import type { Episode, Season } from "../../../types/show";
import { EpisodeCard } from "./EpisodeCard";

interface Props {
  season: Season;
  isOpen: boolean;
  isLoading: boolean;
  episodes?: Episode[];
  onToggle: (seasonId: number) => void;
  onEpisodeClick?: (ep: Episode) => void; // optional for future navigation
}

export function SeasonBlock({
  season,
  isOpen,
  isLoading,
  episodes,
  onToggle,
  onEpisodeClick,
}: Props) {
  return (
    <div className="rounded-lg border border-white/10">
      <button
        onClick={() => onToggle(season.id)}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-white/10 transition"
        title={season.premiereDate ?? undefined}
      >
        <div className="text-sm">
          Season {season.number}
          {season.episodeOrder ? ` • ${season.episodeOrder} episodes` : ""}
          {season.premiereDate ? ` • ${season.premiereDate}` : ""}
        </div>
        <span className="text-xs opacity-70">
          {isOpen ? "Hide" : "Show"} episodes
        </span>
      </button>

      {isOpen && (
        <div className="px-3 pb-3">
          {isLoading && (
            <div className="h-20 rounded bg-white/5 animate-pulse" />
          )}

          {!isLoading && episodes && (
            <ul className="mt-2 space-y-2">
              {episodes.map((e) => (
                <EpisodeCard key={e.id} episode={e} onClick={onEpisodeClick} />
              ))}
            </ul>
          )}

          {!isLoading && !episodes && (
            <div className="mt-2 text-xs opacity-70">No episodes found.</div>
          )}
        </div>
      )}
    </div>
  );
}

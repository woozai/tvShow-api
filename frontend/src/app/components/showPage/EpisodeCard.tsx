import type { Episode } from "../../../types/show";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { ExpandableText } from "../ExpandableText";

interface Props {
  episode: Episode;
  onClick?: (ep: Episode) => void;
}

export function EpisodeCard({ episode, onClick }: Props) {
  const img = episode.image?.medium;
  const cleanSummary = episode.summary?.replace(/<[^>]+>/g, "") ?? "";

  return (
    <li
      className="
        flex gap-4 items-start rounded-lg
        border border-zinc-300 dark:border-gray-700
        bg-zinc-100 dark:bg-[#0b0e13]
        p-3 transition-all duration-200 cursor-pointer
        hover:scale-[1.02] hover:border-red-500 hover:shadow-xl
      "
      onClick={onClick ? () => onClick(episode) : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : -1}
    >
      {/* IMAGE */}
      {img ? (
        <div className="relative shrink-0 w-40 h-28 overflow-hidden rounded-md">
          <img
            src={img}
            alt={episode.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-40 h-28 bg-zinc-300 dark:bg-white/10 rounded-md flex items-center justify-center text-xs opacity-50">
          No image
        </div>
      )}

      {/* CONTENT */}
      <div className="flex flex-col justify-center min-w-0 flex-1">
        <div className="flex items-center gap-2 min-w-0">
          <div className="text-sm font-medium truncate text-zinc-900 dark:text-zinc-100">
            E{episode.number ?? "?"} — {episode.name}
          </div>

          {episode.url && (
            <a
              href={episode.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 dark:text-gray-400 hover:text-red-400 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            </a>
          )}
        </div>

        <div className="text-xs text-zinc-600 dark:text-zinc-400">
          {episode.airdate ? `Air date: ${episode.airdate}` : "No air date"}
          {episode.runtime ? ` • ${episode.runtime}m` : ""}
          {episode.rating?.average ? ` • ⭐ ${episode.rating.average}` : ""}
        </div>

        {cleanSummary && (
          <ExpandableText
            text={cleanSummary}
            maxLines={2}
            className="text-sm text-zinc-700 dark:text-gray-300"
            buttonClassName="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
          />
        )}
      </div>
    </li>
  );
}

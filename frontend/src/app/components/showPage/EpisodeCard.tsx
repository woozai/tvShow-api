import type { Episode } from "../../../types/show";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

interface Props {
  episode: Episode;
  onClick?: (ep: Episode) => void;
}

export function EpisodeCard({ episode, onClick }: Props) {
  const img = episode.image?.medium ?? undefined;

  return (
    <li
      className="
        flex gap-4 items-start 
        rounded-lg border border-gray-700 
        bg-[#0b0e13]
        p-3 transition-all duration-200 cursor-pointer
        hover:scale-[1.02] hover:border-red-500 hover:shadow-xl
      "
      onClick={onClick ? () => onClick(episode) : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : -1}
    >
      {/* Image */}
      {img ? (
        <div className="relative flex-shrink-0 w-28 h-[72px] overflow-hidden rounded-md">
          <img
            src={img}
            alt={episode.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="w-28 h-[72px] bg-white/10 rounded-md flex items-center justify-center text-xs opacity-50">
          No image
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col justify-center min-w-0 flex-1">
        <div className="flex items-center gap-2 min-w-0">
          <div className="text-sm font-medium truncate">
            E{episode.number ?? "?"} — {episode.name}
          </div>

          {/* External link icon */}
          {episode.url && (
            <a
              href={episode.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-red-400 transition-colors"
              title="Open episode page"
              onClick={(e) => e.stopPropagation()} // prevent card click
            >
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Meta info */}
        <div className="text-xs opacity-70">
          {episode.airdate ? `Air date: ${episode.airdate}` : "No air date"}
          {episode.runtime ? ` • ${episode.runtime}m` : ""}
          {episode.rating?.average != null
            ? ` • ⭐ ${episode.rating.average}`
            : ""}
        </div>

        {/* Summary */}
        {episode.summary && (
          <div
            className="text-xs opacity-90 mt-1 line-clamp-2 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: episode.summary }}
          />
        )}
      </div>
    </li>
  );
}

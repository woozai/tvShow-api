import { type KeyboardEvent } from "react";
import type { Show } from "../../../types/show";
import { useNavigate } from "react-router-dom";
import { ExpandableText } from "../ExpandableText";
import { useFavorites } from "../../../hooks/useFavorites";

interface Props {
  show: Show;
}

/**
 * ShowCard
 * - Clickable (mouse + keyboard) card for a single show
 * - Theme-aware background, borders, and text
 * - Handles missing images and strips HTML from summary
 */
export function ShowCard({ show }: Props) {
  const navigate = useNavigate();
  const imageUrl = show.image?.medium ?? null;
  const rating = show.rating?.average;
  const genres = show.genres ?? [];

  const rawSummary = show.summary ?? "No summary available.";
  // Remove any HTML tags from TVMaze summaries
  const summaryText = rawSummary.replace(/<[^>]+>/g, "");

  const { isFav, toggle } = useFavorites();
  const fav = isFav(show.id);

  const handleClick = () => {
    navigate(`/show/${show.id}`);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className="
        mb-3 cursor-pointer rounded-lg
        border border-zinc-200 dark:border-zinc-700
        bg-white dark:bg-[#0b0e13]
        hover:border-red-500
        transition-all duration-200 hover:shadow-xl hover:scale-[1.01]
      "
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Go to show page for ${show.name}`}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-start gap-3 p-3">
        {/* Image with fixed aspect ratio (matches placeholder) */}
        <div className="w-32 sm:w-36 md:w-40 shrink-0">
          <div
            className="
              relative w-full aspect-2/3
              rounded-md overflow-hidden
              border border-zinc-200 dark:border-zinc-700
              bg-zinc-100 dark:bg-[#151922]
            "
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={show.name}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-start justify-start p-2 text-zinc-500 dark:text-zinc-400">
                <span className="text-4xl">📺</span>
                <span className="text-sm">No Image Available</span>
              </div>
            )}
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1 flex flex-col items-start space-y-2 h-full">
          {/* Title + rating */}
          <div className="w-full flex items-start justify-between gap-2">
            <h2
              className="text-xl sm:text-2xl font-semibold line-clamp-1"
              title={show.name}
            >
              {show.name}
            </h2>

            <div className="flex items-center">
              <p
                className="
                  text-base sm:text-lg font-medium shrink-0 ml-2
                  text-yellow-500 dark:text-yellow-400
                "
              >
                ⭐ {rating ?? "N/A"}
              </p>
              {/* ❤️ FAVORITE BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(show.id);
                }}
                className="text-xl transition hover:scale-110 ml-2"
              >
                {fav ? "❤️" : "🤍"}
              </button>
            </div>
          </div>

          {/* Genres line */}
          {genres.length > 0 ? (
            <p className="text-sm sm:text-base line-clamp-1 text-zinc-500 dark:text-zinc-400">
              {genres.join(" · ")}
            </p>
          ) : (
            <p className="text-sm sm:text-base italic text-zinc-500 dark:text-zinc-400">
              No genres
            </p>
          )}

          {/* Divider */}
          <div className="w-full border-t border-zinc-200 dark:border-zinc-700 my-1" />

          {/* Summary (HTML stripped above) */}
          {summaryText && (
            <ExpandableText
              text={summaryText}
              maxLines={4}
              className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300"
              buttonClassName="text-xs text-blue-500 hover:underline mt-1"
            />
          )}
        </div>
      </div>
    </div>
  );
}

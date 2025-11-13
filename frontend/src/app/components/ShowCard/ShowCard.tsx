import { useState, type KeyboardEvent } from "react";
import type { Show } from "../../../types/show";

interface Props {
  show: Show;
}

export function ShowCard({ show }: Props) {
  const [expanded, setExpanded] = useState(false);

  const imageUrl = show.image?.medium;
  const rating = show.rating?.average;
  const genres = show.genres ?? [];

  const rawSummary = show.summary ?? "No summary available.";
  const summaryText = rawSummary.replace(/<[^>]+>/g, "");

  const handleClick = () => {
    console.log("clicked to navigate show page:", show.id);
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
        card mb-3 cursor-pointer
        rounded-lg border border-gray-700 hover:border-red-500
        bg-[#0b0e13]
        transition-all duration-200
        hover:shadow-xl hover:scale-[1.01]
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
          <div className="relative w-full aspect-[2/3]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={show.name}
                className="absolute inset-0 w-full h-full object-contain rounded-md"
              />
            ) : (
              <div className="absolute inset-0 bg-[#1a1e24] rounded-md flex flex-col items-start justify-start text-gray-400 p-2">
                <span className="text-4xl">📺</span>
                <span className="text-sm">No Image Available</span>
              </div>
            )}
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1 flex flex-col items-start space-y-2 h-full">
          <div className="w-full flex items-start justify-between">
            <h2 className="text-xl sm:text-2xl font-semibold line-clamp-1">
              {show.name}
            </h2>

            <p className="text-base sm:text-lg font-medium text-yellow-400 shrink-0 ml-2">
              ⭐ {rating ?? "N/A"}
            </p>
          </div>

          {genres.length > 0 ? (
            <p className="text-sm sm:text-base text-gray-400 line-clamp-1">
              {genres.join(", ")}
            </p>
          ) : (
            <p className="text-sm sm:text-base text-gray-500 italic">
              No genres
            </p>
          )}

          <div className="w-full border-t border-gray-700 my-1" />

          {/* Summary */}
          <p
            className={`
              text-sm sm:text-base text-gray-300
              ${expanded ? "" : "line-clamp-3"}
            `}
          >
            {summaryText}
          </p>

          {/* Show more / less */}
          {summaryText.length > 140 && (
            <button
              type="button"
              className="text-xs sm:text-sm text-blue-400 hover:underline"
              onClick={(e) => {
                e.stopPropagation(); // don't trigger card click
                setExpanded((prev) => !prev);
              }}
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

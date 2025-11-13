import { useState } from "react";
import type { Show } from "../../../types/show";

// Heroicons
import {
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

interface Props {
  show: Show;
}

export function ShowHeader({ show }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!show.url) return;
    navigator.clipboard.writeText(show.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex gap-6">
      {show.image?.medium && (
        <img
          src={show.image.medium}
          alt={show.name}
          className="w-40 h-56 object-cover rounded-lg"
          loading="lazy"
        />
      )}

      <div className="flex-1">
        {/* Title Row */}
        <div className="flex items-center gap-3">
          {/* Title + Link Icon (hover only on link) */}
          <h1 className="text-2xl font-semibold">{show.name}</h1>

          {/* External icon link (independent hover) */}
          {show.url && (
            <a
              href={show.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                transition-colors
                text-gray-400
                hover:text-red-400
                "
              title="Open official page"
            >
              <ArrowTopRightOnSquareIcon className="w-5 h-5" />
            </a>
          )}

          {/* Copy Button (only turns red when hovering itself) */}
          {show.url && (
            <button
              onClick={handleCopy}
              className="
                text-gray-400 
                hover:text-red-400
                transition-colors
                px-2 py-1 
                rounded-md 
                flex items-center gap-1
              "
              title="Copy show URL"
            >
              {copied ? (
                <ClipboardDocumentCheckIcon className="w-4 h-4 text-red-400" />
              ) : (
                <ClipboardDocumentIcon className="w-4 h-4" />
              )}

              {copied && <span className="text-xs  text-red-400">Copied!</span>}
            </button>
          )}
        </div>

        {/* Rating */}
        {show.rating?.average != null && (
          <div className="mt-1 text-sm opacity-80">
            ⭐ {show.rating.average}
          </div>
        )}

        {/* Genres */}
        {show.genres?.length ? (
          <div className="mt-2 text-xs opacity-80">
            {show.genres.join(" · ")}
          </div>
        ) : null}

        {/* Summary */}
        {show.summary && (
          <div
            className="mt-3 text-sm opacity-90 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: show.summary }}
          />
        )}
      </div>
    </div>
  );
}

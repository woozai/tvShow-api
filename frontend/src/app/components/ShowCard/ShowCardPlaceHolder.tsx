export function ShowCardPlaceholder() {
  return (
    <div
      className="
        animate-pulse
        card mb-3
        rounded-lg border border-gray-700
        bg-[#0b0e13]
        p-3
      "
    >
      <div className="flex items-start gap-3">
        {/* Image placeholder */}
        <div className="w-32 sm:w-36 md:w-40 shrink-0">
          <div className="w-full aspect-[2/3] bg-gray-800 rounded-md" />
        </div>

        {/* Right side content — EXACT SAME STRUCTURE + GAPS */}
        <div className="flex-1 flex flex-col items-start space-y-3 h-full">
          {/* Title + rating row */}
          <div className="w-full flex items-start justify-between">
            <div className="h-6 sm:h-7 bg-gray-700 rounded w-2/3" />
            <div className="h-5 sm:h-6 bg-gray-700 rounded w-14" />
          </div>

          {/* Genres row */}
          <div className="h-4 sm:h-5 bg-gray-700 rounded w-1/3" />

          {/* Divider */}
          <div className="w-full border-t border-gray-700 my-1" />

          {/* Summary – 3 lines with TEXT-LIKE spacing */}
          <div className="w-full space-y-3">
            <div className="h-4 bg-gray-600 rounded w-full" />
            <div className="h-4 bg-gray-600 rounded w-5/6" />
            <div className="h-4 bg-gray-600 rounded w-4/6" />
          </div>
        </div>
      </div>
    </div>
  );
}

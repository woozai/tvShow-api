// src/app/components/Pagination.tsx
import type { ReactNode } from "react";

interface PaginationProps {
  page: number; // 0-based
  pageSize: number; // e.g. 20
  itemsCount: number; // how many items we got for THIS page
  loading?: boolean;
  onPageChange: (nextPage: number) => void;
  className?: string;
  noMoreLabel?: ReactNode;
}

export function Pagination({
  page,
  pageSize,
  itemsCount,
  loading = false,
  onPageChange,
  className = "",
  noMoreLabel = "No more shows",
}: PaginationProps) {
  const isFirstPage = page === 0;
  const isLastPage = itemsCount === 0 || itemsCount < pageSize;

  const handlePrev = () => {
    if (isFirstPage || loading) return;
    onPageChange(Math.max(0, page - 1));
  };

  const handleNext = () => {
    if (isLastPage || loading) return;
    onPageChange(page + 1);
  };

  return (
    <div className={`mt-4 flex flex-col items-center gap-2 ${className}`}>
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          disabled={isFirstPage || loading}
          onClick={handlePrev}
          className="rounded-md border border-white/10 px-3 py-1.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <span className="text-sm opacity-80">Page {page + 1}</span>

        <button
          type="button"
          disabled={isLastPage || loading}
          onClick={handleNext}
          className="rounded-md border border-white/10 px-3 py-1.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {!loading && isLastPage && (
        <div className="text-xs opacity-70">{noMoreLabel}</div>
      )}
    </div>
  );
}

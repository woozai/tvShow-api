// src/app/components/Pagination.tsx
interface PaginationProps {
  page: number; // 0-based
  pageSize: number;
  itemsCount: number;
  loading?: boolean;
  onPageChange: (nextPage: number) => void;
}

export function Pagination({
  page,
  pageSize,
  itemsCount,
  loading = false,
  onPageChange,
}: PaginationProps) {
  const isFirstPage = page === 0;
  const isLastPage = itemsCount < pageSize;

  const btn =
    "px-3 py-1.5 text-sm rounded-md transition active:scale-95 border border-red-500/50 text-red-500 " +
    "hover:bg-red-500/10 hover:text-red-400 " +
    "dark:border-red-400/40 dark:text-red-400 dark:hover:bg-red-400/10 dark:hover:text-red-300 " +
    "disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="mt-6 flex items-center justify-center gap-4">
      {/* FIRST */}
      <button
        className={btn}
        disabled={isFirstPage || loading}
        onClick={() => onPageChange(0)}
      >
        First
      </button>

      {/* PREV */}
      <button
        className={btn}
        disabled={isFirstPage || loading}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>

      {/* CURRENT PAGE */}
      <span className="text-sm opacity-80">
        Page <strong>{page + 1}</strong>
      </span>

      {/* NEXT */}
      <button
        className={btn}
        disabled={isLastPage || loading}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}

type Props = {
  page: number; // zero-based page index
  onPrev: () => void;
  onNext: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
};

export function Pagination({
  page,
  onPrev,
  onNext,
  disablePrev,
  disableNext,
}: Props) {
  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <button
        onClick={onPrev}
        disabled={disablePrev}
        className="px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-[#1a1e24]
           text-zinc-900 dark:text-white disabled:opacity-40
           hover:bg-zinc-200 dark:hover:bg-[#232830] transition"
        aria-label="Previous page"
      >
        ← Prev
      </button>

      <span className="text-sm text-gray-400">
        Page <span className="font-medium text-white">{page + 1}</span>
      </span>

      <button
        onClick={onNext}
        disabled={disableNext}
        className="px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-[#1a1e24]
           text-zinc-900 dark:text-white disabled:opacity-40
           hover:bg-zinc-200 dark:hover:bg-[#232830] transition"
        aria-label="Next page"
      >
        Next →
      </button>
    </div>
  );
}

type Props = { isOpen: boolean; onToggle: () => void };

export function FilterToggle({ isOpen, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-lg border border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-800"
      aria-expanded={isOpen}
      aria-controls="filters"
    >
      {isOpen ? "Hide Filters" : "Show Filters"}
    </button>
  );
}

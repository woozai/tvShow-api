import type { ReactNode } from "react";
import { ToggleSwitch } from "./FilterToggel";

interface FilterButtonProps {
  onClick?: () => void; 
  onToggle?: () => void; 
  children?: ReactNode;
  active?: boolean; 
  hasSavedFilters?: boolean; 
}

export function FilterButton({
  onClick,
  onToggle,
  children,
  active,
  hasSavedFilters = false,
}: FilterButtonProps) {
  const base =
    "inline-flex items-center justify-between gap-3 rounded-xl px-3 py-1.5 text-sm transition active:scale-95";
  const inactive =
    "border border-white/10 text-white hover:bg-white/5 hover:ring-2 hover:ring-white/10";
  const activeState =
    "border border-red-500 text-red-400 hover:bg-red-500/10 hover:ring-2 hover:ring-red-500";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${active ? activeState : inactive}`}
      aria-label="Open filters"
      title="Open filters"
    >
      {/* Left: icon + label */}
      <div className="flex items-center gap-2">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          className={`transition-colors ${
            active ? "text-red-400" : "text-white/80"
          }`}
          aria-hidden="true"
        >
          <path d="M3 5h18l-7 8v5l-4 2v-7L3 5z" fill="currentColor" />
        </svg>
        <span
          className={`transition-colors ${
            active ? "text-red-400" : "text-white/90"
          }`}
        >
          {children || "Filters"}
        </span>
      </div>

      {/* Right: toggle (click does NOT open modal unless no saved filters) */}
      <div onClick={(e) => e.stopPropagation()} className="-mr-1">
        <ToggleSwitch
          checked={!!active}
          onChange={() => {
            // ✅ If toggle is OFF and no saved filters → open modal instead
            if (!active && !hasSavedFilters) {
              onClick?.();
              return;
            }
            // otherwise, just toggle enable/disable
            onToggle?.();
          }}
          ariaLabel={active ? "Disable filters" : "Enable filters"}
          title={active ? "Disable filters" : "Enable filters"}
          size="sm"
          className={active ? "border-red-500 bg-red-500/25" : ""}
        />
      </div>
    </button>
  );
}

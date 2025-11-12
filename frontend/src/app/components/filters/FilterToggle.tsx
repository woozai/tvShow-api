import { memo } from "react";

type Size = "sm" | "md";

interface ToggleSwitchProps {
  checked: boolean;
  onChange?: () => void;
  ariaLabel?: string;
  title?: string;
  size?: Size;
  className?: string;
}

function sizeClasses(size: Size) {
  // Carefully chosen to align knob perfectly at both ends
  if (size === "sm") {
    return {
      track: "h-5 w-9", // 20px x 36px
      knob: "h-4 w-4", // 16px
      pad: "p-[2px]", // 2px padding
      shift: "translate-x-4", // 16px shift → perfect edge alignment
    };
  }
  // md (slightly larger)
  return {
    track: "h-6 w-11", // 24px x 44px
    knob: "h-5 w-5", // 20px
    pad: "p-[2px]",
    shift: "translate-x-5", // 20px shift
  };
}

/**
 * Accessible, pixel-perfect toggle switch.
 * - role="switch" + aria-checked
 * - Keyboard support (Space/Enter)
 * - Sizes: sm, md
 */
export const ToggleSwitch = memo(function ToggleSwitch({
  checked,
  onChange,
  ariaLabel,
  title,
  size = "sm",
  className = "",
}: ToggleSwitchProps) {
  const s = sizeClasses(size);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      title={title}
      onClick={onChange}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onChange?.();
        }
      }}
      className={[
        "relative inline-flex items-center rounded-full border transition-colors duration-300 focus:outline-none focus:ring-2",
        s.track,
        s.pad,
        checked
          ? "border-red-500 bg-red-500/25 focus:ring-red-500"
          : "border-white/15 bg-white/10 hover:bg-white/15 focus:ring-white/30",
        className,
      ].join(" ")}
    >
      <span
        className={[
          "pointer-events-none inline-block rounded-full bg-white shadow-sm ring-1 ring-black/5 transform transition-transform duration-300",
          s.knob,
          checked ? s.shift : "",
        ].join(" ")}
      />
    </button>
  );
});

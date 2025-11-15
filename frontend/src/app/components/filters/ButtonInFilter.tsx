export const ButtonInFilter = ({
  buttonType,
  isActive,
  onToggle,
}: {
  buttonType: string;
  isActive: boolean;
  onToggle: (genre: string) => void;
}) => {
  return (
    <button
      key={buttonType}
      type="button"
      onClick={() => onToggle(buttonType)}
      className={`
        rounded-full px-3 py-1 text-xs border transition
        focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-white/30
        ${
          isActive
            ? // Active: red pill in both themes
              "bg-red-500 text-white border-red-500"
            : // Inactive: neutral gray in both themes
              "border-zinc-300 text-zinc-700 hover:bg-zinc-100 " +
              "dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-white/10"
        }
      `}
      aria-pressed={isActive}
    >
      {buttonType}
    </button>
  );
};

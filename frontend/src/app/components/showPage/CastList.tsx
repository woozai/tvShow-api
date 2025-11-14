import type { Embedded } from "../../../types/show";

type CastItem = NonNullable<Embedded["cast"]>[number];

interface Props {
  cast: CastItem[];
}

export function CastList({ cast }: Props) {
  if (!cast.length) {
    return <div className="text-sm opacity-70">No cast information.</div>;
  }

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {cast.map((c) => {
        const person = c.person;
        const character = c.character;
        const img =
          person?.image?.medium || person?.image?.original || undefined;

        const hasPersonLink = Boolean(person?.url);
        const hasCharacterLink = Boolean(character?.url);

        const handleCardClick = () => {
          if (person?.url) {
            window.open(person.url, "_blank", "noopener,noreferrer");
          }
        };

        const handleCardKeyDown: React.KeyboardEventHandler<HTMLLIElement> = (
          event
        ) => {
          if (!hasPersonLink) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleCardClick();
          }
        };

        return (
          <li
            key={`${person?.id ?? "p"}-${character?.id ?? "c"}`}
            className={`rounded-lg border border-white/10 p-4 flex flex-col hover:border-red-500 hover:shadow-xl hover:bg-white/5 transition
    ${hasPersonLink ? "cursor-pointer" : "cursor-default"}`}
            onClick={hasPersonLink ? handleCardClick : undefined}
            onKeyDown={hasPersonLink ? handleCardKeyDown : undefined}
            role={hasPersonLink ? "button" : undefined}
            tabIndex={hasPersonLink ? 0 : -1}
          >
            {/* IMAGE */}
            <div className="w-full h-52 rounded-md overflow-hidden bg-white/10 flex items-center justify-center">
              {img ? (
                <img
                  src={img}
                  alt={person?.name ?? "Actor"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="text-xs opacity-50">No image</div>
              )}
            </div>

            {/* TEXT */}
            <div className="mt-3">
              {/* Actor name – bigger text + hover shows full name */}
              <div
                className="text-base font-semibold truncate" // ⬅ increased from text-sm
                title={person?.name ?? "Unknown Actor"} // ⬅ hover: full actor name
              >
                {person?.name ?? "Unknown Actor"}
              </div>

              {/* Character line – bigger text + hover shows full character name */}
              <div className="text-sm opacity-80 truncate">
                {" "}
                {/* ⬅ was text-xs */}
                as{" "}
                {hasCharacterLink ? (
                  <a
                    href={character!.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-2 hover:underline text-blue-400"
                    onClick={(e) => e.stopPropagation()} // prevent card click
                    title={character?.name ?? "Unknown Role"} // ⬅ hover: full character name
                  >
                    {character?.name ?? "Unknown Role"}
                  </a>
                ) : (
                  <span title={character?.name ?? "Unknown Role"}>
                    {character?.name ?? "Unknown Role"}
                  </span>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

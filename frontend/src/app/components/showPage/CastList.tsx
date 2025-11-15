import type { Embedded } from "../../../types/show";

type CastItem = NonNullable<Embedded["cast"]>[number];

interface Props {
  cast: CastItem[];
}

export function CastList({ cast }: Props) {
  if (!cast.length) {
    return (
      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        No cast information.
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {cast.map((c) => {
        const person = c.person;
        const character = c.character;
        const img = person?.image?.medium || person?.image?.original;

        const clickable = Boolean(person?.url);

        return (
          <li
            key={`${person?.id ?? "p"}-${character?.id ?? "c"}`}
            className={`
              rounded-lg border 
              border-zinc-300 dark:border-white/10 
              bg-zinc-100 dark:bg-[#0b0e13]
              hover:border-red-500 hover:shadow-lg hover:bg-zinc-200 dark:hover:bg-white/5
              transition cursor-${clickable ? "pointer" : "default"} p-4
            `}
            onClick={() => clickable && window.open(person!.url!, "_blank")}
            role={clickable ? "button" : undefined}
            tabIndex={clickable ? 0 : -1}
          >
            {/* IMAGE */}
            <div className="w-full h-52 rounded-md overflow-hidden bg-zinc-300 dark:bg-white/10 flex items-center justify-center">
              {img ? (
                <img
                  src={img}
                  alt={person?.name ?? "Actor"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-xs opacity-50">No image</div>
              )}
            </div>

            {/* TEXT */}
            <div className="mt-3">
              <div
                className="text-base font-semibold truncate text-zinc-800 dark:text-white"
                title={person?.name}
              >
                {person?.name ?? "Unknown Actor"}
              </div>

              <div className="text-sm text-zinc-600 dark:text-zinc-300 truncate">
                as{" "}
                {character?.url ? (
                  <a
                    href={character.url}
                    onClick={(e) => e.stopPropagation()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {character?.name}
                  </a>
                ) : (
                  character?.name ?? "Unknown Role"
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

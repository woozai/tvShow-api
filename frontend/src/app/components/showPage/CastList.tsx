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
        const img = person?.image?.medium || person?.image?.original || undefined;

        return (
          <li
            key={`${person?.id ?? "p"}-${character?.id ?? "c"}`}
            className="rounded-lg border border-white/10 p-3 flex gap-3 hover:bg-white/5 transition"
          >
            {img ? (
              <img
                src={img}
                alt={person?.name ?? "Actor"}
                className="w-14 h-14 rounded object-cover flex-none"
                loading="lazy"
              />
            ) : (
              <div className="w-14 h-14 rounded bg-white/10 flex-none" />
            )}

            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{person?.name ?? "Unknown Actor"}</div>
              <div className="text-xs opacity-80 truncate">as {character?.name ?? "Unknown Role"}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

import { Tooltip } from "../Tooltip";

interface Props {
  show: {
    id: number;
    name: string;
    image?: { medium: string };
    genres?: string[];
    rating?: { average: number | null };
  };
}

export function ShowCard({ show }: Props) {
  const imageUrl = show.image?.medium;
  const rating = show.rating?.average;
  const genres = show.genres ?? [];

  return (
    <div className="card p-2 cursor-pointer transition hover:-translate-y-1 hover:shadow-lg rounded-lg">
      {/* Image or Fallback */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={show.name}
          className="show-img w-full h-64 object-cover rounded-lg"
        />
      ) : (
        <div className="w-full h-64 bg-[#1a1e24] rounded-lg flex flex-col items-center justify-center text-gray-400">
          <span className="text-4xl mb-2">📺</span>
          <span className="text-sm">No Image Available</span>
        </div>
      )}

      {/* Title with Tooltip */}
      <Tooltip text={show.name}>
        <h3 className="mt-3 text-lg font-semibold truncate">{show.name}</h3>
      </Tooltip>

      {/* Genres with Tooltip */}
      {genres.length > 0 ? (
        <Tooltip text={genres.join(", ")}>
          <p className="text-sm text-gray-400 truncate">{genres.join(", ")}</p>
        </Tooltip>
      ) : (
        <p className="text-sm text-gray-500 italic">No genres</p>
      )}

      {/* Rating */}
      <p className="mt-1 text-sm font-medium text-yellow-400">
        ⭐ {rating ? rating : "N/A"}
      </p>
    </div>
  );
}

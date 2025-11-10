interface Props {
  show: {
    id: number;
    name: string;
    image?: { medium: string };
  };
}

export function ShowCard({ show }: Props) {
  const imageUrl = show.image?.medium;

  return (
    <div className="card p-2 cursor-pointer transition hover:-translate-y-1">
      {/* ✅ Image block with fallback */}
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

      {/* ✅ Title */}
      <h3 className="mt-3 text-lg font-semibold">{show.name}</h3>
    </div>
  );
}

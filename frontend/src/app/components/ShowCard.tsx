interface Props {
  show: {
    id: number;
    name: string;
    image?: { medium: string };
  };
}

export function ShowCard({ show }: Props) {
  return (
    <div className="card p-2 cursor-pointer transition hover:-translate-y-1">
      <img
        src={show.image?.medium}
        alt={show.name}
        className="show-img w-full h-64 object-cover rounded-lg"
      />

      <h3 className="mt-3 text-lg font-semibold">{show.name}</h3>
    </div>
  );
}

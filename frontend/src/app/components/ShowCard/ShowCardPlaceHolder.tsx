export function ShowCardPlaceholder() {
  return (
    <div className="animate-pulse p-2 rounded-lg bg-[#1a1e24]">
      <div className="w-full h-64 bg-gray-800 rounded-lg mb-3" />

      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-700 rounded w-1/2 mb-3" />

      <div className="h-3 bg-gray-600 rounded w-1/4" />
    </div>
  );
}

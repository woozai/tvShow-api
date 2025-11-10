import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  fallback?: string; // optional fallback route (e.g. "/")
  label?: string; // optional custom label
}

export function BackButton({
  fallback = "/",
  label = "Back",
}: BackButtonProps) {
  const navigate = useNavigate();

  function goBack() {
    // If there is history, go back
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    }
    // Otherwise go to fallback page
    else {
      navigate(fallback);
    }
  }

  return (
    <button
      onClick={goBack}
      className="group flex items-center gap-2 mb-4 px-3 py-2 w-fit 
               bg-[#1a1e24] hover:bg-[#232830] 
               text-white font-medium rounded-lg
               shadow-sm hover:shadow-md 
               transition-all duration-200"
    >
      <span className="text-xl transition-transform group-hover:-translate-x-1">
        ←
      </span>
      <span className="transition-colors group-hover:text-red-400">
        {label}
      </span>
    </button>
  );
}

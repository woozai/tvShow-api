import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  fallback?: string;
  label?: string;
}

export function BackButton({
  fallback = "/",
  label = "Back",
}: BackButtonProps) {
  const navigate = useNavigate();

  function goBack() {
    if (window.history.state && window.history.state.idx > 0) navigate(-1);
    else navigate(fallback);
  }

  return (
    <button
      onClick={goBack}
      className="group flex items-center gap-1 mb-3 px-2 py-1.5 w-fit
           bg-zinc-100 dark:bg-[#1a1e24] hover:bg-zinc-200 dark:hover:bg-[#232830]
           text-sm text-zinc-900 dark:text-white rounded-md
           shadow-sm hover:shadow transition-all duration-200"
    >
      <span className="text-base transition-transform group-hover:-translate-x-0.5">
        ←
      </span>
      <span className="group-hover:text-red-400">{label}</span>
    </button>
  );
}

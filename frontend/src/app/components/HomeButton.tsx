import { useNavigate } from "react-router-dom";

export function HomeButton() {
  const navigate = useNavigate();

  function goHome() {
    navigate("/");
  }

  return (
    <button
      onClick={goHome}
      className="text-2xl font-bold text-red-500 hover:text-red-400 transition cursor-pointer select-none"
    >
      TVMuse
    </button>
  );
}

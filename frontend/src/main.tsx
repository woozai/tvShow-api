import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./styles/globals.css";

// Ensure theme class is set before paint (prevents flash)
(function initThemeEarly() {
  try {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const shouldDark = stored ? stored === "dark" : prefersDark;
    if (shouldDark) document.documentElement.classList.add("dark");
  } catch {
    /* empty */
  }
})();

// eslint-disable-next-line react-refresh/only-export-components
function Root() {
  // no-op; App uses CSS that responds to .dark on <html>
  useEffect(() => {}, []);
  return <App />;
}

// // for development
// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <Root />
//   </React.StrictMode>
// );

// for preview
ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);

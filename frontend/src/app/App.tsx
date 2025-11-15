import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { SearchPage } from "./pages/SearchPage";
import ShowPage from "./pages/ShowPage";
import { SearchHeader } from "./components/search/SearchHeader";
import { FavoritesPage } from "./pages/FavoritePage";
import { FavoritesProvider } from "../hooks/useFavorites";

export default function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <div className="min-h-screen">
          {/* Top navigation */}
          <SearchHeader />
          <main className="mx-auto max-w-6xl px-4 py-6">
            {/* App routes */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/show/:id" element={<ShowPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />{" "}
              {/* 👈 new */}
            </Routes>
          </main>
        </div>
      </FavoritesProvider>
    </BrowserRouter>
  );
}

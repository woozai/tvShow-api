import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { SearchPage } from "./pages/SearchPage";
import ShowPage from "./pages/ShowPage";
import { SearchHeader } from "./components/search/SearchHeader";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        {/* Top navigation */}
        <SearchHeader />
        <main className="mx-auto max-w-6xl px-4 py-6">
          {/* App routes */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/show/:id" element={<ShowPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

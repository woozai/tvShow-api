import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { SearchPage } from "./pages/SearchPage";
import { SearchHeader } from "./components/SearchHeader";
import ShowPage from "./pages/ShowPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="max-w-4xl mx-auto">
        {/* Top navigation */}
        <SearchHeader />

        {/* App routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/show/:id" element={<ShowPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

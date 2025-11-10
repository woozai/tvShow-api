import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { SearchPage } from "./pages/SearchPage";
import { SearchHeader } from "./components/SearchHeader";

export default function App() {
  return (
    <BrowserRouter>
      {/* Top navigation */}
      <SearchHeader />

      {/* App routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}

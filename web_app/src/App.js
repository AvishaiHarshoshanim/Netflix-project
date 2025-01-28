import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage/HomePage";
import AdminPage from "./AdminPage/Page";
import SearchPage from "./SearchPage/SearchPage";
import MoviesPage from "./MoviesPage/MoviesPage";
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/" element={<>
            <HomePage />
            <AdminPage />
          </>} />
          <Route path="/search/:query" element={<SearchPage />} />
          <Route path="/movies" element={<MoviesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import HomePage from "./HomePage/HomePage";
import AdminPage from "./AdminPage/Page";
import SearchPage from "./SearchPage/SearchPage";
import MoviesPage from "./MoviesPage/MoviesPage";
import Header from "./HomePage/components/Header";
import './App.css';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light-mode");
  

  const toggleTheme = () => {
    const newTheme = theme === "light-mode" ? "dark-mode" : "light-mode";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); 
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <Router>
      <div className={`App ${theme}`}>
      <Header toggleTheme={toggleTheme} theme={theme} />
        <Routes>
        <Route path="/" element={<><HomePage /><AdminPage /></>} />
          <Route path="/search/:query" element={<SearchPage />} />
          <Route path="/movies" element={<MoviesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

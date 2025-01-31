import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import HomePage from "./HomePage/HomePage";
import AdminPage from "./AdminPage/Page";
import SearchPage from "./SearchPage/SearchPage";
import MoviesPage from "./MoviesPage/MoviesPage";
import Header from "./HomePage/components/Header";
import MovieDetails from "./MovieInfo/Components/MovieDetailsPopup";
import MovieShow from "./MovieInfo/Components/MovieShow";
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
  
  const userId = "67976958346fafd6e5653e5b";                                 // נצטרך פה לקלוט את הת.ז. של המשתמש שנכנס למערכת

  return (
    <Router>
      <div className={`App ${theme}`}>
      <Header toggleTheme={toggleTheme} theme={theme} userId={userId} />
        <Routes>
        <Route path="/" element={<>
            <HomePage userId={userId}/>
            <AdminPage userId={userId}/>
          </>} />
          <Route path="/search/:query" element={<SearchPage userId={userId}/>} />
          <Route path="/movies" element={<MoviesPage userId={userId}/>} />
          <Route path="/movies/:movieId" element={<MovieDetails userId={userId} />}/>
          <Route path="/watch" element={<MovieShow />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

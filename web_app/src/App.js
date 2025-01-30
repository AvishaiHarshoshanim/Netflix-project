import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage/HomePage";
import AdminPage from "./AdminPage/Page";
import SearchPage from "./SearchPage/SearchPage";
import MoviesPage from "./MoviesPage/MoviesPage";
import MovieDetails from "./MovieInfo/Components/MovieDetailsPopup";
import MovieShow from "./MovieInfo/Components/MovieShow";
import './App.css';

function App() {
  const userId = "679a3db25f4cedde9d4d1742";                                 // נצטרך פה לקלוט את הת.ז. של המשתמש שנכנס למערכת

  return (
    <Router>
      <div className="App">
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

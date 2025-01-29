import React, { useState, useEffect } from "react";
import HeroSection from './components/HeroSection';
import MovieItem from "./components/MovieItem";
import './HomePage.css';


const HomePage = () => {
  const [categoriesWithMovies, setCategoriesWithMovies] = useState([]);
  const userId = "67976958346fafd6e5653e5b";                                 // נצטרך פה לקלוט את הת.ז. של המשתמש שנכנס למערכת

  useEffect(() => {
    fetch("http://localhost:5000/api/movies", {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "userId": userId // Add userId to the headers
      }
    })
      .then((response) => response.json())
      .then((data) => setCategoriesWithMovies(data))
      .catch((error) => console.error("Error fetching categories and movies:", error));
  }, []);

  return (
    <div>
      <HeroSection />
      <div className="categories-section">
        {categoriesWithMovies.map((category) => (
          <div key={category.category} className="category-block">
            <h2 className="category-title">{category.category}</h2>
            <ul className="movies-list">
              {category.movies.map((movie) => (
                <MovieItem key={movie._id} movie={movie} /> 
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;

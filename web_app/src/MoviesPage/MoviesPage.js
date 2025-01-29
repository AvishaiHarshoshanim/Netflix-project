import React, { useState, useEffect } from "react";
import Header from "../HomePage/components/Header";
import HeroSection from "../HomePage/components/HeroSection";
import MovieItem from "../HomePage/components/MovieItem";
import "../HomePage/HomePage.css";


const MoviesPage = ({userId}) => {
  const [categoriesWithMovies, setCategoriesWithMovies] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/movies/categories/withMovies", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setCategoriesWithMovies(data))
      .catch((error) =>
        console.error("Error fetching categories and movies:", error)
      );
  }, []);

  return (
    <div>
      <Header />
      <HeroSection />
      <div className="categories-section">
        {categoriesWithMovies.map((category) => (
          <div key={category.category} className="category-block">
            <h2 className="category-title">{category.category}</h2>
            <ul className="movies-list">
              {category.movies.map((movie) => (
                <MovieItem key={movie._id} movie={movie} userId={userId} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviesPage;

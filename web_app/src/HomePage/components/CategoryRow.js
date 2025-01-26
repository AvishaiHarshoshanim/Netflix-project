import React from 'react';
import './CategoryRow.css';

function CategoryRow({ categoryName, movies }) {
  return (
    <div className="category-row">    {/* div for one category (Name and list of movies) */}
      {/* div for the category name */}
      <div className="category-title">{categoryName}</div>
      
      {/*  Creating a dynamic list of all movies in the current category */}
      <div className="movies-container">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img src={movie.image} alt={movie.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryRow;

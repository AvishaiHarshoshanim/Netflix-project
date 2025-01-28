import React from "react";
import "./MovieItem.css"; // קובץ CSS נפרד לעיצוב הסרט

const MovieItem = ({ movie }) => {
  return (
    <li className="movie-item">
      <div className="movie-container">
        {/* אם לסרט אין תמונה, נשתמש בתמונת ברירת מחדל */}
        <img
          src={movie.pictureURL ? movie.pictureURL : "/images/Deductive image for film.webp"}
          alt={movie.movieName}
          className="movie-image"
        />
        <div className="movie-title-overlay">{movie.movieName}</div>
      </div>
    </li>
  );
};

export default MovieItem;

import React from "react";
import "./MovieItem.css"; 

const MovieItem = ({ movie }) => {
  return (
    <li className="movie-item">
      <div className="movie-container">
        {/*If the movie has no image we will use a default image*/}
        <img
          src={movie.imageURL ? movie.imageURL : "/images/default image for film.webp"}
          alt={movie.movieName}
          className="movie-image"
        />
        <div className="movie-title-overlay">{movie.movieName}</div>
      </div>
    </li>
  );
};

export default MovieItem;

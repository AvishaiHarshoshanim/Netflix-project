import React, { useState } from "react";
import "./MovieItem.css";
import MovieDetailsPopup from "../../MovieInfo/Components/MovieDetailsPopup";

const MovieItem = ({ movie, userId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <li className="movie-item" onClick={() => setIsModalOpen(true)}>
        <div className="movie-container">
          <img
            src={movie.imageURL || "/images/default-movie.jpg"}
            alt={movie.movieName}
            className="movie-image"
          />
          <div className="movie-title-overlay">{movie.movieName}</div>
        </div>
      </li>

      {isModalOpen && (
        <MovieDetailsPopup movieId={movie._id} userId={userId} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default MovieItem;

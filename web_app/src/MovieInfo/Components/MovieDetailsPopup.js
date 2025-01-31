import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MovieItem from "../../HomePage/components/MovieItem";
import "./MovieDetailsPopup.css";

const MovieDetailsPopup = ({ movieId, userId, onClose }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recoMovies, setRecoMovies] = useState([]);

  const navigate = useNavigate();
  
  const handlePlay = () => {
    updateRecServer();
    navigate("/watch", { state: { videoURL: movie.videoURL } });
  };

  const fetchMovieDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/movies/${movieId}`, {
        method: "GET",
        headers: { "Accept": "application/json" }
      });

      if (!response.ok) throw new Error("Failed to fetch movie details");

      const data = await response.json();
      setMovie(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecoMovies = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/movies/${movieId}/recommend`, {
        method: "GET",
        headers: { "Accept": "application/json", "userId": userId }
      });

      if (!response.ok) {
        console.log(response)
        throw new Error("Failed to fetch reco movies");
      } 

      if (response.status === 200) {
        const data = await response.json();
        setRecoMovies(data.recommendations);
      } else {
        setRecoMovies([])
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateRecServer = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/movies/${movieId}/recommend`, {
        method: "POST",
        headers: { "Accept": "application/json", "userId": userId }
      });

      if (!response.ok) {
        console.log(response)
        throw new Error("Failed to update rec server");
      } 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecoMovies();
    fetchMovieDetails();
  });

  if (loading) return <div className="custom-modal"><div className="modal-content">Loading...</div></div>;
  if (error) return <div className="custom-modal"><div className="modal-content">Error: {error}</div></div>;
  if (!movie) return null;

  return (
    <div className="custom-modal">
      <div className="modal-content">
        <button className="close-pop-button" onClick={onClose}>❌</button>
        <img src={movie.imageURL} alt={movie.movieName} className="modal-image" />
        <h2 className="modal-title">{movie.movieName}</h2>
        <p><strong>Director:</strong> {movie.director}</p>
        <p><strong>Actors:</strong> {movie.actors}</p>
        <p><strong>Categories:</strong> {movie.categories.map(c => c.name).join(", ")}</p>
        <button className="play-button" onClick={handlePlay}>
          ▶ Play
        </button>
        <ul className="movies-list">
              {recoMovies.map((movie) => (
                <MovieItem key={movie._id} movie={movie} userId={userId} /> 
              ))}
            </ul>
      </div>
    </div>
  );
};

export default MovieDetailsPopup;

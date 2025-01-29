import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./MovieShow.css";

const MovieShow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const videoURL = location.state?.videoURL; // Get video URL from navigation state

  if (!videoURL) {
    return <div className="movie-show"><p>No video found</p></div>;
  }

  return (
    <div className="movie-show">
      <button className="close-button" onClick={() => navigate(-1)}>Close</button>
      <video className="video-player" controls autoPlay>
        <source src={videoURL} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default MovieShow;

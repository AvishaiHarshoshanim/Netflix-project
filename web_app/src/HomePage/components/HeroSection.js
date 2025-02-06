import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"; 
import './HeroSection.css';

const HeroSection = ({ userId }) => {
    const videoRef = useRef(null);
    const navigate = useNavigate();
    const [isMuted, setIsMuted] = useState(true);
    const [videoURL, setVideoUrl] = useState(null);
    const [currentMovie, setCurrentMovie] = useState(null);
    const isMovieSelected = useRef(false);

    const API_PORT = process.env.REACT_APP_USER_TO_WEB_PORT;
    const API_URL = `http://localhost:${API_PORT}/api`;
    const hasFetched = useRef(false); // flag that prevents duplicate calls to the server

    useEffect(() => {
        if (!userId) return; 

        if (hasFetched.current) return; // If the reading has already been done - do not read again
        hasFetched.current = true; // Marking that the reading has been done

        console.log("🔄 Fetching movie from server...");
            
        fetch(`${API_URL}/movies`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "userId": userId 
            }
        })
        .then((res) => res.json())
        .then((data) => {
            
            const allMovies = data.flatMap(category => category.movies);
            if (allMovies.length === 0) {
                console.error("No movies available.");
                setVideoUrl(null);
                setCurrentMovie(null);
                return;
            }
    
            const randomMovie = allMovies[Math.floor(Math.random() * allMovies.length)];
    
            if (!randomMovie.videoURL) {
                console.error("Selected movie has no videoURL.");
                setVideoUrl(null);
                setCurrentMovie(null);
                return;
            }
    
            setVideoUrl(randomMovie.videoURL);
            setCurrentMovie(randomMovie);
            isMovieSelected.current = true;
        })
        .catch((error) => {
            console.error("Error fetching movies:", error);
            setVideoUrl(null);
            setCurrentMovie(null);
        });
    
    }, [userId, API_URL]); 

    const toggleMute = () => {
        if (videoRef.current) {
          videoRef.current.muted = !isMuted;
          setIsMuted(!isMuted);
        }
      };

      const playMovie = () => {
        if (currentMovie && currentMovie.videoURL) {
            console.log("🎥 Navigating to MovieShow with:", currentMovie);
            navigate("/watch", { state: { videoURL: currentMovie.videoURL, movieName: currentMovie.movieName } });
        } else {
            console.warn("❌ No movie available to play!");
        }
    };


    return (
        <div className="hero-section">
            {/* Video Background */}
            {videoURL ? (
                <video className="hero-video" autoPlay loop muted ref={videoRef}>
                    <source src={videoURL} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            ) : (
                <p>Loading video...</p>
            )}

            {currentMovie && <h2 className="hero-title">{currentMovie.movieName}</h2>}

            {/* Mute/Unmute Button */}
            <button className="mute-button" onClick={toggleMute}>
                <img
                src={isMuted ? '/images/mute-icon.png' : '/images/unmute-icon.png'}
                alt={isMuted ? 'Mute' : 'Unmute'}
            />
            </button>
            <div className="hero-buttons">
                <button className="btn btn-primary" onClick={playMovie} disabled={!currentMovie}>
                    {currentMovie ? "Play Now" : "Loading..."}
                </button>
            </div>
        </div>
    );
};

export default HeroSection;
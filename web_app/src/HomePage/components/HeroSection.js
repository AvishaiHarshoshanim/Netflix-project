import React, { useRef, useState, useEffect } from 'react';
import './HeroSection.css';

const HeroSection = ({ userId }) => {
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);
    const [videoURL, setVideoUrl] = useState(null);

    const API_PORT = process.env.REACT_APP_USER_TO_WEB_PORT;
    const API_URL = `http://localhost:${API_PORT}/api`;

    useEffect(() => {
        if (!userId) return; 
            
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
                return;
            }
    
            const randomMovie = allMovies[Math.floor(Math.random() * allMovies.length)];
    
            if (!randomMovie.videoURL) {
                console.error("Selected movie has no videoURL.");
                setVideoUrl(null);
                return;
            }
    
            setVideoUrl(randomMovie.videoURL);
        })
        .catch((error) => {
            console.error("Error fetching movies:", error);
            setVideoUrl(null);
        });
    
    }, [userId, API_URL]); 

    const toggleMute = () => {
        if (videoRef.current) {
          videoRef.current.muted = !isMuted;
          setIsMuted(!isMuted);
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

            {/* Overlay Content */}
            <div className="hero-content"></div>

            {/* Mute/Unmute Button */}
            <button className="mute-button" onClick={toggleMute}>
                <img
                src={isMuted ? '/images/mute-icon.png' : '/images/unmute-icon.png'}
                alt={isMuted ? 'Mute' : 'Unmute'}
            />
            </button>
            {/* <div className="hero-buttons">
                <button className="btn btn-primary">play now</button>
            </div> */}
        </div>
    );
};

export default HeroSection;
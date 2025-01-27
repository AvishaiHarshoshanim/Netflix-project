import React, { useRef, useState } from 'react';
import './HeroSection.css';

const HeroSection = () => {

    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);

    const toggleMute = () => {
        if (videoRef.current) {
          videoRef.current.muted = !isMuted;
          setIsMuted(!isMuted);
        }
      };


    return (
        <div className="hero-section">
            {/* Video Background */}
            <video className="hero-video" autoPlay loop muted ref={videoRef}>
            <source src="/videos/video_720.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Overlay Content */}
            <div className="hero-content">
                
            </div>
            {/* Mute/Unmute Button */}
            <button className="mute-button" onClick={toggleMute}>
                <img
                src={isMuted ? '/images/mute-icon.png' : '/images/unmute-icon.png'}
                alt={isMuted ? 'Mute' : 'Unmute'}
            />
            </button>
            <div className="hero-buttons">
                <button className="btn btn-primary">play now</button>
            </div>
        </div>
    );
};

export default HeroSection;

import React, { useState } from 'react';
import './HomePage.css';
import CategoryList from './components/CategoryList';

function HomePage() {
  const [isMuted, setIsMuted] = useState(true);  // State to track whether the video is muted (true) or unmuted (false)

  // The toggleMute function is responsible for muting or unmuting the video when someone clicks the mute button.
  const toggleMute = () => {
    const video = document.querySelector('.background-video');  // Finding the video
    if (video) {
      video.muted = !video.muted;  // Reverses the muted value
      setIsMuted(video.muted);  // Update the state
    }
  };

  const mockCategories = [
    {
      categoryName: "Action",
      movies: [
        { id: 1, name: "movie 1", image: "/images/movie1.jpeg" },
        { id: 2, name: "movie 2", image: "/images/movie2.jpg" },
      ],
    },
    {
      categoryName: "Drama",
      movies: [
        { id: 3, name: "movie 3", image: "/images/movie3.jpg" },
        { id: 4, name: "movie 4", image: "/images/movie4.webp" },
      ],
    },
  ];

  return (
    <div className="HomePage">  {/* Everything inside this 'div' will get the HomePage.css styling */}
      <div className="video-section">  {/* div for the background video */}
        <video className="background-video" autoPlay loop muted={isMuted}>
          <source src="/videos/video_720.mp4" type="video/mp4" />
          Your browser does not support the video tag.  {/* Fallback text that appears in case the user's browser does not support the <video> element. */}
        </video>  
        <button className="play-button">start movie</button>
        <button className="mute-button" onClick={toggleMute}>
          <img   
            src={isMuted ? "/images/mute-icon.png" : "/images/unmute-icon.png"}
            alt={isMuted ? "Muted" : "Unmuted"}
            className="mute-icon"
          />   {/* Audio icon */}
        </button>
      </div>  {/* close div for the background video */}
      <CategoryList categories={mockCategories} />
    </div>  
  );
}

export default HomePage;

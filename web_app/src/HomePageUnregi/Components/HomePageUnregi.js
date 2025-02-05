import React from "react";
import GetStartedButton from "./GetStartedButton";
import Header from "./Header" 
import "./HomePageUnregi.css"; 

function HomePageUnregi() {
  return (
    <div className="home-page home-page-background">
      <Header /> 
      <div className="content">
        <h1>Unlimited movies, TV shows, and more</h1>
        <h3>Starts at ₪32.90. Cancel anytime.</h3>
        <p>Ready to watch? Click below to get started.</p>
        <div className="input-section">
          <GetStartedButton /> 
        </div>
      </div>
    </div>
  );
}

export default HomePageUnregi;
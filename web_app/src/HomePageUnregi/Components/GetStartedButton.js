import React from "react";
import { Link } from "react-router-dom";
import "./GetStartedButton.css";
//link to signup design as a button
function GetStartedButton() {
  return (
    <Link to="/signup" className="get-started-button">
      Get Started &gt;
    </Link>
  );
}

export default GetStartedButton;
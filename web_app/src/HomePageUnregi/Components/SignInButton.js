import React from "react";
import { Link } from "react-router-dom";
import "./SignInButton.css";
//link to signin design as a button
function SignInButton() {
  return (
    <Link to="/signin" className="sign-in-button">
      Sign In
    </Link>
  );
}

export default SignInButton;
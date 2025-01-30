import React from "react";
import SignInButton from "./SignInButton";
import "./Header.css";
//an header that contain a logo and a sign in button
function Header() {
  return (
    <div className="header">
        <div className="logo"></div>
        <SignInButton />
      </div>
  );
}

export default Header;
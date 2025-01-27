import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="header-links">
        <span className="header-link" onClick={() => alert("Going Home!")}>
          HOME
        </span>
        <span className="header-link" onClick={() => alert("Searching...")}>
          SEARCH
        </span>
      </div>
      <button className="logout-btn" onClick={() => alert("Logged out!")}>
        LOGOUT
      </button>
    </div>
  );
};

export default Header;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // פונקציה לפתיחה/סגירה של החיפוש
  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  return (
    <div className="header">
      <div className="header-links">
        <span className="header-link" onClick={() => navigate("/")}>
          HOME
        </span>
        <span className="header-link" onClick={toggleSearch}>
          SEARCH
        </span>
      </div>
      <button className="logout-btn" onClick={() => alert("Logged out!")}>
        LOGOUT
      </button>
      {/* חלונית החיפוש */}
      {isSearchOpen && (
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for movies..."
            className="search-input"
          />
        </div>
      )}
    </div>
  );
};

export default Header;

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  // פונקציה לפתיחה/סגירה של החיפוש
  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  // אפקט שמפעיל מיקוד בשדה החיפוש כשהחלונית נפתחת
  React.useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus(); // מפעיל מיקוד אוטומטי
    }
  }, [isSearchOpen]);

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
            ref={searchInputRef} // מחבר את השדה ל-useRef
          />
        </div>
      )}
    </div>
  );
};

export default Header;

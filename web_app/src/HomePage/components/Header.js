import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ toggleTheme, theme }) => {

  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  React.useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus(); 
    }
  }, [isSearchOpen]);

  const handleSearch = (event) => {
    if (event.key === "Enter" && searchQuery.trim() !== "") {
      navigate(`/search/${searchQuery.trim()}`); 
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0); // Scroll straight to the top of the page
  };

  return (
    <div className="header">
      <div className="header-links">
        <span className="header-link" onClick={() => handleNavigation("/")}>HOME</span>
        <span className="header-link" onClick={() => handleNavigation("/movies")}>MOVIES</span>
        <span className="header-link" onClick={toggleSearch}>SEARCH</span>
        {/*the search-box*/}
        {isSearchOpen && (
          <div className="search-box">
            <input
              type="text"
              placeholder="Search for movies..."
              className="search-input"
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        )}
      </div>


<button className="theme-toggle-btn" onClick={toggleTheme}>
  {theme === "light-mode" ? "🌙 Dark Mode" : "☀️ Light Mode"}
</button>

<button className="logout-btn" onClick={() => alert("Logged out!")}>
  LOGOUT
</button>
</div>
);
};

export default Header;

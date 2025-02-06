import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ toggleTheme, theme, user, logout }) => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userDet, setUserDet] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);


  const searchInputRef = useRef(null);
  const API_PORT = process.env.REACT_APP_USER_TO_WEB_PORT;
  const API_URL = `http://localhost:${API_PORT}/api`;


  const isAdmin = user?.role === "admin";


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/users/${user.userId}`, {
          method: "GET",
          headers: { "Accept": "application/json" }
        });

        if (!response.ok) throw new Error("Failed to fetch user details");

        const data = await response.json();
      
        setUserDet(data);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    if (user?.userId) {
      fetchUserData();
    }
  }, [API_URL, user?.userId]);

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  useEffect(() => {
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
    window.scrollTo(0, 0);
  };

  return (
    <>

    <div className="header">
      <div className="logo" src="./NETBLIX.png"> </div>

      {userDet && (
        <div className="user-info">
          <img
            src={userDet?.picture ? `http://localhost:${API_PORT}${userDet.picture}` : "/images/default-profile.webp"}
            alt="Profile"
            className="profile-picture"
            onClick={() => setIsProfileOpen(true)} 
          />

          <span className="user-name"> {userDet?.name || "Guest"}</span>
        </div>
      )}

      <div className="header-links">
        <span className="header-link" onClick={() => handleNavigation("/home")}>HOME</span>
        <span className="header-link" onClick={() => handleNavigation("/movies")}>MOVIES</span>
        <span className="header-link" onClick={toggleSearch}>SEARCH</span>

        {/* the search-box */}
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

        {isAdmin && (
          <span className="header-link admin-link" onClick={() => handleNavigation("/admin")}>ADMIN PAGE</span>
        )}
      </div>

      <button className="theme-toggle-btn" onClick={toggleTheme}>
        {theme === "light-mode" ? "🌙 Dark Mode" : "☀ Light Mode"}
      </button>

      <button className="logout-btn" onClick={logout}>LOGOUT</button>

    </div>

    {/* Pop-up window for user details */}
    {isProfileOpen && (
      <div className="profile-modal">
        <div className="profile-content">
          <h2>User Details</h2>
          <p><strong>Username:</strong> {userDet?.userName}</p>
          <p><strong>Name:</strong> {userDet?.name}</p>
          <p><strong>Role:</strong> {userDet?.role}</p>
          <button onClick={() => setIsProfileOpen(false)}>Close</button>
        </div>
      </div>
    )}
    </>
  );
};

export default Header;
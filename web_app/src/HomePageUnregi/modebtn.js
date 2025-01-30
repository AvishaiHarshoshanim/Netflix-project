import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

const modeDropdown = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeToggle = () => {
    setIsDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode", !isDarkMode);
  };

  return (
    <div className="btn-group">
      <button
        type="button"
        className="btn btn-danger dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {isDarkMode ? (
          <i className="bi bi-moon-fill"></i>
        ) : (
          <i className="bi bi-sun-fill"></i>
        )}
      </button>
      <ul className="dropdown-menu">
        <li className="dropdown-item" onClick={handleThemeToggle}>
          {isDarkMode ? (
            <>
              <i className="bi bi-sun-fill"></i> Light Mode
            </>
          ) : (
            <>
              <i className="bi bi-moon-fill"></i> Dark Mode
            </>
          )}
        </li>
      </ul>
    </div>
  );
};

export default ThemeToggleDropdown;
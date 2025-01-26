import React from 'react';
import './Header.css';

function Header({ toggleTheme, isDarkMode }) {
    return (
        <header className="header">
            <div className="header__logo">
                <img src="/images/Netflix_Logo.avif" alt="Netflix Logo" />
            </div>
            <div className="header__nav">
                <a href="/">Home</a>
                <a href="/search">Search</a>
                <button className="header__theme-toggle" onClick={toggleTheme}>
                {isDarkMode ? 'Light Mode' : 'Dark Mode'} {/* represent mode */}
                </button>
            </div>
            <div className="header__buttons">
                <button className="header__logout">Logout</button>
                <button className="header__management">Management Screen</button>
            </div>
        </header>
    );
}

export default Header;

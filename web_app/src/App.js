import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom"; // Router should wrap the entire app
import { jwtDecode } from "jwt-decode";
import AppRoutes from "./AppRoutes";
import "./App.css";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light-mode");
  const [jwt, setJwt] = useState(localStorage.getItem("jwt") || null);
  const [user, setUser] = useState(null);

  // Toggle dark/light theme
  const toggleTheme = () => {
    const newTheme = theme === "light-mode" ? "dark-mode" : "light-mode";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    const storedJwt = localStorage.getItem("jwt");
    if (storedJwt) {
      setJwt(storedJwt);
    }
  }, []);

  useEffect(() => {
    if (jwt) {
      try {
        const decoded = jwtDecode(jwt);
        setUser({ userId: decoded.userId, role: decoded.role });
      } catch (error) {
        console.error("Invalid JWT:", error);
      }
    }
  }, [jwt]);

  return (
    <Router>
      <div className={`App ${theme}`}>
        <AppRoutes
          jwt={jwt}
          setJwt={setJwt}
          user={user}
          setUser={setUser}
          toggleTheme={toggleTheme}
          theme={theme}
        />
      </div>
    </Router>
  );
}

export default App;

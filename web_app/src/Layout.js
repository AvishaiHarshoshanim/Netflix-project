import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./HomePage/components/Header";

const Layout = ({ toggleTheme, theme, user, setJwt, setUser }) => {
  const navigate = useNavigate();

  const logout = () => {
    setJwt(null);
    setUser(null);
    localStorage.removeItem("jwt");
    setTimeout(() => {navigate("/signin");}, 100);
    // Delay to ensure state updates
  };
  
  return (
    <>
      <Header toggleTheme={toggleTheme} theme={theme} user={user} logout={logout} />
      <Outlet />
    </>
  );
};

export default Layout;

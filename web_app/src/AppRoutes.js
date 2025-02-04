import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePageUnregi from "./HomePageUnregi/Components/HomePageUnregi";
import SignIn from "./SignIn/SignIn";
import SignUp from "./SignUp/SignUp";
import HomePage from "./HomePage/HomePage";
import AdminPage from "./AdminPage/Page";
import SearchPage from "./SearchPage/SearchPage";
import MoviesPage from "./MoviesPage/MoviesPage";
import MovieDetails from "./MovieInfo/Components/MovieDetailsPopup";
import MovieShow from "./MovieInfo/Components/MovieShow";
import Layout from "./Layout";

function AppRoutes({ jwt, setJwt, user, setUser, toggleTheme, theme }) {
  return (
    <Routes>
      {/* Public Routes (No Header) */}
      <Route path="/" element={<HomePageUnregi />} />
      <Route path="/signIn" element={<SignIn setJwt={setJwt} setUser={setUser} />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Protected Routes (With Header) */}
      <Route
        element={<Layout toggleTheme={toggleTheme} theme={theme} user={user} setJwt={setJwt} setUser={setUser} />}
      >
        <Route path="/home" element={jwt && user ? <HomePage userId={user?.userId} /> : <Navigate to="/signin" />} />
        <Route path="/search/:query" element={jwt ? <SearchPage userId={user?.userId} /> : <Navigate to="/signin" />} />
        <Route path="/movies" element={jwt ? <MoviesPage userId={user?.userId} /> : <Navigate to="/signin" />} />
        <Route path="/movies/:movieId" element={jwt ? <MovieDetails userId={user?.userId} /> : <Navigate to="/signin" />} />
        <Route path="/watch" element={jwt ? <MovieShow /> : <Navigate to="/signin" />} />
        <Route path="/admin" element={jwt && user?.role === "admin" ? <AdminPage userId={user?.userId} /> : <Navigate to="/" />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;

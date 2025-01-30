import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // ✅ Fixes undefined errors
import HomePageUnregi from "./HomePageUnregi/Components/HomePageUnregi";
import SignIn from "./SignIn/SignIn";
import SignUp from "./SignUp/SignUp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePageUnregi />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
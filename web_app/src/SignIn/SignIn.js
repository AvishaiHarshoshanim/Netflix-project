import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import axios from "axios";
function SignIn() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    userName: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents page reload
    const response = axios.post("http://localhost:5000/api/Tokens", {
      username,
      password,
    });

    const { token } = response.data;

    // Save token to localStorage
    localStorage.setItem("jwtToken", token);

    setMessage("Login successful! Token saved to localStorage.");
    setError("");
  }; 

  return (
    <div className="home-page-background">
      <div className="block">
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-5">
            <p>Sign In</p>
            <input
              type="userName"
              name="userName" // Added
              className="form-control input"
              id="exampleInputUserName1"
              placeholder="Enter user name"
              onChange={handleChange}
            />
          </div>
          <div className="form-group mb-4">
            <input
              type="password"
              name="password" // Added
              className="form-control input"
              id="exampleInputPassword1"
              placeholder="Password"
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-danger mt-3">
            Sign In
          </button>
          <p>OR</p>
          <button
            type="button"
            className="btn btn-danger mt-3"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;

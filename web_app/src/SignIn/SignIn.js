import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignIn.css";

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

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents page reload

    try {
      // Send login request with correct values
      const response = await axios.post("http://localhost:5000/api/Tokens", {
        userName: inputs.userName, 
        password: inputs.password,
      });

      // Get token from response
      const { token } = response.data;

      // Save token to localStorage
      localStorage.setItem("jwtToken", token);

      alert("Login successful! Token saved.");
      navigate("/"); // Redirect to home page after login
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Invalid username or password");
    }
  };

  return (
    <div className="home-page-background">
      <div className="block">
      <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-5">
            <input
              type="text"
              name="userName"
              className="form-control input"
              placeholder="Enter user name"
              value={inputs.userName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-4">
            <input
              type="password"
              name="password"
              className="form-control input"
              placeholder="Password"
              value={inputs.password}
              onChange={handleChange}
              required
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
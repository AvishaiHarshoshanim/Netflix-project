import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "./SignIn.css";

function SignIn({ setJwt, setUser }) {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    userName: "",
    password: "",
  });

  const API_PORT = process.env.REACT_APP_USER_TO_WEB_PORT;
  const API_URL = `http://localhost:${API_PORT}/api`;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents page reload

    try {
      // Send login request with correct values
      const response = await axios.post(`${API_URL}/Tokens`, {
        userName: inputs.userName, 
        password: inputs.password,
      });

      // Get token from response
      const { token } = response.data;

      localStorage.setItem("jwtToken", token);
      setJwt(token);
      try {
        const decoded = jwtDecode(token);
        setUser({ userId: decoded.userId, role: decoded.role });        
      } catch (error) {
        console.error("Invalid JWT:", error);
      }
      navigate("/home"); // Redirect to home page after login
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Invalid username or password");
    }
  };

  return (
    <div className="home-page-background">
      <div className="block-in">
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
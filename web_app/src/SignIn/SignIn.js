import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";

function SignIn() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents page reload
    console.log(inputs);    // Logs form inputs
  };

  return (
    <div className="home-page-background">
      <div className="block">
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-5">
            <p>Sign In</p>
            <input
              type="email"
              name="email" // Added
              className="form-control input"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter email"
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

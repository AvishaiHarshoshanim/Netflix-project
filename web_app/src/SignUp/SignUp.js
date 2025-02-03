import React, { useState } from "react";
import Password from "./Component/Password";
import ProfilePic from "./Component/ProfilePic";
import axios from "axios";
import "./SignUp.css";

function SignUp() {
  const [inputs, setInputs] = useState({
    userName: "",
    name: "",
    password: "",
    confirmPassword: "",
    picture: null, // Updated field name
  });

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (passwordError || confirmPasswordError) {
      alert("Please fix validation errors before submitting.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("userName", inputs.userName);
    formDataToSend.append("name", inputs.name);
    formDataToSend.append("password", inputs.password);

    if (inputs.picture) {
      formDataToSend.append("picture", inputs.picture); // Updated field name
    }

    try {
      const response = await axios.post("http://localhost:5000/api/users", formDataToSend);
      console.log("User created successfully:", response.data);
      alert("User created successfully!");
    } catch (err) {
      if (err.response) {
        console.error("Error creating user:", err.response.data);
        alert(err.response.data.errors ? err.response.data.errors.join(", ") : "Failed to create user");
      } else {
        console.error("Network error:", err);
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="home-page-background">
      <div className="block">
        <form onSubmit={handleSubmit}>
          <h2>Sign Up</h2>

          {/* Username Input */}
          <div className="form-group mb-5">
            <input
              type="text"
              id="userName"
              className="form-control"
              placeholder="Enter username"
              name="userName"
              value={inputs.userName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Name Input */}
          <div className="form-group mb-5">
            <input
              type="text"
              id="name"
              className="form-control"
              placeholder="Enter name"
              name="name"
              value={inputs.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Component */}
          <Password
            password={inputs.password}
            setPassword={(value) => setInputs((prev) => ({ ...prev, password: value }))}
            confirmPassword={inputs.confirmPassword}
            setConfirmPassword={(value) => setInputs((prev) => ({ ...prev, confirmPassword: value }))}
            passwordError={passwordError}
            setPasswordError={setPasswordError}
            confirmPasswordError={confirmPasswordError}
            setConfirmPasswordError={setConfirmPasswordError}
          />

          {/* Profile Picture Component */}
          <ProfilePic
            profilePicture={inputs.picture} // Updated prop
            setProfilePicture={(file) => setInputs((prev) => ({ ...prev, picture: file }))} // Updated prop
          />

          {/* Submit Button */}
          <button type="submit" className="btn btn-danger mt-3">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;

import React, { useState } from "react";
import "./SignUp.css";

function SignUp() {
  const [inputs, setInputs] = useState({
    password: "",
    confirmPassword: "",
  });

  const [validation, setValidation] = useState({
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasMinLength: false,
    confirmPasswordValid: null,
  });

  const [showValidationBox, setShowValidationBox] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));

    if (name === "password") {
      setValidation((prevValidation) => ({
        ...prevValidation,
        hasLowercase: /[a-z]/.test(value),
        hasUppercase: /[A-Z]/.test(value),
        hasNumber: /[0-9]/.test(value),
        hasMinLength: value.length >= 8,
      }));

      // Revalidate confirm password if already filled
      if (inputs.confirmPassword) {
        setValidation((prevValidation) => ({
          ...prevValidation,
          confirmPasswordValid: inputs.confirmPassword === value,
        }));
      }
    }

    if (name === "confirmPassword") {
      setValidation((prevValidation) => ({
        ...prevValidation,
        confirmPasswordValid: value === inputs.password,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !validation.hasLowercase ||
      !validation.hasUppercase ||
      !validation.hasNumber ||
      !validation.hasMinLength ||
      !validation.confirmPasswordValid
    ) {
      alert("Please fix validation errors before submitting.");
      return;
    }

    alert("Form submitted successfully!");
  };

  // Check if password is fully valid
  const isPasswordValid =
    validation.hasLowercase &&
    validation.hasUppercase &&
    validation.hasNumber &&
    validation.hasMinLength;

  return (
    <div className="home-page-background">
      <div className="block">
        <form onSubmit={handleSubmit}>
          {/* Password */}
          <div className="form-group mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className={`form-control ${isPasswordValid ? "is-valid" : "is-invalid"}`}
              placeholder="Enter your password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
              onFocus={() => setShowValidationBox(true)}
              onBlur={() => setShowValidationBox(false)}
              required
            />
          </div>

          {/* Show validation box only when password field is focused and invalid */}
          {showValidationBox && !isPasswordValid && (
            <div id="password-message" className="password-validation-box">
              <p>Password must contain: a lowercase letter, an uppercase letter,a number, minimum 8 characters</p>
            </div>
          )}

          {/* Confirm Password */}
          <div className="form-group mb-3">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className={`form-control ${
                validation.confirmPasswordValid === null
                  ? ""
                  : validation.confirmPasswordValid
                  ? "is-valid"
                  : "is-invalid"
              }`}
              placeholder="Confirm Password"
              name="confirmPassword"
              value={inputs.confirmPassword}
              onChange={handleChange}
              required
            />
            {validation.confirmPasswordValid === false && (
              <div className="invalid-feedback">Passwords do not match.</div>
            )}
          </div>

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
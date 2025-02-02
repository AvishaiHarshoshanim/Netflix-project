import React from "react";

function Password({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  passwordError,
  setPasswordError,
  confirmPasswordError,
  setConfirmPasswordError,
}) {
  // Validate Password
  const validatePassword = (value) => {
    setPassword(value);

    if (!value) {
      setPasswordError(""); // Clear error if empty
      return;
    }

    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasMinLength = value.length >= 8;

    if (hasUppercase && hasLowercase && hasNumber && hasMinLength) {
      setPasswordError(""); // No error
    } else {
      setPasswordError(
        "Password must contain: a lowercase letter, an uppercase letter, a number, and be at least 8 characters."
      );
    }
  };

  // Validate Confirm Password
  const validateConfirmPassword = (value) => {
    setConfirmPassword(value);

    if (!value) {
      setConfirmPasswordError(""); // Clear error if empty
      return;
    }

    if (value !== password) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError(""); // No error
    }
  };

  // Determine input classes
  const passwordInputClass = passwordError === "" ? "is-valid" : passwordError ? "is-invalid" : "";
  const confirmPasswordInputClass = confirmPasswordError === "" ? "is-valid" : confirmPasswordError ? "is-invalid" : "";

  return (
    <div>
      {/* Password Input */}
      <div className="form-group mb-3">
        <input
          type="password"
          id="password"
          className={`form-control ${passwordInputClass}`}
          placeholder="Enter password"
          value={password}
          onChange={(event) => validatePassword(event.target.value)}
          required
        />
        {passwordError && (
          <div className="invalid-feedback">{passwordError}</div>
        )}
      </div>

      {/* Confirm Password Input */}
      <div className="form-group mb-3">
        <input
          type="password"
          id="confirmPassword"
          className={`form-control ${confirmPasswordInputClass}`}
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(event) => validateConfirmPassword(event.target.value)}
          required
        />
        {confirmPasswordError && (
          <div className="invalid-feedback">{confirmPasswordError}</div>
        )}
      </div>
    </div>
  );
}

export default Password;
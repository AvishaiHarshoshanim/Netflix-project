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
    //if there is no password than we will see no error
    if (!value) {
      setPasswordError(""); 
      setConfirmPasswordError(""); 
      return;
    }

    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasMinLength = value.length >= 8;
    //if the password meets all the cratirea than no error else error
    if (hasUppercase && hasLowercase && hasNumber && hasMinLength) {
      setPasswordError(""); 
    } else {
      setPasswordError(
        "Password must contain: a lowercase letter, an uppercase letter, a number, and be at least 8 characters."
      );
    }

    // Validate confirm password with the updated password
    if (confirmPassword) {
      validateConfirmPassword(confirmPassword, value);
    }
  };

  // Validate Confirm Password
  const validateConfirmPassword = (value, password) => {
    setConfirmPassword(value);

    if (!value) {
      setConfirmPasswordError(""); 
      return;
    }

    if (password === "") {
      setConfirmPasswordError(""); 
      return;
    }

    if (value !== password) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError(""); 
    }
  };

  const passwordInputClass = password
    ? (passwordError === "" ? "is-valid" : "is-invalid")
    : "";

  const confirmPasswordInputClass =
    confirmPassword && password 
      ? confirmPasswordError === ""
        ? "is-valid"
        : "is-invalid"
      : "";

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
          onChange={(event) =>
            validateConfirmPassword(event.target.value, password)
          }
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

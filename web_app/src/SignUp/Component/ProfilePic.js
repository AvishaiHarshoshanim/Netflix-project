import React, { useState } from "react";

function ProfilePic({ profilePicture, setProfilePicture }) {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setProfilePicture(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="form-group mb-5">
      <label htmlFor="profilePicture" className="input-file-label">
        Profile Picture
      </label>
      <input
        type="file"
        id="profilePicture"
        className="form-control input"
        onChange={handleFileChange}
        accept="image/*"
      />
      {preview && (
        <div className="image-preview mt-3">
          <img src={preview} alt="Profile Preview" style={{ width: "100px", height: "100px", borderRadius: "50%" }} />
        </div>
      )}
    </div>
  );
}

export default ProfilePic;
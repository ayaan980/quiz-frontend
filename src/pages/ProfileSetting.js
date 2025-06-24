// src/pages/ProfileSettings.jsx
import React, { useState } from "react";
import "./ProfileSettings.css";

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    nickName: "",
    gender: "",
    country: "",
    language: "",
    timezone: "",
    email: localStorage.getItem("email") || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    alert("Save functionality will be implemented!");
  };

  return (
    <div className="profile-settings-page">
      <div className="profile-card">
        <div className="profile-header">
          <div>
            <h2>Welcome, {profile.fullName || "User"} 👋</h2>
            <p>{profile.email}</p>
          </div>
          <button className="edit-btn" onClick={handleEdit}>
            Edit
          </button>
        </div>

        <div className="profile-grid">
          <input
            name="fullName"
            placeholder="Full Name"
            value={profile.fullName}
            onChange={handleChange}
          />
          <input
            name="nickName"
            placeholder="Nick Name"
            value={profile.nickName}
            onChange={handleChange}
          />
          <input
            name="gender"
            placeholder="Gender"
            value={profile.gender}
            onChange={handleChange}
          />
          <input
            name="country"
            placeholder="Country"
            value={profile.country}
            onChange={handleChange}
          />
          <input
            name="language"
            placeholder="Language"
            value={profile.language}
            onChange={handleChange}
          />
          <input
            name="timezone"
            placeholder="Time Zone"
            value={profile.timezone}
            onChange={handleChange}
          />
        </div>

        <div className="email-section">
          <p>📧 <strong>{profile.email}</strong></p>
          <p style={{ fontSize: "12px", opacity: 0.6 }}>Added 1 month ago</p>
        </div>

        <button className="add-email">+ Add Email Address</button>
      </div>
    </div>
  );
};

export default ProfileSettings;
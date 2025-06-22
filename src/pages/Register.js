// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Register.css"; // Custom styling

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8081/api/auth/register", {
        name,
        email,
        password,
      });

      setSuccess(true);
      setError("");

      // Optional: auto-redirect after 2 seconds
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("Registration error:", err.response || err.message || err);
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Registration failed. Try again."
      );
      setSuccess(false);
    }
  };

  return (
    <div className="register-page">
      <div className="overlay"></div>
      <form onSubmit={handleRegister} className="register-card">
        <h2 id="signUp">Sign Up</h2>

        {success && <p className="success-message">Account created! <Link to="/">Sign in now</Link></p>}
        {error && <p className="error-message">{error}</p>}

        <input
  id="nameInput"
  type="text"
  placeholder="Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  required
/>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>

        <div className="footer">
          Already have an account? <Link to="/">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
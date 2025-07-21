import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Make sure this contains spinner CSS

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("https://quizapp-ujzy.onrender.com/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", res.data.email);

      setTimeout(() => {
        navigate("/quiz");
      }, 500); // Slight delay for smooth transition
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="error-msg">{error}</div>}

        <button
          type="submit"
          className={`login-button ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? <span className="spinner"></span> : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
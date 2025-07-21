import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [buffer, setBuffer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setBuffer(true);
    try {
      const res = await axios.post("https://quizapp-ujzy.onrender.com/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", res.data.email);

      // Delay transition to quiz page for effect
      setTimeout(() => {
        navigate("/quiz");
      }, 2500); // 2.5s delay
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Invalid credentials. Please try again."
      );
      setBuffer(false);
    }
  };

  if (buffer) {
    return (
      <div className="buffer-page">
        <div className="loader"></div>
        <p className="buffer-text">Setting things up for you ❤️</p>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="overlay"></div>
      <form onSubmit={handleLogin} className="login-card">
        <h2 id="login">Login</h2>

        {error && <p className="error-message">{error}</p>}

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

        <div className="options-row">
          <label className="remember-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
          <a href="/forgot-password" className="forgot-link">Forgot Password?</a>
        </div>

        <button type="submit" className="login-button">Login</button>

        <div className="footer">
          Don’t have an account?{" "}
          <span className="link" onClick={() => navigate("/register")}>
            Register
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
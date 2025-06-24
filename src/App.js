import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import QuizPage from "./pages/QuizPage";
import ProfileSettings from "./pages/ProfileSetting";
import DashboardPage from "./pages/DashboardPage"; // ✅ Make sure this file is DashboardPage.jsx

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/register") {
      navigate("/");
    }
  }, [location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/profile" element={<ProfileSettings />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
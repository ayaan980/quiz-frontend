import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import QuizPage from "./pages/QuizPage";
import ProfileSettings from "./pages/ProfileSetting";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./pages/PrivateRoute"; // ✅ Import PrivateRoute

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

      {/* ✅ Protected Routes */}
      <Route
        path="/quiz"
        element={
          <PrivateRoute>
            <QuizPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfileSettings />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
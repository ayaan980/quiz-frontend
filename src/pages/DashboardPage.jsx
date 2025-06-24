// src/pages/DashboardPage.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CSVLink } from "react-csv";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./Dashboard.css";

const DashboardPage = () => {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    axios
      .get("http://localhost:8081/api/results/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const parsedResults = res.data.map((item) => ({
          ...item,
          takenAtDate: item.takenAt ? new Date(item.takenAt) : null,
        }));

        setResults(parsedResults);
      })
      .catch((err) => console.error("Error fetching results:", err));
  }, [navigate]);

  const csvData = results.map((r) => ({
    Topic: r.topic,
    Score: r.score,
    "Total Questions": r.totalQuestions,
    "Taken At": r.takenAtDate ? r.takenAtDate.toLocaleString() : "Unknown",
  }));

  return (
    <div className="dashboard-page">
      {/* 🔹 Navbar */}
      <div className="dashboard-navbar">
        <div className="navbar-top">
          <button className="navbar-back-btn" onClick={() => navigate("/quiz")}>
            ← Back to Quiz
          </button>
        </div>
        <div className="navbar-title">
          <h1 id="headerName">Your Quiz Dashboard</h1>
        </div>
      </div>

      {/* 🔹 Quiz Attempts Table */}
      <div className="glass-section result-list">
        <h2>📝 Quiz Attempts</h2>

        {results.length > 0 && (
          <div className="csv-download-wrapper">
            <CSVLink
              data={csvData}
              filename="quiz_results.csv"
              className="download-csv-btn"
            >
              ⬇️ Download CSV
            </CSVLink>
          </div>
        )}

        {results.length === 0 ? (
          <p>No attempts yet.</p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Topic</th>
                <th>Score</th>
                <th>Total Questions</th>
                <th>Taken At</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, idx) => (
                <tr key={idx}>
                  <td>{result.topic}</td>
                  <td>{result.score}</td>
                  <td>{result.totalQuestions}</td>
                  <td>
                    {result.takenAtDate
                      ? result.takenAtDate.toLocaleString()
                      : "Unknown"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 🔹 Graph Section */}
      {results.length > 0 && (
        <div className="glass-section chart-section">
          <h2>📈 Progress Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={results}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="takenAtDate"
                tickFormatter={(tick) =>
                  tick instanceof Date ? tick.toLocaleDateString() : ""
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(label) =>
                  label instanceof Date ? label.toLocaleString() : ""
                }
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#00e5ff"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
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
  const [latestSuggestion, setLatestSuggestion] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "takenAtDate", direction: "desc" });
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
        if (!Array.isArray(res.data)) {
          console.error("Invalid response format:", res.data);
          return;
        }

        const parsedResults = res.data.map((item) => ({
          ...item,
          takenAtDate: item.takenAt ? new Date(item.takenAt) : null,
        }));

        setResults(parsedResults);

        const latest = parsedResults
          .filter((r) => r.suggestion && r.suggestion.trim() !== "")
          .sort((a, b) => {
            const dateA = a.takenAtDate || new Date(0);
            const dateB = b.takenAtDate || new Date(0);
            return dateB - dateA;
          })[0];

        if (latest) setLatestSuggestion(latest.suggestion);
      })
      .catch((err) => console.error("Error fetching results:", err));
  }, [navigate]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedResults = [...results].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const csvData = results.map((r) => ({
    Topic: r.topic,
    Score: r.score,
    "Total Questions": r.totalQuestions,
    "Taken At": r.takenAtDate ? r.takenAtDate.toLocaleString() : "Unknown",
    Suggestion: r.suggestion || "",
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
          <div className="table-scroll-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("topic")}>Topic</th>
                  <th onClick={() => handleSort("score")}>Score</th>
                  <th onClick={() => handleSort("totalQuestions")}>Total Questions</th>
                  <th onClick={() => handleSort("takenAtDate")}>Taken At</th>
                </tr>
              </thead>
              <tbody>
                {sortedResults.map((result, idx) => (
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
          </div>
        )}
      </div>

      {/* 🔹 Suggestion Section */}
      {latestSuggestion && (
        <div className="glass-section suggestion-box">
          <h2>🧠 AI Suggestions to Improve</h2>
          <p
            className="suggestion-text"
            style={{ whiteSpace: "pre-wrap" }}
            dangerouslySetInnerHTML={{
              __html: latestSuggestion.replace(/\n/g, "<br/>"),
            }}
          />
        </div>
      )}

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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { FaUserCircle } from "react-icons/fa";

const QuizPage = () => {
  const navigate = useNavigate();

  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState("easy");
  const [experience, setExperience] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const QUESTIONS_PER_PAGE = 5;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/");
  };

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) return alert("Please enter a topic");
    setLoading(true);
    setSubmitted(false);
    setSelectedAnswers({});
    setScore(0);
    setCurrentPage(0);

    try {
      const response = await fetch(
        `https://quizapp-ujzy.onrender.com/api/quiz/generate?topic=${encodeURIComponent(
          topic
        )}&count=${count}&difficulty=${difficulty}&experience=${experience}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        setQuestions(data);
      } else {
        alert("Received invalid quiz data from server.");
        console.error(data);
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
      alert("Failed to generate quiz. Please try again later.");
    }

    setLoading(false);
  };

  const handleSelect = (qIndex, option) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmit = async () => {
    let correct = 0;
    const attemptDetails = [];

    questions.forEach((q, i) => {
      const correctAnswer = q.answer || q.correctAnswer;
      const selectedAnswer = selectedAnswers[i];
      if (selectedAnswer === correctAnswer) correct++;
      attemptDetails.push({
        question: q.question,
        correctAnswer,
        selectedAnswer: selectedAnswer || "",
      });
    });

    setScore(correct);
    setSubmitted(true);

    try {
      const response = await fetch("https://quizapp-ujzy.onrender.com/api/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          topic,
          totalQuestions: questions.length,
          score: correct,
          attemptDetails,
        }),
      });

      const data = await response.json();
      console.log("✅ Result saved successfully:", data);
    } catch (error) {
      console.error("❌ Failed to save result:", error);
      alert("Result not saved. Check console for details.");
    }
  };

  const handleTryAgain = () => {
    setTopic("");
    setQuestions([]);
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
    setCurrentPage(0);
  };

  const startIndex = currentPage * QUESTIONS_PER_PAGE;
  const currentQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).filter(
    (key) => selectedAnswers[key]
  ).length;
  const progress = totalQuestions === 0 ? 0 : (answeredCount / totalQuestions) * 100;

  return (
    <>
      <div className="background-overlay" />

      <div className="logout-container">
        <div className="profile-icon-container">
          <FaUserCircle
            size={32}
            color="#fff"
            className="profile-icon"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="profile-dropdown">
              <div onClick={() => navigate("/profile")} className="dropdown-item">
                Profile Settings
              </div>
              <div onClick={() => navigate("/dashboard")} className="dropdown-item">
                User Dashboard
              </div>
              <div onClick={handleLogout} className="dropdown-item">
                Logout
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="App">
        <h1 id="headerName">Quizify</h1>

        {!submitted && (
          <>
            <input
              type="text"
              placeholder="Enter topic (e.g. Java)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            <div className="dropdown-container">
              <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
                {[3, 5, 10, 15, 20, 25].map((n) => (
                  <option key={n} value={n}>
                    {n} Questions
                  </option>
                ))}
              </select>

              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <select
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
              >
                {[0, 1, 2, 3, 5, 10].map((y) => (
                  <option key={y} value={y}>
                    {y}+ Years Exp
                  </option>
                ))}
              </select>
            </div>

            <button onClick={handleGenerateQuiz} className="generate-btn" disabled={loading}>
              {loading ? "Generating..." : "Generate Quiz"}
            </button>

            {loading && <div className="spinner" />}
          </>
        )}

        {questions.length > 0 && !submitted && (
          <div className="quiz-section">
            <div className="progress-bar">
              <div className="progress" style={{ width: `${progress}%` }}>
                <span className="progress-text">{Math.round(progress)}%</span>
              </div>
            </div>

            {currentQuestions.map((q, idx) => {
              const actualIndex = startIndex + idx;
              // const correctAnswer = q.answer || q.correctAnswer;
              const userAnswer = selectedAnswers[actualIndex];

              return (
                <div key={actualIndex} className="question-card">
                  <h3>
                    Q{actualIndex + 1}: {q.question}
                  </h3>
                  <ul>
                    {q.options.map((option, i) => (
                      <li key={i}>
                        <label>
                          <input
                            type="radio"
                            name={`question-${actualIndex}`}
                            value={option}
                            disabled={submitted}
                            checked={userAnswer === option}
                            onChange={() => handleSelect(actualIndex, option)}
                          />
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            <div className="pagination-buttons">
              {currentPage > 0 && (
                <button onClick={() => setCurrentPage((prev) => prev - 1)}>
                  Previous
                </button>
              )}
              {startIndex + QUESTIONS_PER_PAGE < questions.length ? (
                <button onClick={() => setCurrentPage((prev) => prev + 1)}>
                  Next
                </button>
              ) : (
                <button className="submit-btn" onClick={handleSubmit}>
                  Submit Answers
                </button>
              )}
            </div>
          </div>
        )}

        {submitted && (
          <div className="result-section">
            <h2>
              🎯 Your Score: {score} / {questions.length}
            </h2>
            <button className="retry-btn" onClick={handleTryAgain}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default QuizPage;
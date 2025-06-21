import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

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

  // 🔐 Check if logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/");
  };

  // 🧠 Fetch quiz from backend
  const handleGenerateQuiz = async () => {
    if (!topic.trim()) return alert("Please enter a topic");
    setLoading(true);
    setSubmitted(false);
    setSelectedAnswers({});
    setScore(0);

    try {
      const response = await fetch(
        `http://localhost:8081/api/quiz/generate?topic=${encodeURIComponent(
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

  // 📝 Select answer
  const handleSelect = (qIndex, option) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  // ✅ Submit quiz
  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      const correctAnswer = q.answer || q.correctAnswer;
      if (selectedAnswers[i] === correctAnswer) {
        correct++;
      }
    });
    setScore(correct);
    setSubmitted(true);
  };

  // 🔁 Reset quiz
  const handleTryAgain = () => {
    setTopic("");
    setQuestions([]);
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <>
      <div className="background-overlay" />

      <div className="logout-container">
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="App">
        <h1 id="headerName">AI Quiz Generator</h1>

        {!submitted && (
          <>
            <input
              type="text"
              placeholder="Enter topic (e.g. Java)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            <div className="dropdown-container">
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
              >
                {[3, 5, 10].map((n) => (
                  <option key={n} value={n}>
                    {n} Questions
                  </option>
                ))}
              </select>

              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
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

            <button
              onClick={handleGenerateQuiz}
              className="generate-btn"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Quiz"}
            </button>

            {loading && <div className="spinner" />}
          </>
        )}

        {questions.length > 0 && (
          <div className="quiz-section">
            {questions.map((q, idx) => {
              const correctAnswer = q.answer || q.correctAnswer;
              const userAnswer = selectedAnswers[idx];

              return (
                <div key={idx} className="question-card">
                  <h3>
                    Q{idx + 1}: {q.question}
                  </h3>
                  <ul>
                    {q.options.map((option, i) => (
                      <li key={i}>
                        <label>
                          <input
                            type="radio"
                            name={`question-${idx}`}
                            value={option}
                            disabled={submitted}
                            checked={userAnswer === option}
                            onChange={() => handleSelect(idx, option)}
                          />
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>

                  {submitted && (
                    <p
                      style={{
                        color:
                          userAnswer === correctAnswer ? "green" : "red",
                      }}
                    >
                      {userAnswer === correctAnswer
                        ? "✔ Correct"
                        : `❌ Incorrect (Answer: ${correctAnswer})`}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!submitted && questions.length > 0 && (
          <button className="submit-btn" onClick={handleSubmit}>
            Submit Answers
          </button>
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
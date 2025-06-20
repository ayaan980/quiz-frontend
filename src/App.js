import React, { useState } from 'react';
import './App.css';

function App() {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) return alert('Please enter a topic');
    setLoading(true);
    setSubmitted(false);
    setSelectedAnswers({});
    setScore(0);

    try {
      const response = await fetch(`http://localhost:8081/api/quiz/generate?topic=${encodeURIComponent(topic)}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setQuestions(data);
      } else {
        alert('Received invalid quiz data from server.');
        console.error(data);
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
      alert('Failed to generate quiz. Please try again later.');
    }

    setLoading(false);
  };

  const handleSelect = (qIndex, option) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

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

  const handleTryAgain = () => {
    setTopic('');
    setQuestions([]);
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <div className="App">
      <h1>AI Quiz Generator</h1>
      <h2>🔥 This is a test change!</h2>

      {!submitted && (
        <>
          <input
            type="text"
            placeholder="Enter topic (e.g. Java)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button onClick={handleGenerateQuiz} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Quiz'}
          </button>
        </>
      )}

      {questions.length > 0 && (
        <div className="quiz-section">
          {questions.map((q, idx) => {
            const correctAnswer = q.answer || q.correctAnswer;
            const userAnswer = selectedAnswers[idx];

            return (
              <div key={idx} className="question-card">
                <h3>Q{idx + 1}: {q.question}</h3>
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
                  <p style={{ color: userAnswer === correctAnswer ? 'green' : 'red' }}>
                    {userAnswer === correctAnswer ? '✔ Correct' : `❌ Incorrect (Answer: ${correctAnswer})`}
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
          <h2>🎯 Your Score: {score} / {questions.length}</h2>
          <button onClick={handleTryAgain}>Try Again</button>
        </div>
      )}
    </div>
  );
}

export default App;
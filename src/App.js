import React, { useState } from 'react';
import './App.css';

function App() {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) return alert('Please enter a topic');
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8081/api/quiz/generate?topic=${encodeURIComponent(topic)}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setQuestions(data);
      } else {
        console.error('Unexpected response:', data);
        alert('Received invalid quiz data from server.');
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
      alert('Failed to generate quiz. Please try again later.');
    }

    setLoading(false);
  };

  return (
    <div className="App">
      <h1>AI Quiz Generator</h1>

      <input
        type="text"
        placeholder="Enter topic (e.g. Java)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <button onClick={handleGenerateQuiz} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Quiz'}
      </button>

      <div className="quiz-section">
        {Array.isArray(questions) && questions.length > 0 ? (
          questions.map((q, idx) => (
            <div key={idx} className="question-card">
              <h3>Q{idx + 1}: {q.question}</h3>
              <ul>
                {q.options && q.options.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
              <p><strong>Answer:</strong> {q.answer || q.correctAnswer}</p>
            </div>
          ))
        ) : (
          !loading && <p>No quiz questions generated yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;
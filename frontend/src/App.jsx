import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  const handleAnswer = (id, answer) => {
    setAnswers((prev) => ({ ...prev, [id]: answer }));
  };

  const submitQuiz = () => {
    fetch("http://localhost:5000/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: Object.entries(answers).map(([id, answer]) => ({ id: Number(id), answer })) }),
    })
      .then((res) => res.json())
      .then((data) => {
        setResult(data);
        setShowPopup(true);
      });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#DDA0DD", width: "100%" }}>
      <div className="container text-center p-4 border rounded shadow bg-light w-100">
        <h1 className="mb-4">Quiz Game</h1>
        {questions.length > 0 && (
          <div>
            <h4 className="mb-3">{questions[currentQuestionIndex].question}</h4>
            {questions[currentQuestionIndex].options.map((opt) => (
              <button
                key={opt}
                className={`btn btn-outline-primary d-block w-100 my-2 ${answers[questions[currentQuestionIndex].id] === opt ? "active" : ""}`}
                onClick={() => handleAnswer(questions[currentQuestionIndex].id, opt)}
              >
                {opt}
              </button>
            ))}
            <div className="d-flex justify-content-between mt-3">
              <button className="btn btn-secondary" onClick={prevQuestion} disabled={currentQuestionIndex === 0}>
                Previous
              </button>
              {currentQuestionIndex === questions.length - 1 ? (
                <button className="btn btn-success" onClick={submitQuiz}>Submit</button>
              ) : (
                <button className="btn btn-primary" onClick={nextQuestion}>Next</button>
              )}
            </div>
          </div>
        )}
      </div>
      {showPopup && (
        <div className="position-fixed top-50 start-50 translate-middle p-4 bg-white border rounded shadow text-center w-100">
          <h2 className="mb-3">Quiz Result</h2>
          <p>You scored {result?.score} out of {questions.length}</p>
          <button className="btn btn-primary" onClick={() => setShowPopup(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
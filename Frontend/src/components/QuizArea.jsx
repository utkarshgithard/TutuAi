import React, { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const QuizPage = ({ selectedChatHistory }) => {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [responses, setResponses] = useState({});
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleOptionChange = (questionIndex, selectedOption) => {
    setResponses((prev) => ({
      ...prev,
      [questionIndex]: selectedOption
    }));
  };

  const submitQuiz = () => {
    let correctCount = 0;

    quizQuestions.forEach((question, index) => {
      if (responses[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setTimerActive(false);
    setSubmitted(true);
  };
  const resetQuizPage = () => {
    setQuizQuestions([]);
    setUserAnswers({});
    setSubmitted(false);
    setScore(0);
    setShowAnalysis(false);
  };
  const generateQuiz = async () => {
    setLoading(true);
    setError("");
    setScore(null);
    setTimeLeft(60);
    setSubmitted(false);
    setShowAnalysis(false);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/quiz/generate-quiz",
        {
          chatHistory: selectedChatHistory
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );

      if (response) {
        setQuizQuestions(response.data.questions);
      } else {
        setError("Failed to generate quiz.");
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
    setTimerActive(true);
  };

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !submitted) {
      submitQuiz();
    }
  }, [timeLeft, timerActive]);

  const pieData = [
    { name: "Correct Answers", value: score || 0, color: "#4CAF50" },
    { name: "Wrong Answers", value: quizQuestions.length - (score || 0), color: "#FF5733" }
  ];

  return (
    <div className="p-2 bg-gray-100 min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Generated Quiz</h2>

      {!submitted ? (
        <>
          <button
            onClick={generateQuiz}
            className="bg-blue-500 text-white px-4 py-2 ml-5 rounded-lg"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Quiz"}
          </button>

          {quizQuestions.length > 0 && (
            <div className="mt-4 text-lg font-semibold text-red-600">
              Time Left: {timeLeft}s
            </div>
          )}

          {error && <p className="text-red-500 mt-4">{error}</p>}

          <div className="mt-6 w-full max-w-2xl h-[70%] overflow-y-auto p-4 rounded-lg">
            {quizQuestions.map((q, index) => (
              <div key={index} className="mb-6 p-4 border rounded-lg bg-white shadow">
                <h3 className="font-semibold">{q.question}</h3>
                <ul>
                  {q.options.map((option, i) => (
                    <li key={i} className="mt-2">
                      <label>
                        <input
                          type="radio"
                          value={option}
                          onChange={() => handleOptionChange(index, option)}
                          name={`q${index}`}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {quizQuestions.length > 0 && (
            <button
              onClick={submitQuiz}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Submit Quiz
            </button>
          )}
        </>
      ) : !showAnalysis ? (
        <div className="mt-8 flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-4 text-green-600">
            Your Score: {score} / {quizQuestions.length}
          </h3>
          <button
            onClick={() => setShowAnalysis(true)}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
          >
            Analyze Performance
          </button>
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-4">Quiz Analysis</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>

          <button
            onClick={() => setShowAnalysis(false)}
            className="mt-6 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Back to Score
          </button>
          <button
            onClick={resetQuizPage}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Start New Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;

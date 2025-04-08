import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { AppContext } from "../Context/AppContext";

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
  const { handleSelectChatHistory, conversations, backendURL } = useContext(AppContext);
  const [selectedTopic, setSelectedTopic] = useState("");

  const handleOptionChange = (questionIndex, selectedOption) => {
    setResponses((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };

  const submitQuiz = () => {
    let correctCount = 0;
    quizQuestions.forEach((question, index) => {
      if (responses[index] === question.correctAnswer) correctCount++;
    });
    setScore(correctCount);
    setTimerActive(false);
    setSubmitted(true);
  };

  const resetQuizPage = () => {
    setQuizQuestions([]);
    setResponses({});
    setSubmitted(false);
    setScore(null);
    setTimeLeft(60);
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
      const res = await axios.post(
        backendURL + "/api/quiz/generate-quiz",
        { chatHistory: selectedChatHistory },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (res.data.questions) {
        setQuizQuestions(res.data.questions);
      } else {
        setError("Failed to generate quiz.");
      }
    } catch (err) {
      console.error("Error fetching quiz:", err);
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
    setTimerActive(true);
  };

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !submitted) {
      submitQuiz();
    }
  }, [timeLeft, timerActive]);

  const pieData = [
    { name: "Correct Answers", value: score || 0, color: "#4CAF50" },
    { name: "Wrong Answers", value: quizQuestions.length - (score || 0), color: "#FF5733" },
  ];

  return (
    <div className="px-4 py-6 bg-gray-100 min-h-screen flex flex-col items-center">
      {/* Mobile Topic Selection */}
      <div className="mb-4 w-full md:hidden">
        <label className="font-semibold block mb-1">Select Topic:</label>
        <select
          value={selectedTopic}
          onChange={(e) => {
            setSelectedTopic(e.target.value);
            handleSelectChatHistory(e.target.value);
          }}
          className="w-full border px-3 py-2 rounded-lg"
        >
          {conversations.map((chat) => (
            <option key={chat._id} value={chat._id}>
              {chat.topicName}
            </option>
          ))}
        </select>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-center">Generated Quiz</h2>

      {!submitted && (
        <button
          onClick={generateQuiz}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full max-w-xs text-center mb-4"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Quiz"}
        </button>
      )}

      {quizQuestions.length > 0 && !submitted && (
        <div className="text-lg font-semibold text-red-600 mb-4">
          Time Left: {timeLeft}s
        </div>
      )}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="w-full max-w-2xl space-y-6 overflow-y-auto h-[60%]">
        {quizQuestions.map((q, index) => (
          <div key={index} className="p-4 border rounded-lg bg-white shadow">
            <h3 className="font-semibold">{q.question}</h3>
            <ul className="mt-2 space-y-2">
              {q.options.map((option, i) => {
                const isSelected = responses[index] === option;
                const isCorrect = option === q.correctAnswer;

                let bgColor = "";
                if (submitted) {
                  if (isSelected && isCorrect) {
                    bgColor = "bg-green-100 border-green-600 text-green-800";
                  } else if (isSelected && !isCorrect) {
                    bgColor = "bg-red-100 border-red-600 text-red-800";
                  } else if (!isSelected && isCorrect) {
                    bgColor = "bg-yellow-100 border-yellow-600 text-yellow-800";
                  }
                }

                return (
                  <li key={i}>
                    <label className={`flex items-center border px-3 py-2 rounded-lg ${bgColor}`}>
                      <input
                        type="radio"
                        value={option}
                        onChange={() => handleOptionChange(index, option)}
                        name={`q${index}`}
                        className="mr-2"
                        checked={isSelected}
                        disabled={submitted}
                      />
                      <span>{option}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {!submitted && quizQuestions.length > 0 && (
        <button
          onClick={submitQuiz}
          className="mt-6 bg-green-500 text-white px-6 py-2 rounded-lg w-full max-w-xs"
        >
          Submit Quiz
        </button>
      )}

{submitted && (
  <div className="mt-8 flex flex-col items-center w-full">
    <h3 className="text-xl font-semibold mb-4 text-green-600 text-center">
      Your Score: {score} / {quizQuestions.length}
    </h3>

    <div className="flex flex-col items-center space-y-4 w-full max-w-xs">
      {/* Analyze Button */}
      {!showAnalysis && (
        <button
          onClick={() => setShowAnalysis(true)}
          className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 w-full"
        >
          Analyze Performance
        </button>
      )}

      {/* Start New Quiz Button */}
      <button
        onClick={resetQuizPage}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 w-full"
      >
        Start New Quiz
      </button>

      {/* Pie Chart appears below buttons */}
      {showAnalysis && (
        <div className="mt-6">
          <PieChart width={280} height={280}>
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
        </div>
      )}
    </div>
  </div>
)}

    </div>
  );
};

export default QuizPage;

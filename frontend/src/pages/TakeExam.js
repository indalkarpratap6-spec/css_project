import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TakeExam.css';

export const TakeExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));

  useEffect(() => {
    fetchExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    // Mark current question as visited
    setVisitedQuestions(prev => new Set([...prev, currentQuestionIndex]));
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (exam && !submitted) {
      setTimeLeft(exam.duration * 60); // Convert to seconds
    }
  }, [exam, submitted]);

  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft === 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, submitted]);

  const fetchExam = async () => {
    try {
      const response = await axios.get(`/api/exams/${id}`);
      setExam(response.data);
      // Initialize answers object
      const initialAnswers = {};
      response.data.questions.forEach((q, index) => {
        initialAnswers[q.id] = null;
      });
      setAnswers(initialAnswers);
    } catch (err) {
      setError('Failed to load exam');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answerIndex) => {
    if (!submitted) {
      setAnswers({ ...answers, [questionId]: answerIndex });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getQuestionStatus = (questionId, index) => {
    // Check if answer exists
    if (answers[questionId] !== null && answers[questionId] !== undefined) {
      return 'solved'; // Green
    }
    // Check if visited
    if (visitedQuestions.has(index)) {
      return 'unsolved'; // Red
    }
    // Not visited
    return 'not_seen'; // Yellow
  };

  const handleJumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = () => {
    if (submitted) return;

    // Calculate score
    let correctCount = 0;
    exam.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const percentage = Math.round(
      (correctCount / exam.questions.length) * 100
    );
    setScore({ correct: correctCount, total: exam.questions.length, percentage });
    setSubmitted(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="exam-page">
        <div className="exam-container">
          <div className="loading">Loading exam...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="exam-page">
        <div className="exam-container">
          <div className="error-message">{error}</div>
          <button onClick={() => navigate('/exams')} className="btn-back">
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="exam-page">
        <div className="exam-container">
          <div className="error-message">Exam not found</div>
          <button onClick={() => navigate('/exams')} className="btn-back">
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="take-exam-page">
      <div className="exam-header-fixed">
        <div className="header-left">
          <h2>{exam.examTitle}</h2>
        </div>
        <div className="header-right">
          {!submitted && timeLeft !== null && (
            <div className={`timer ${timeLeft < 300 ? 'warning' : ''}`}>
              ⏱ {formatTime(timeLeft)}
            </div>
          )}
          {submitted && (
            <div className="score-badge">
              Score: {score.percentage}%
            </div>
          )}
        </div>
      </div>

      <div className="take-exam-container">
        {submitted ? (
          <div className="results-section">
            <div className="results-header">
              <h3>Exam Completed!</h3>
              <div className="results-score">
                <div className="score-circle">
                  <span className="score-percentage">{score.percentage}%</span>
                  <span className="score-text">Correct</span>
                </div>
                <div className="score-details">
                  <p>You answered <strong>{score.correct} out of {score.total}</strong> questions correctly</p>
                </div>
              </div>
            </div>

            <div className="review-section">
              <h4>Review Your Answers</h4>
              {exam.questions.map((q, index) => {
                const isCorrect = answers[q.id] === q.correctAnswer;
                return (
                  <div key={q.id} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="review-header">
                      <span className={`status-icon ${isCorrect ? 'correct' : 'incorrect'}`}>
                        {isCorrect ? '✓' : '✗'}
                      </span>
                      <span className="question-number">Question {index + 1}</span>
                    </div>
                    <p className="question-text">{q.question}</p>
                    <div className="answer-review">
                      <p className="your-answer">
                        Your answer: <strong>{q.options[answers[q.id]] || 'Not answered'}</strong>
                      </p>
                      {!isCorrect && (
                        <p className="correct-answer">
                          Correct answer: <strong>{q.options[q.correctAnswer]}</strong>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="results-actions">
              <button onClick={() => navigate('/exams')} className="btn-back-exams">
                Back to Exams
              </button>
            </div>
          </div>
        ) : (
          <div className="questions-section">
            {exam && exam.questions.length > 0 && (
              <>
                {/* Question Navigator */}
                <div className="question-navigator">
                  <div className="navigator-title">Question Overview</div>
                  <div className="navigator-buttons">
                    {exam.questions.map((q, index) => {
                      const status = getQuestionStatus(q.id, index);
                      const isCurrentQuestion = index === currentQuestionIndex;
                      return (
                        <button
                          key={index}
                          className={`question-nav-button nav-${status} ${isCurrentQuestion ? 'current' : ''}`}
                          onClick={() => handleJumpToQuestion(index)}
                          title={`Question ${index + 1} - ${status === 'solved' ? 'Answered' : status === 'unsolved' ? 'Not Answered' : 'Not Visited'}`}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>
                  <div className="navigator-legend">
                    <div className="legend-item">
                      <span className="legend-color solved"></span>
                      <span>Answered</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color unsolved"></span>
                      <span>Unanswered</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color not_seen"></span>
                      <span>Not Visited</span>
                    </div>
                  </div>
                </div>

                {/* Single Question Display */}
                {(() => {
                  const q = exam.questions[currentQuestionIndex];
                  return (
                    <div key={q.id} className="question-item">
                      <div className="question-header">
                        <span className="question-number">
                          Question {currentQuestionIndex + 1} of {exam.questions.length}
                        </span>
                        <div className="question-progress">
                          <div 
                            className="progress-bar"
                            style={{ width: `${((currentQuestionIndex + 1) / exam.questions.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <h3 className="question-text">{q.question}</h3>

                      <div className="options-list">
                        {q.options.map((option, optIndex) => (
                          <label key={optIndex} className="option-item">
                            <input
                              type="radio"
                              name={`question-${q.id}`}
                              value={optIndex}
                              checked={answers[q.id] === optIndex}
                              onChange={() => handleAnswerChange(q.id, optIndex)}
                              disabled={submitted}
                            />
                            <span className="option-text">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Navigation Buttons */}
                <div className="questions-footer">
                  <button
                    onClick={handlePreviousQuestion}
                    className="btn-prev-question"
                    disabled={currentQuestionIndex === 0}
                  >
                    ← Previous
                  </button>

                  {currentQuestionIndex === exam.questions.length - 1 ? (
                    <button
                      onClick={handleSubmit}
                      className="btn-submit-exam"
                      disabled={Object.values(answers).some(a => a === null)}
                    >
                      Submit Exam
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="btn-next-question"
                    >
                      Save and Next →
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

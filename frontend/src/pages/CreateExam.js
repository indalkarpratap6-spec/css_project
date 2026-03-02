import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './ExamPages.css';

export const CreateExam = () => {
  const [formData, setFormData] = useState({
    examTitle: '',
    description: '',
    duration: 60,
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleExamChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleQuestionChange = (qIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].question = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options[optIndex] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].correctAnswer = parseInt(value);
    setFormData({ ...formData, questions: newQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { question: '', options: ['', '', '', ''], correctAnswer: 0 }
      ]
    });
  };

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      setFormData({
        ...formData,
        questions: formData.questions.filter((_, i) => i !== index)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('/api/exams', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Exam created successfully!');
      navigate('/exams');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exam-page">
      <div className="exam-container">
        <h1>Create New Exam</h1>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="exam-form">
          <div className="form-group">
            <label>Exam Title *</label>
            <input
              type="text"
              name="examTitle"
              value={formData.examTitle}
              onChange={handleExamChange}
              required
              placeholder="Enter exam title"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleExamChange}
              placeholder="Enter exam description"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleExamChange}
              min="1"
            />
          </div>

          <div className="questions-section">
            <h3>Questions</h3>
            {formData.questions.map((q, qIndex) => (
              <div key={qIndex} className="question-block">
                <div className="question-header">
                  <h4>Question {qIndex + 1}</h4>
                  {formData.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="btn-remove"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label>Question Text *</label>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                    required
                    placeholder="Enter question"
                  />
                </div>

                <div className="options-section">
                  <label>Options *</label>
                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex} className="option-input">
                      <label className="option-label">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          value={optIndex}
                          checked={q.correctAnswer === optIndex}
                          onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                        />
                        Correct Answer
                      </label>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                        required
                        placeholder={`Option ${optIndex + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button type="button" onClick={addQuestion} className="btn-add-question">
              + Add Question
            </button>
          </div>

          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? 'Creating Exam...' : 'Create Exam'}
          </button>
        </form>
      </div>
    </div>
  );
};

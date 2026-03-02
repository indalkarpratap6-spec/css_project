import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ExamPages.css';

export const AvailableExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await axios.get('/api/exams');
      setExams(response.data);
    } catch (err) {
      setError('Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="exam-page"><div className="loading">Loading exams...</div></div>;

  return (
    <div className="exam-page">
      <div className="exam-container">
        <div className="exams-header">
          <h1>Available Exams</h1>
          <Link to="/create-exam" className="btn-create">
            + Create New Exam
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        {exams.length === 0 ? (
          <div className="no-exams">
            <p>No exams available yet.</p>
            <Link to="/create-exam">Create the first exam</Link>
          </div>
        ) : (
          <div className="exams-grid">
            {exams.map((exam) => (
              <div key={exam.id} className="exam-card">
                <div className="exam-card-header">
                  <h3>{exam.examTitle}</h3>
                  <span className="exam-duration">⏱ {exam.duration} min</span>
                </div>
                <p className="exam-description">{exam.description}</p>
                <div className="exam-info">
                  <span>📝 {exam.questions.length} Questions</span>
                  <span>📅 {new Date(exam.createdAt).toLocaleDateString()}</span>
                </div>
                <Link to={`/exam/${exam.id}`} className="btn-take-exam">
                  Take Exam
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

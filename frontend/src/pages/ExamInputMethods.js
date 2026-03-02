import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './ExamInputMethods.css';

export const ExamInputMethods = () => {
  const [activeTab, setActiveTab] = useState('manual');
  const [errors, setErrors] = useState('');
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Manual Input State
  const [manualForm, setManualForm] = useState({
    examTitle: '',
    description: '',
    duration: 60,
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]
  });

  // JSON Upload State
  // eslint-disable-next-line no-unused-vars
  const [jsonPreview, setJsonPreview] = useState(null);

  // Copy-Paste State
  const [copyPasteText, setCopyPasteText] = useState('');
  const [copyPasteForm, setCopyPasteForm] = useState({
    examTitle: '',
    description: '',
    duration: 60
  });

  // ===== MANUAL INPUT HANDLERS =====
  const handleManualExamChange = (e) => {
    const { name, value } = e.target;
    setManualForm({ ...manualForm, [name]: value });
  };

  const handleManualQuestionChange = (qIndex, value) => {
    const newQuestions = [...manualForm.questions];
    newQuestions[qIndex].question = value;
    setManualForm({ ...manualForm, questions: newQuestions });
  };

  const handleManualOptionChange = (qIndex, optIndex, value) => {
    const newQuestions = [...manualForm.questions];
    newQuestions[qIndex].options[optIndex] = value;
    setManualForm({ ...manualForm, questions: newQuestions });
  };

  const handleManualCorrectAnswerChange = (qIndex, value) => {
    const newQuestions = [...manualForm.questions];
    newQuestions[qIndex].correctAnswer = parseInt(value);
    setManualForm({ ...manualForm, questions: newQuestions });
  };

  const addManualQuestion = () => {
    setManualForm({
      ...manualForm,
      questions: [
        ...manualForm.questions,
        { question: '', options: ['', '', '', ''], correctAnswer: 0 }
      ]
    });
  };

  const removeManualQuestion = (index) => {
    if (manualForm.questions.length > 1) {
      setManualForm({
        ...manualForm,
        questions: manualForm.questions.filter((_, i) => i !== index)
      });
    }
  };

  // ===== JSON UPLOAD HANDLERS =====
  const handleJsonFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        // Validate JSON structure
        if (!json.examTitle || !Array.isArray(json.questions)) {
          setErrors('Invalid JSON format. Must contain "examTitle" and "questions" array.');
          return;
        }
        // Validate each question
        for (let q of json.questions) {
          if (!q.question || !Array.isArray(q.options) || q.options.length !== 4) {
            setErrors('Each question must have "question" text and exactly 4 "options".');
            return;
          }
          if (q.correctAnswer === undefined || q.correctAnswer < 0 || q.correctAnswer > 3) {
            setErrors('Each question must have "correctAnswer" (0-3).');
            return;
          }
        }

        setJsonPreview(json);
        setErrors('');
      } catch (err) {
        setErrors('Invalid JSON file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  // ===== COPY-PASTE PARSER HANDLERS =====
  const parseCopyPasteFormat = () => {
    try {
      setErrors('');
      const lines = copyPasteText.trim().split('\n').map(l => l.trim()).filter(l => l);
      
      if (lines.length === 0) {
        setErrors('Please paste content');
        return null;
      }

      const questions = [];
      let currentQuestion = null;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Match question pattern: Q1: or Question 1: or just starting with ?
        const qMatch = line.match(/^(?:[Qq]uestion\s*\d+:|[Qq]\d+:|Q\d+:)\s*(.+)/);
        if (qMatch) {
          if (currentQuestion) {
            questions.push(currentQuestion);
          }
          currentQuestion = {
            question: qMatch[1],
            options: [],
            correctAnswer: null
          };
          continue;
        }

        if (!currentQuestion) continue;

        // eslint-disable-next-line no-useless-escape
        // Match option patterns: A) B) C) D) or 1) 2) 3) 4) or opt1: opt2: etc
        const optMatch = line.match(/^(?:[A-D][):]|[1-4][):]|opt[1-4]:)\s*(.+)/i);
        if (optMatch) {
          currentQuestion.options.push(optMatch[1]);
          continue;
        }

        // Match answer patterns: Answer: A or Answer: 1 or ans: A
        const ansMatch = line.match(/^(?:Answer|Ans):?\s*([A-Da-d1-4])/i);
        if (ansMatch) {
          const answerChar = ansMatch[1].toUpperCase();
          let answerIndex = 0;

          if (/[A-D]/.test(answerChar)) {
            answerIndex = answerChar.charCodeAt(0) - 65; // A=0, B=1, etc
          } else if (/[1-4]/.test(answerChar)) {
            answerIndex = parseInt(answerChar) - 1; // 1=0, 2=1, etc
          }

          currentQuestion.correctAnswer = answerIndex;
        }
      }

      if (currentQuestion) {
        questions.push(currentQuestion);
      }

      // Validate parsed questions
      for (let q of questions) {
        if (!q.question || q.options.length !== 4 || q.correctAnswer === null) {
          setErrors(
            'Invalid format. Each question needs:\n' +
            '- Question text\n' +
            '- Exactly 4 options (A/B/C/D or 1/2/3/4)\n' +
            '- Answer line (Answer: A or Answer: 1)'
          );
          return null;
        }
      }

      if (questions.length === 0) {
        setErrors('No questions found. Please check the format.');
        return null;
      }

      return questions;
    } catch (err) {
      setErrors('Error parsing format: ' + err.message);
      return null;
    }
  };

  // ===== SUBMIT HANDLERS =====
  const submitExam = async (examData) => {
    try {
      setErrors('');
      if (!examData.examTitle) {
        setErrors('Exam title is required');
        return;
      }
      if (!examData.questions || examData.questions.length === 0) {
        setErrors('At least one question is required');
        return;
      // eslint-disable-next-line no-unused-vars
      }

      await axios.post('/api/exams', examData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Exam created successfully!');
      navigate('/exams');
    } catch (err) {
      setErrors(err.response?.data?.message || 'Failed to create exam');
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    await submitExam(manualForm);
  };

  const handleJsonSubmit = async (e) => {
    e.preventDefault();
    if (!jsonPreview) {
      setErrors('Please select and validate a JSON file first');
      return;
    }
    await submitExam(jsonPreview);
  };

  const handleCopyPasteSubmit = async (e) => {
    e.preventDefault();
    const questions = parseCopyPasteFormat();
    if (!questions) return;

    const examData = {
      ...copyPasteForm,
      questions: questions
    };

    await submitExam(examData);
  };

  return (
    <div className="exam-page">
      <div className="exam-container">
        <h1>Create Exam - Choose Input Method</h1>

        <div className="tabs-container">
          <div className="tabs-header">
            <button
              className={`tab-button ${activeTab === 'manual' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('manual');
                setErrors('');
              }}
            >
              ✏️ Manual Input
            </button>
            <button
              className={`tab-button ${activeTab === 'json' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('json');
                setErrors('');
              }}
            >
              📁 Upload JSON
            </button>
            <button
              className={`tab-button ${activeTab === 'paste' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('paste');
                setErrors('');
              }}
            >
              📋 Copy-Paste
            </button>
          </div>

          {errors && <div className="error-message">{errors}</div>}

          {/* MANUAL INPUT TAB */}
          {activeTab === 'manual' && (
            <form onSubmit={handleManualSubmit} className="exam-form">
              <div className="form-group">
                <label>Exam Title *</label>
                <input
                  type="text"
                  name="examTitle"
                  value={manualForm.examTitle}
                  onChange={handleManualExamChange}
                  required
                  placeholder="Enter exam title"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={manualForm.description}
                  onChange={handleManualExamChange}
                  placeholder="Enter exam description"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={manualForm.duration}
                  onChange={handleManualExamChange}
                  min="1"
                />
              </div>

              <div className="questions-section">
                <h3>Questions</h3>
                {manualForm.questions.map((q, qIndex) => (
                  <div key={qIndex} className="question-block">
                    <div className="question-header">
                      <h4>Question {qIndex + 1}</h4>
                      {manualForm.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeManualQuestion(qIndex)}
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
                        onChange={(e) => handleManualQuestionChange(qIndex, e.target.value)}
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
                              onChange={(e) => handleManualCorrectAnswerChange(qIndex, e.target.value)}
                            />
                            Correct
                          </label>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleManualOptionChange(qIndex, optIndex, e.target.value)}
                            required
                            placeholder={`Option ${optIndex + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <button type="button" onClick={addManualQuestion} className="btn-add-question">
                  + Add Question
                </button>
              </div>

              <button type="submit" className="btn-submit">
                Create Exam
              </button>
            </form>
          )}

          {/* JSON UPLOAD TAB */}
          {activeTab === 'json' && (
            <form onSubmit={handleJsonSubmit} className="exam-form">
              <div className="upload-section">
                <div className="file-input-container">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleJsonFileChange}
                    id="json-file-input"
                    className="hidden-file-input"
                  />
                  <div 
                    className="file-upload-area"
                    onClick={handleFileInputClick}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('drag-over');
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove('drag-over');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('drag-over');
                      const file = e.dataTransfer.files[0];
                      if (file && file.type === 'application/json') {
                        fileInputRef.current.files = e.dataTransfer.files;
                        handleJsonFileChange({ target: { files: e.dataTransfer.files } });
                      } else {
                        setErrors('Please drop a JSON file');
                      }
                    }}
                  >
                    <div className="upload-icon">📁</div>
                    <div className="upload-text">Click to upload or drag and drop</div>
                    <div className="upload-subtext">JSON files only</div>
                  </div>
                </div>

                <div className="json-format-guide">
                  <h4>JSON Format:</h4>
                  <pre>{`{
  "examTitle": "Math Quiz",
  "description": "Basic math",
  "duration": 60,
  "questions": [
    {
      "question": "What is 2+2?",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": 1
    }
  ]
}`}</pre>
                </div>
              </div>

              {jsonPreview && (
                <div className="json-preview">
                  <h4>Preview:</h4>
                  <div className="preview-info">
                    <p><strong>Title:</strong> {jsonPreview.examTitle}</p>
                    <p><strong>Questions:</strong> {jsonPreview.questions.length}</p>
                    <p><strong>Duration:</strong> {jsonPreview.duration} min</p>
                  </div>
                  <button type="submit" className="btn-submit">
                    Create Exam
                  </button>
                </div>
              )}

              {!jsonPreview && (
                <p className="info-text">Upload a JSON file to preview and create exam</p>
              )}
            </form>
          )}

          {/* COPY-PASTE TAB */}
          {activeTab === 'paste' && (
            <form onSubmit={handleCopyPasteSubmit} className="exam-form">
              <div className="form-group">
                <label>Exam Title *</label>
                <input
                  type="text"
                  value={copyPasteForm.examTitle}
                  onChange={(e) =>
                    setCopyPasteForm({ ...copyPasteForm, examTitle: e.target.value })
                  }
                  required
                  placeholder="Enter exam title"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={copyPasteForm.description}
                  onChange={(e) =>
                    setCopyPasteForm({ ...copyPasteForm, description: e.target.value })
                  }
                  placeholder="Enter exam description"
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  value={copyPasteForm.duration}
                  onChange={(e) =>
                    setCopyPasteForm({ ...copyPasteForm, duration: parseInt(e.target.value) })
                  }
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>Questions & Answers *</label>
                <textarea
                  value={copyPasteText}
                  onChange={(e) => setCopyPasteText(e.target.value)}
                  required
                  placeholder="Paste your questions and answers here..."
                  rows="12"
                  className="paste-textarea"
                />
              </div>

              <div className="paste-format-guide">
                <h4>Format Example:</h4>
                <pre>{`Q1: What is 2+2?
A) 3
B) 4
C) 5
D) 6
Answer: B

Q2: What is the capital of France?
A) London
B) Berlin
C) Paris
D) Madrid
Answer: C`}</pre>
              </div>

              <button type="submit" className="btn-submit">
                Create Exam
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

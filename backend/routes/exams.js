const express = require('express');
const fs = require('fs');
const path = require('path');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

const examsFile = path.join(__dirname, '../data/exams.json');

const getExams = () => {
  const data = fs.readFileSync(examsFile, 'utf-8');
  return JSON.parse(data);
};

const saveExams = (exams) => {
  fs.writeFileSync(examsFile, JSON.stringify(exams, null, 2));
};

// Get all available exams
router.get('/', (req, res) => {
  try {
    const exams = getExams();
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch exams', error: error.message });
  }
});

// Get exam by ID
router.get('/:id', (req, res) => {
  try {
    const exams = getExams();
    const exam = exams.find(e => e.id === req.params.id);
    
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch exam', error: error.message });
  }
});

// Create new exam
router.post('/', verifyToken, (req, res) => {
  try {
    const { examTitle, description, duration, questions } = req.body;

    if (!examTitle || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Please provide exam title and questions' });
    }

    const exams = getExams();
    const newExam = {
      id: Date.now().toString(),
      examTitle,
      description: description || '',
      duration: duration || 60,
      createdBy: req.userId,
      createdAt: new Date().toISOString(),
      questions: questions.map((q, index) => ({
        id: index + 1,
        question: q.question,
        type: 'mcq',
        options: q.options,
        correctAnswer: q.correctAnswer
      }))
    };

    exams.push(newExam);
    saveExams(exams);

    res.status(201).json({
      message: 'Exam created successfully',
      exam: newExam
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create exam', error: error.message });
  }
});

// Update exam
router.put('/:id', verifyToken, (req, res) => {
  try {
    const { examTitle, description, duration, questions } = req.body;
    const exams = getExams();
    const examIndex = exams.findIndex(e => e.id === req.params.id);

    if (examIndex === -1) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    if (exams[examIndex].createdBy !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this exam' });
    }

    exams[examIndex] = {
      ...exams[examIndex],
      examTitle: examTitle || exams[examIndex].examTitle,
      description: description !== undefined ? description : exams[examIndex].description,
      duration: duration || exams[examIndex].duration,
      questions: questions || exams[examIndex].questions
    };

    saveExams(exams);
    res.json({ message: 'Exam updated successfully', exam: exams[examIndex] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update exam', error: error.message });
  }
});

// Delete exam
router.delete('/:id', verifyToken, (req, res) => {
  try {
    const exams = getExams();
    const examIndex = exams.findIndex(e => e.id === req.params.id);

    if (examIndex === -1) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    if (exams[examIndex].createdBy !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this exam' });
    }

    exams.splice(examIndex, 1);
    saveExams(exams);
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete exam', error: error.message });
  }
});

module.exports = router;

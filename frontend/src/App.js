import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AvailableExams } from './pages/AvailableExams';
import { ExamInputMethods } from './pages/ExamInputMethods';
import { TakeExam } from './pages/TakeExam';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/exams" />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/exams"
            element={
              <AvailableExams />
            }
          />
          <Route
            path="/create-exam"
            element={
              <ProtectedRoute>
                <ExamInputMethods />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exam/:id"
            element={
              <TakeExam />
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

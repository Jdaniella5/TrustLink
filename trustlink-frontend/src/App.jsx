import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import VerificationFlow from './pages/VerificationFlow';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    // Make sure new users don't have verification status set yet
    const newUser = {
      ...userData,
      verificationStatus: userData.verificationStatus || 'pending'
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleVerificationComplete = (verificationData) => {
    const updatedUser = {
      ...user,
      verificationStatus: 'completed',
      trustScore: verificationData.trustScore,
      verificationData: verificationData
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to={user.verificationStatus === 'completed' ? "/dashboard" : "/verify"} replace /> : <Login onLogin={handleLogin} />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to={user.verificationStatus === 'completed' ? "/dashboard" : "/verify"} replace /> : <Register onLogin={handleLogin} />} 
        />

        {/* Protected Routes - redirect to login if no user */}
        <Route
          path="/verify"
          element={user ? <VerificationFlow 
            user={user}
            onVerificationComplete={handleVerificationComplete}
            onLogout={handleLogout}
          /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/dashboard"
          element={user && user.verificationStatus === 'completed' ? <Dashboard 
            user={user}
            onLogout={handleLogout}
          /> : user ? <Navigate to="/verify" replace /> : <Navigate to="/login" replace />}
        />

        {/* Default Route */}
        <Route path="/" element={
          user ? (user.verificationStatus === 'completed' ? <Navigate to="/dashboard" replace /> : <Navigate to="/verify" replace />) 
          : <Navigate to="/login" replace />
        } />

        {/* 404 Route */}
        <Route path="*" element={
          user ? (user.verificationStatus === 'completed' ? <Navigate to="/dashboard" replace /> : <Navigate to="/verify" replace />) 
          : <Navigate to="/login" replace />
        } />
      </Routes>
    </Router>
  );
}
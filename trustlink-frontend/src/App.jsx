import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { checkAuth } from "./api/apiUser";
import VerificationFlow from './pages/VerificationFlow';
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage"; 


function AnimatedRoutes({ user, onLogin, onLogout, setUser }) {
  const location = useLocation();

  const handleVerificationComplete = (verificationData) => {
    const updatedUser = {
      ...user,
      verificationStatus: 'completed',
      trustScore: verificationData.trustScore,
      verificationData: verificationData
    };
    setUser(updatedUser);
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        
        <Route
          path="/"
          element={
            user ? (
              user.verificationStatus === "completed" ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/verify" replace />
              )
            ) : (
              <LandingPage />
            )
          }
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            user ? (
              user.verificationStatus === "completed" ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/verify" replace />
              )
            ) : (
              <Login onLogin={onLogin} />
            )
          }
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={
            user ? (
              user.verificationStatus === "completed" ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/verify" replace />
              )
            ) : (
              <Register onLogin={onLogin} />
            )
          }
        />

        {/* VERIFICATION FLOW */}
        <Route
          path="/verify"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : user.verificationStatus === "completed" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <VerificationFlow
                user={user}
                onVerificationComplete={handleVerificationComplete}
                onLogout={onLogout}
              />
            )
          }
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : user.verificationStatus !== "completed" ? (
              <Navigate to="/verify" replace />
            ) : (
              <Dashboard user={user} onLogout={onLogout} />
            )
          }
        />

        {/* CATCH ALL - redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const handleLogin = (userData) => {
    const newUser = {
      ...userData,
      verificationStatus: userData.verificationStatus || 'pending'
    };
    setUser(newUser);
  };

 
  const handleLogout = async () => {
    try {
      // Optional: Call backend logout endpoint if you have one
      // await fetch('http://localhost:1550/api/user/logout', {
      //   method: 'POST',
      //   credentials: 'include'
      // });
    } catch (err) {
      console.error("Logout error:", err);
    }
    setUser(null);
  };


  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await checkAuth();
        if (response && response.user) {
          setUser(response.user);
        } else {
          setUser(null);
        }
      } catch (err) {
       
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <AnimatedRoutes 
        user={user} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
        setUser={setUser}
      />
    </Router>
  );
}
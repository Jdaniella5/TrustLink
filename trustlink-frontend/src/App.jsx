import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { checkAuth } from "./api/apiUser";

import VerificationFlow from "./pages/VerificationFlow";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";

function AnimatedRoutes({ user, onLogin, onLogout, setUser }) {
  const location = useLocation();

  const handleVerificationComplete = (verificationData) => {
    const updatedUser = {
      ...user,
      verificationStatus: "completed",
      trustScore: verificationData.trustScore,
      verificationData
    };
    setUser(updatedUser);
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* LANDING PAGE */}
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

        {/* CATCH ALL */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogin = (userData) => {
    setUser({
      ...userData,
      verificationStatus: userData.verificationStatus || "pending"
    });
  };

  const handleLogout = async () => {
    try {
      // optional backend logout
    } catch (err) {
      console.error("Logout error:", err);
    }
    setUser(null);
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await checkAuth();
        setUser(response?.user || null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
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

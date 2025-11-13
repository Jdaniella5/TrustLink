// src/components/auth/Login.jsx
// User login component - authenticates existing users

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader,
  AlertCircle,
  Shield
} from 'lucide-react';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  // Backend API URL
  const API_URL = 'https://trustlink-backend-jthl.onrender.com/api/user';

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  // =============================================================================
  // FORM HANDLING
  // =============================================================================

  /**
   * Handle input change
   * @param {Event} e - Input event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (error) {
      setError(null);
    }
  };

  /**
   * Handle form submission
   * @param {Event} e - Form event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Login via API
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // ✅ CALL onLogin PROP - This updates App.jsx user state
      onLogin(data.user);

      // Store auth data in session
      const storage = rememberMe ? localStorage : sessionStorage;
      if (data.token) {
        storage.setItem('authToken', data.token);
        sessionStorage.setItem('authToken', data.token);
      }
      if (data.sessionId) {
        storage.setItem('sessionId', data.sessionId);
        sessionStorage.setItem('sessionId', data.sessionId);
      }
      storage.setItem('user', JSON.stringify(data.user));
      sessionStorage.setItem('user', JSON.stringify(data.user));

      // Check if user has completed verification
      const hasCompletedVerification = data.user.trustScore > 0;

      if (hasCompletedVerification) {
        // User already verified, go to dashboard
        navigate('/dashboard');
      } else {
        // New user or incomplete verification, go to verification flow
        navigate('/verify');
      }

    } catch (err) {
      console.error('Login error:', err);
      
      // Handle specific error messages
      if (err.message.includes('Invalid') || err.message.includes('password')) {
        setError('Invalid email or password');
      } else if (err.message.includes('not found')) {
        setError('No account found with this email');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // =============================================================================
  // RENDER UI
  // =============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-blue-500 rounded-full mb-4">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to access your trust verification
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-700">Remember me</span>
              </label>
              
              <button
                type="button"
                onClick={() => alert('Password reset functionality coming soon!')}
                className="text-sm text-blue-500 hover:text-blue-600 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">Don't have an account?</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Register Link */}
          <Link
            to="/register"
            className="block text-center py-3 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition font-medium"
          >
            Create Account
          </Link>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            Why Trust Verification?
          </h3>
          <ul className="space-y-2 text-xs text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Secure identity verification using multiple factors</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Build trust with community vouching system</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Get your trust score and verification passport</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Use across platforms that require verified identity</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Protected by encryption. Your data is secure with us.
        </p>
      </div>
    </div>
  );
};

export default Login;
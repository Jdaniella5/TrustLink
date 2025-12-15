import React, { useState } from 'react'
import { motion } from "framer-motion"
import { loginUser } from '../../api/apiUser'
import { useNavigate } from "react-router-dom" // ADD THIS IMPORT

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(''); // ADD THIS FOR ERROR DISPLAY
  const navigate = useNavigate(); // ADD THIS
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
  const data = { email, password };

  try {
    const res = await loginUser(data);
    console.log('📥 LOGIN RESPONSE:', res);
    
    // ✅ FIXED: Use cookies only (backend already sets cookie)
    if (res && res.userId) {
      // Create user object
      const user = {
        id: res.userId,
        email: email,
        sessionId: res.sessionId
      };
      
      sessionStorage.setItem('user', JSON.stringify(user));
      console.log('✅ User saved to sessionStorage:', user);
      
      onLogin(user);
      navigate("/verify");
    } else {
      throw new Error('No user data received');
    }
    
  } catch (error) {
    console.error("Login failed:", error);
    setError(error.message || "Login failed. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              style={{
                boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
              }}
            />
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-transparent to-yellow-600"
        />
      </div>

      {/* Logo Section */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-8 left-8 z-10"
      >
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-2xl flex items-center justify-center shadow-[0_8px_24px_rgba(255,215,0,0.4)]">
            <svg className="w-8 h-8 fill-black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            TRUSTLINK
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: -300, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-base">
            Sign in to access your verified identity
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-[rgba(18,18,18,0.95)] backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-[#2a2a2a]"
        >
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border-2 border-red-500/50 rounded-xl">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2.5">
                Email Address  <span className="text-yellow-400">*</span>
              </label>
              <div className="relative">
                <svg 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input 
                  type="email"
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3.5 bg-[rgba(15,15,15,0.8)] border-2 border-[#2a2a2a] rounded-xl text-white text-[15px] transition-all duration-300 focus:outline-none focus:border-yellow-400 focus:bg-[rgba(15,15,15,1)] focus:shadow-[0_0_0_4px_rgba(255,215,0,0.1)] placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2.5">
                Password  <span className="text-yellow-400">*</span>
              </label>
              <div className="relative">
                <svg 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input 
                  type="password"
                  placeholder="Enter your password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3.5 bg-[rgba(15,15,15,0.8)] border-2 border-[#2a2a2a] rounded-xl text-white text-[15px] transition-all duration-300 focus:outline-none focus:border-yellow-400 focus:bg-[rgba(15,15,15,1)] focus:shadow-[0_0_0_4px_rgba(255,215,0,0.1)] placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox"
                  disabled={isLoading}
                  className="w-4 h-4 accent-yellow-400 cursor-pointer disabled:cursor-not-allowed"
                />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <a href="#" className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors duration-200">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <motion.button
              onClick={handleSubmit}
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:from-yellow-300 hover:to-yellow-400 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2a2a2a]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[rgba(18,18,18,0.95)] text-gray-500 font-medium">
                  OR CONTINUE WITH
                </span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                type="button"
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                className="flex items-center justify-center space-x-2 px-4 py-3.5 bg-[rgba(15,15,15,0.8)] border-2 border-[#2a2a2a] rounded-xl text-white font-medium transition-all duration-300 hover:border-yellow-400 hover:bg-[rgba(15,15,15,1)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Google</span>
              </motion.button>

              <motion.button
                type="button"
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                className="flex items-center justify-center space-x-2 px-4 py-3.5 bg-[rgba(15,15,15,0.8)] border-2 border-[#2a2a2a] rounded-xl text-white font-medium transition-all duration-300 hover:border-yellow-400 hover:bg-[rgba(15,15,15,1)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Sign Up Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-center mt-6"
        >
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <a href="/register" className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors duration-200">
              Create Account
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login;
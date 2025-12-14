import React, { useState } from 'react'
import { motion } from "framer-motion"
import { registerUser } from '../../api/apiUser'
import { useNavigate } from "react-router-dom"

const Register = ({ onLogin }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Only send what the backend accepts
      const data = { 
        name: `${firstName} ${lastName}`,
        email, 
        password,
        DOB: `${year}-${month}-${day}`,
        Address:`${streetAddress}, ${city}, ${state}, ${postalCode}, ${country}`,
        phoneNumber: phoneNumber,
      };
      
     const res = await registerUser(data);
     
      onLogin(res.user);
      navigate("/login"); 
    } catch (error) {
      console.error("Registration failed", error);
       setError(error.message || "Registration failed");
    }
  };
 
  return (
    <motion.div
      initial={{ y: 0, opacity: 1 }}
      exit={{ y: 300, opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-black flex items-center justify-center py-10 px-5 relative overflow-hidden"
    >
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
         {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}
      <div className=" ">
        {/* Logo Section */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-8 left-8 z-10"
        >
          <div className="flex z-10 items-center space-x-3">
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
          className="w-full max-w-[650px] mt-20 md:mt-10  relative z-10"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Create Your Account
            </h1>
            <p className="text-gray-400 text-base">
              Join TrustLink to build your verified identity
            </p>
          </motion.div>

          {/* Form Card */}
          <div className="bg-[rgba(18,18,18,0.95)] backdrop-blur-xl border border-[#2a2a2a] rounded-3xl p-10 animate-fadeInUp">
            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="mb-8">
                <h2 className="text-lg font-bold text-yellow-400 mb-5 flex items-center gap-2">
                  <svg className="w-5 h-5 fill-yellow-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="text-sm font-semibold text-gray-400 mb-2 block">
                      First Name <span className="text-yellow-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter first name"
                      required
                      className="w-full px-4 py-3.5 bg-[rgba(15,15,15,0.8)] border-2 border-[#2a2a2a] rounded-xl text-white text-[15px] transition-all duration-300 focus:outline-none focus:border-yellow-400 focus:bg-[rgba(15,15,15,1)] focus:shadow-[0_0_0_4px_rgba(255,215,0,0.1)] placeholder:text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-400 mb-2 block">
                      Last Name <span className="text-yellow-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter last name"
                      required
                      className="w-full px-4 py-3.5 bg-[rgba(15,15,15,0.8)] border-2 border-[#2a2a2a] rounded-xl text-white text-[15px] transition-all duration-300 focus:outline-none focus:border-yellow-400 focus:bg-[rgba(15,15,15,1)] focus:shadow-[0_0_0_4px_rgba(255,215,0,0.1)] placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-400 mb-2 block">
                    Date of Birth <span className="text-yellow-400">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <select
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      required
                      className="w-full px-4 py-3.5 bg-[rgba(15,15,15,0.8)] border-2 border-[#2a2a2a] rounded-xl text-white text-[15px] transition-all duration-300 focus:outline-none focus:border-yellow-400 focus:bg-[rgba(15,15,15,1)] focus:shadow-[0_0_0_4px_rgba(255,215,0,0.1)] cursor-pointer"
                    >
                      <option value="">Month</option>
                      <option value="01">January</option>
                      <option value="02">February</option>
                      <option value="03">March</option>
                      <option value="04">April</option>
                      <option value="05">May</option>
                      <option value="06">June</option>
                      <option value="07">July</option>
                      <option value="08">August</option>
                      <option value="09">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </select>
                    <select
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      required
                      className="w-full px-4 py-3.5 bg-[rgba(15,15,15,0.8)] border-2 border-[#2a2a2a] rounded-xl text-white text-[15px] transition-all duration-300 focus:outline-none focus:border-yellow-400 focus:bg-[rgba(15,15,15,1)] focus:shadow-[0_0_0_4px_rgba(255,215,0,0.1)] cursor-pointer"
                    >
                      <option value="">Day</option>
                      {[...Array(31)].map((_, i) => (
                        <option key={i + 1} value={String(i + 1).padStart(2, '0')}>{i + 1}</option>
                      ))}
                    </select>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      required
                      className="w-full px-4 py-3.5 bg-[rgba(15,15,15,0.8)] border-2 border-[#2a2a2a] rounded-xl text-white text-[15px] transition-all duration-300 focus:outline-none focus:border-yellow-400 focus:bg-[rgba(15,15,15,1)] focus:shadow-[0_0_0_4px_rgba(255,215,0,0.1)] cursor-pointer"
                    >
                      <option value="">Year</option>
                      {[...Array(30)].map((_, i) => (
                        <option key={2006 - i} value={2006 - i}>{2006 - i}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="mb-8">
                <h2 className="text-lg font-bold text-yellow-400 mb-5 flex items-center gap-2">
                  <svg className="w-5 h-5 fill-yellow-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  Address
                </h2>

                <div className="mb-5">
                  <label className="text-sm font-semibold text-gray-400 mb-2 block">
                    Street Address <span className="text-yellow-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="Enter street address"
                    required
                    className="w-full px-4 py-3.5 bg-[rgba(15,15,15,0.8)] border-2 border-[#2a2a2a] rounded-xl text-white text-[15px] transition-all duration-300 focus:outline-none focus:border-yellow-400 focus:bg-[rgba(15,15,15,1)] focus:shadow-[0_0_0_4px_rgba(255,215,0,0.1)] placeholder:text-gray-600"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-400 mb-2 block">
                      City <span className="text-yellow-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Enter city"
                      required
                      className="w-full px-4 py-3.5 bg-[rgba(15,15,15,0.8)] border-2 border-[#2a2a2a] rounded-xl text-white text-[15px] transition-all duration-300 focus:outline-none focus:border-yellow-400 focus:bg-[rgba(15,15,15,1)] focus:shadow-[0_0_0_4px_rgba(255,215,0,0.1)] placeholder:text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-400 mb-2 block">
                      Country <span className="text-yellow-400">*</span>
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                      className="w-full px-4 py-3.5 bg-[rgba(15,15,15,0.8)] border-2 border-[#2a2a2a] rounded-xl text-white text-[15px] transition-all duration-300 focus:outline-none focus:border-yellow-400 focus:bg-[rgba(15,15,15,1)] focus:shadow-[0_0_0_4px_rgba(255,215,0,0.1)] cursor-pointer"
                    >
                      <option value="">Select country</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="NG">Nigeria</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-8">
                <h2 className="text-lg font-bold text-yellow-400 mb-5 flex items-center gap-2">
                  <svg className="w-5 h-5 fill-yellow-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  Contact Information
                </h2>

                <div className="mb-5">
                  <label className="text-sm font-semibold text-gray-400 mb-2 block">
                    Email Address <span className="text-yellow-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      required
                      className="w-full px-4 py-3.5 bg-[rgba(15,15,15,0.8)] border-2 border-[#2a2a2a] rounded-xl text-white text-[15px] transition-all duration-300 focus:outline-none focus:border-yellow-400 focus:bg-[rgba(15,15,15,1)] focus:shadow-[0_0_0_4px_rgba(255,215,0,0.1)] placeholder:text-gray-600"
                    />
                    <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 fill-gray-600 pointer-events-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                </div>

                <div className="mb-5">
                  <label className="text-sm font-semibold text-gray-400 mb-2 block">
                    Phone Number <span className="text-yellow-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="08143009844"
                      required
                      className="w-full px-4 py-3.5 bg-[rgba(15,15,15,0.8)] border-2 border-[#2a2a2a] rounded-xl text-white text-[15px] transition-all duration-300 focus:outline-none focus:border-yellow-400 focus:bg-[rgba(15,15,15,1)] focus:shadow-[0_0_0_4px_rgba(255,215,0,0.1)] placeholder:text-gray-600"
                    />
                    <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 fill-gray-600 pointer-events-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-400 mb-2 block">
                    Password <span className="text-yellow-400">*</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                    className="w-full px-4 py-3.5 bg-[rgba(15,15,15,0.8)] border-2 border-[#2a2a2a] rounded-xl text-white text-[15px] transition-all duration-300 focus:outline-none focus:border-yellow-400 focus:bg-[rgba(15,15,15,1)] focus:shadow-[0_0_0_4px_rgba(255,215,0,0.1)] placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 mt-6 p-4 bg-[rgba(15,15,15,0.6)] rounded-xl">
                <input
                  type="checkbox"
                  id="terms"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  required
                  className="w-5 h-5 accent-yellow-400 cursor-pointer mt-0.5"
                />
                <label htmlFor="terms" className="text-sm text-gray-400 leading-relaxed flex-1 cursor-pointer">
                  I agree to the <a href="#" className="text-yellow-400 font-semibold hover:underline">Terms of Service</a> and <a href="#" className="text-yellow-400 font-semibold hover:underline">Privacy Policy</a>. I understand that my information will be used to verify my identity and build my trust score.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:from-yellow-300 hover:to-yellow-400"
              >
                <span className="relative z-10">Create Account</span>
                <div className="absolute top-1/2 left-1/2 w-0 h-0 rounded-full bg-white/30 -translate-x-1/2 -translate-y-1/2 transition-all duration-600 group-hover:w-96 group-hover:h-96" />
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-[#2a2a2a]" />
              <span className="text-sm text-gray-600 font-semibold">OR CONTINUE WITH</span>
              <div className="flex-1 h-px bg-[#2a2a2a]" />
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="px-4 py-3.5 bg-[rgba(15,15,15,0.8)] border-2 border-[#2a2a2a] rounded-xl text-white text-[15px] font-semibold transition-all duration-300 hover:border-yellow-400 hover:bg-[rgba(15,15,15,1)] hover:-translate-y-0.5 flex items-center justify-center gap-2.5">
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button className="px-4 py-3.5 bg-[rgba(15,15,15,0.8)] border-2 border-[#2a2a2a] rounded-xl text-white text-[15px] font-semibold transition-all duration-300 hover:border-yellow-400 hover:bg-[rgba(15,15,15,1)] hover:-translate-y-0.5 flex items-center justify-center gap-2.5">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>

            {/* Sign In Link */}
            <p className="text-center mt-8 text-sm text-gray-400">
              Already have an account? <a href="/login" className="text-yellow-400 font-bold hover:underline">Sign In</a>
            </p>
          </div>
       </motion.div>
      </div>
    </motion.div>
  )
}

export default Register
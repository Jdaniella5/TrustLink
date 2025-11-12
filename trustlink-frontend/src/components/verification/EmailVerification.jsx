// // src/components/verification/EmailVerification.jsx
// // This component handles email verification using OTP (One-Time Password)
// // Sends verification code to user's email and validates input

// import React, { useState, useRef, useEffect } from 'react';
// import { 
//   Mail, 
//   CheckCircle, 
//   Loader, 
//   AlertCircle,
//   RefreshCw,
//   Send
// } from 'lucide-react';
// import { requestEmailVerification, verifyEmailOTP } from '../../services/api';

// const EmailVerification = ({ sessionId, onComplete }) => {
//   // Get user email from session storage (set during login/registration)
//   const [userEmail] = useState(() => {
//     const user = JSON.parse(sessionStorage.getItem('user') || '{}');
//     return user.email || '';
//   });

//   // Component state
//   const [step, setStep] = useState('request'); // 'request', 'verify', 'success'
//   const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6-digit OTP
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [resendTimer, setResendTimer] = useState(0); // Countdown timer for resend
//   const [mockOTP, setMockOTP] = useState(''); // For testing (remove in production)

//   // Refs for OTP input fields
//   const otpInputRefs = useRef([]);

//   // Timer interval ref
//   const timerIntervalRef = useRef(null);

//   // =============================================================================
//   // TIMER MANAGEMENT
//   // =============================================================================

//   useEffect(() => {
//     // Start countdown when resendTimer is set
//     if (resendTimer > 0) {
//       timerIntervalRef.current = setInterval(() => {
//         setResendTimer(prev => {
//           if (prev <= 1) {
//             clearInterval(timerIntervalRef.current);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }

//     return () => {
//       if (timerIntervalRef.current) {
//         clearInterval(timerIntervalRef.current);
//       }
//     };
//   }, [resendTimer]);

//   // =============================================================================
//   // SEND VERIFICATION EMAIL
//   // =============================================================================

//   /**
//    * Request OTP to be sent to user's email
//    */
//   const handleSendOTP = async () => {
//     if (!userEmail) {
//       setError('Email address not found. Please log in again.');
//       return;
//     }

//     setIsLoading(true);
//     setError(null);
//     setSuccessMessage(null);

//     try {
//       // Request OTP from backend
//       const response = await requestEmailVerification(userEmail);

//       if (response.success) {
//         setStep('verify');
//         setSuccessMessage(`Verification code sent to ${userEmail}`);
//         setResendTimer(60); // 60 second cooldown before resend
        
//         // For testing: show mock OTP (remove in production)
//         if (response.mockOTP) {
//           setMockOTP(response.mockOTP);
//           console.log('🔐 Mock OTP for testing:', response.mockOTP);
//         }

//         // Auto-focus first OTP input
//         setTimeout(() => {
//           otpInputRefs.current[0]?.focus();
//         }, 100);
//       }
//     } catch (err) {
//       console.error('Failed to send OTP:', err);
//       setError('Failed to send verification email. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /**
//    * Resend OTP (with cooldown)
//    */
//   const handleResendOTP = async () => {
//     if (resendTimer > 0) return; // Prevent spam
    
//     // Clear previous OTP
//     setOtp(['', '', '', '', '', '']);
//     otpInputRefs.current[0]?.focus();
    
//     await handleSendOTP();
//   };

//   // =============================================================================
//   // OTP INPUT HANDLING
//   // =============================================================================

//   /**
//    * Handle OTP input change
//    * @param {number} index - Index of input field (0-5)
//    * @param {string} value - Input value
//    */
//   const handleOtpChange = (index, value) => {
//     // Only allow digits
//     if (value && !/^\d$/.test(value)) return;

//     // Update OTP array
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     // Auto-focus next input
//     if (value && index < 5) {
//       otpInputRefs.current[index + 1]?.focus();
//     }

//     // Auto-submit when all 6 digits entered
//     if (value && index === 5 && newOtp.every(digit => digit !== '')) {
//       handleVerifyOTP(newOtp.join(''));
//     }
//   };

//   /**
//    * Handle backspace/delete in OTP input
//    * @param {number} index - Index of input field
//    * @param {KeyboardEvent} e - Keyboard event
//    */
//   const handleOtpKeyDown = (index, e) => {
//     if (e.key === 'Backspace' && !otp[index] && index > 0) {
//       // Move to previous input on backspace if current is empty
//       otpInputRefs.current[index - 1]?.focus();
//     }
//   };

//   /**
//    * Handle paste in OTP input
//    * @param {ClipboardEvent} e - Paste event
//    */
//   const handleOtpPaste = (e) => {
//     e.preventDefault();
//     const pastedData = e.clipboardData.getData('text').trim();
    
//     // Only process if it's 6 digits
//     if (/^\d{6}$/.test(pastedData)) {
//       const newOtp = pastedData.split('');
//       setOtp(newOtp);
      
//       // Focus last input
//       otpInputRefs.current[5]?.focus();
      
//       // Auto-submit
//       handleVerifyOTP(pastedData);
//     }
//   };

//   // =============================================================================
//   // VERIFY OTP
//   // =============================================================================

//   /**
//    * Verify OTP with backend
//    * @param {string} otpCode - 6-digit OTP code
//    */
//   const handleVerifyOTP = async (otpCode) => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       // Verify OTP with backend
//       const response = await verifyEmailOTP(userEmail, otpCode);

//       if (response.success) {
//         setStep('success');
//         setSuccessMessage('Email verified successfully!');
        
//         // Wait a moment to show success, then complete
//         setTimeout(() => {
//           if (onComplete) {
//             onComplete({
//               success: true,
//               email: userEmail,
//               verifiedAt: new Date().toISOString()
//             });
//           }
//         }, 1500);
//       } else {
//         setError(response.message || 'Invalid verification code. Please try again.');
//         // Clear OTP on error
//         setOtp(['', '', '', '', '', '']);
//         otpInputRefs.current[0]?.focus();
//       }
//     } catch (err) {
//       console.error('Failed to verify OTP:', err);
//       setError('Verification failed. Please check your code and try again.');
//       // Clear OTP on error
//       setOtp(['', '', '', '', '', '']);
//       otpInputRefs.current[0]?.focus();
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /**
//    * Manual submit (when user clicks verify button)
//    */
//   const handleManualSubmit = () => {
//     const otpCode = otp.join('');
    
//     if (otpCode.length !== 6) {
//       setError('Please enter all 6 digits');
//       return;
//     }

//     handleVerifyOTP(otpCode);
//   };

//   // =============================================================================
//   // RENDER UI
//   // =============================================================================

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       {/* Header */}
//       <div className="text-center mb-6">
//         <h2 className="text-3xl font-bold text-gray-800 mb-2">
//           Email Verification
//         </h2>
//         <p className="text-gray-600">
//           Confirm your email address to continue
//         </p>
//       </div>

//       {/* Email Display */}
//       {userEmail && (
//         <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
//           <Mail className="text-blue-500" size={24} />
//           <div>
//             <p className="text-sm text-blue-600 font-medium">Verifying email</p>
//             <p className="text-lg font-semibold text-blue-800">{userEmail}</p>
//           </div>
//         </div>
//       )}

//       {/* Error Message */}
//       {error && (
//         <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
//           <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
//           <p className="text-red-700">{error}</p>
//         </div>
//       )}

//       {/* Success Message */}
//       {successMessage && !error && (
//         <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
//           <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
//           <p className="text-green-700">{successMessage}</p>
//         </div>
//       )}

//       {/* Main Content - Step Based */}
//       <div className="bg-white rounded-lg shadow-lg p-8">
//         {/* STEP 1: Request OTP */}
//         {step === 'request' && (
//           <div className="text-center">
//             <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Mail size={40} className="text-orange-500" />
//             </div>
            
//             <h3 className="text-xl font-semibold text-gray-800 mb-2">
//               Send Verification Code
//             </h3>
//             <p className="text-gray-600 mb-6">
//               We'll send a 6-digit code to your email address
//             </p>

//             <button
//               onClick={handleSendOTP}
//               disabled={isLoading || !userEmail}
//               className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
//             >
//               {isLoading ? (
//                 <>
//                   <Loader className="animate-spin" size={20} />
//                   Sending...
//                 </>
//               ) : (
//                 <>
//                   <Send size={20} />
//                   Send Verification Code
//                 </>
//               )}
//             </button>
//           </div>
//         )}

//         {/* STEP 2: Verify OTP */}
//         {step === 'verify' && (
//           <div>
//             <div className="text-center mb-6">
//               <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                 Enter Verification Code
//               </h3>
//               <p className="text-gray-600">
//                 Enter the 6-digit code sent to your email
//               </p>
//             </div>

//             {/* Testing Helper (Remove in production) */}
//             {mockOTP && (
//               <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
//                 <p className="text-xs text-yellow-700 mb-1">Testing Mode</p>
//                 <p className="text-sm font-mono font-bold text-yellow-800">
//                   Mock OTP: {mockOTP}
//                 </p>
//               </div>
//             )}

//             {/* OTP Input Fields */}
//             <div className="flex justify-center gap-3 mb-6">
//               {otp.map((digit, index) => (
//                 <input
//                   key={index}
//                   ref={el => otpInputRefs.current[index] = el}
//                   type="text"
//                   inputMode="numeric"
//                   maxLength={1}
//                   value={digit}
//                   onChange={(e) => handleOtpChange(index, e.target.value)}
//                   onKeyDown={(e) => handleOtpKeyDown(index, e)}
//                   onPaste={handleOtpPaste}
//                   disabled={isLoading}
//                   className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none disabled:bg-gray-100 transition"
//                 />
//               ))}
//             </div>

//             {/* Verify Button */}
//             <button
//               onClick={handleManualSubmit}
//               disabled={isLoading || otp.some(d => !d)}
//               className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2 mb-4"
//             >
//               {isLoading ? (
//                 <>
//                   <Loader className="animate-spin" size={20} />
//                   Verifying...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle size={20} />
//                   Verify Code
//                 </>
//               )}
//             </button>

//             {/* Resend OTP */}
//             <div className="text-center">
//               <p className="text-sm text-gray-600 mb-2">
//                 Didn't receive the code?
//               </p>
//               <button
//                 onClick={handleResendOTP}
//                 disabled={resendTimer > 0 || isLoading}
//                 className="text-orange-500 hover:text-orange-600 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
//               >
//                 <RefreshCw size={16} />
//                 {resendTimer > 0 ? (
//                   `Resend in ${resendTimer}s`
//                 ) : (
//                   'Resend Code'
//                 )}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* STEP 3: Success */}
//         {step === 'success' && (
//           <div className="text-center">
//             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
//               <CheckCircle size={40} className="text-green-500" />
//             </div>
            
//             <h3 className="text-2xl font-bold text-gray-800 mb-2">
//               Email Verified!
//             </h3>
//             <p className="text-gray-600 mb-4">
//               Your email has been successfully verified
//             </p>
            
//             <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
//               <p className="text-green-700 font-medium">{userEmail}</p>
//               <p className="text-sm text-green-600 mt-1">✓ Verified</p>
//             </div>

//             <div className="mt-6">
//               <Loader className="animate-spin mx-auto text-green-500" size={24} />
//               <p className="text-sm text-gray-500 mt-2">
//                 Moving to next step...
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Info Section */}
//       {step === 'request' && (
//         <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
//           <h4 className="font-semibold text-gray-800 mb-2 text-sm">Why verify email?</h4>
//           <ul className="text-xs text-gray-600 space-y-1">
//             <li>• Ensures account security</li>
//             <li>• Prevents unauthorized access</li>
//             <li>• Allows password recovery</li>
//             <li>• Required for trust score calculation</li>
//           </ul>
//         </div>
//       )}

//       {/* Tips Section */}
//       {step === 'verify' && (
//         <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
//           <h4 className="font-semibold text-gray-800 mb-2 text-sm">Tips</h4>
//           <ul className="text-xs text-gray-600 space-y-1">
//             <li>• Check your spam/junk folder if you don't see the email</li>
//             <li>• The code expires in 10 minutes</li>
//             <li>• You can paste the entire code at once</li>
//             <li>• Wait 60 seconds before requesting a new code</li>
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmailVerification;

import React, { useState, useRef, useEffect } from 'react';
import { 
  Mail, 
  CheckCircle, 
  Loader, 
  AlertCircle,
  RefreshCw,
  Send,
  Copy
} from 'lucide-react';

const EmailVerification = ({ sessionId, onComplete }) => {
  const [userEmail] = useState(() => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    return user.email || 'user@example.com';
  });

  const [step, setStep] = useState('request'); // 'request', 'verify', 'success'
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [generatedOTP, setGeneratedOTP] = useState(''); // Store the actual OTP
  const [copied, setCopied] = useState(false);

  const otpInputRefs = useRef([]);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    if (resendTimer > 0) {
      timerIntervalRef.current = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [resendTimer]);

  /**
   * Generate random 6-digit OTP
   */
  const generateOTP = () => {
    const newOTP = String(Math.floor(100000 + Math.random() * 900000));
    return newOTP;
  };

  /**
   * Request OTP to be sent (simulated)
   */
  const handleSendOTP = async () => {
    if (!userEmail) {
      setError('Email address not found. Please log in again.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate OTP
      const newOTP = generateOTP();
      setGeneratedOTP(newOTP);

      setStep('verify');
      setSuccessMessage(`Verification code generated for ${userEmail}`);
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);

      // Auto-focus first OTP input
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);

    } catch (err) {
      console.error('Failed to send OTP:', err);
      setError('Failed to generate verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resend OTP (with cooldown)
   */
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setOtp(['', '', '', '', '', '']);
    otpInputRefs.current[0]?.focus();
    
    await handleSendOTP();
  };

  /**
   * Handle OTP input change
   */
  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    if (value && index === 5 && newOtp.every(digit => digit !== '')) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  /**
   * Handle backspace in OTP input
   */
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  /**
   * Handle paste in OTP input
   */
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      otpInputRefs.current[5]?.focus();
      handleVerifyOTP(pastedData);
    }
  };

  /**
   * Verify OTP
   */
  const handleVerifyOTP = async (otpCode) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Check if OTP matches
      if (otpCode === generatedOTP) {
        setStep('success');
        setSuccessMessage('Email verified successfully!');
        
        setTimeout(() => {
          if (onComplete) {
            onComplete({
              success: true,
              email: userEmail,
              verifiedAt: new Date().toISOString()
            });
          }
        }, 1500);
      } else {
        setError('Invalid verification code. Please try again.');
        setOtp(['', '', '', '', '', '']);
        otpInputRefs.current[0]?.focus();
      }
    } catch (err) {
      console.error('Failed to verify OTP:', err);
      setError('Verification failed. Please try again.');
      setOtp(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manual submit
   */
  const handleManualSubmit = () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    handleVerifyOTP(otpCode);
  };

  /**
   * Copy OTP to clipboard
   */
  const copyOTPToClipboard = () => {
    navigator.clipboard.writeText(generatedOTP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Email Verification
        </h2>
        <p className="text-gray-600">
          Confirm your email address to continue
        </p>
      </div>

      {userEmail && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
          <Mail className="text-blue-500" size={24} />
          <div>
            <p className="text-sm text-blue-600 font-medium">Verifying email</p>
            <p className="text-lg font-semibold text-blue-800">{userEmail}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {successMessage && !error && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* STEP 1: Request OTP */}
        {step === 'request' && (
          <div className="text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail size={40} className="text-orange-500" />
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Generate Verification Code
            </h3>
            <p className="text-gray-600 mb-6">
              Click below to generate a 6-digit verification code
            </p>

            <button
              onClick={handleSendOTP}
              disabled={isLoading || !userEmail}
              className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Generating...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Generate Code
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 2: Verify OTP */}
        {step === 'verify' && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Enter Verification Code
              </h3>
              <p className="text-gray-600">
                Enter the 6-digit code shown below
              </p>
            </div>

            {/* Testing Helper - Show the generated OTP */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-700 mb-2 font-medium">✓ CODE GENERATED</p>
              <div className="flex items-center justify-between bg-white p-3 rounded border border-yellow-300">
                <p className="text-2xl font-mono font-bold text-yellow-800 tracking-widest">
                  {generatedOTP}
                </p>
                <button
                  onClick={copyOTPToClipboard}
                  className="p-2 hover:bg-yellow-100 rounded transition"
                  title="Copy OTP"
                >
                  <Copy size={18} className={copied ? 'text-green-600' : 'text-yellow-600'} />
                </button>
              </div>
              {copied && (
                <p className="text-xs text-green-600 mt-2">✓ Copied to clipboard</p>
              )}
            </div>

            {/* OTP Input Fields */}
            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => otpInputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={handleOtpPaste}
                  disabled={isLoading}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none disabled:bg-gray-100 transition"
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleManualSubmit}
              disabled={isLoading || otp.some(d => !d)}
              className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2 mb-4"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Verify Code
                </>
              )}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Need a new code?
              </p>
              <button
                onClick={handleResendOTP}
                disabled={resendTimer > 0 || isLoading}
                className="text-orange-500 hover:text-orange-600 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
              >
                <RefreshCw size={16} />
                {resendTimer > 0 ? (
                  `Resend in ${resendTimer}s`
                ) : (
                  'Generate New Code'
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Success */}
        {step === 'success' && (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Email Verified!
            </h3>
            <p className="text-gray-600 mb-4">
              Your email has been successfully verified
            </p>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium">{userEmail}</p>
              <p className="text-sm text-green-600 mt-1">✓ Verified</p>
            </div>

            <div className="mt-6">
              <Loader className="animate-spin mx-auto text-green-500" size={24} />
              <p className="text-sm text-gray-500 mt-2">
                Moving to next step...
              </p>
            </div>
          </div>
        )}
      </div>

      {step === 'request' && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Why verify email?</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Ensures account security</li>
            <li>• Prevents unauthorized access</li>
            <li>• Allows password recovery</li>
            <li>• Required for trust score calculation</li>
          </ul>
        </div>
      )}

      {step === 'verify' && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Testing Mode</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• The code is generated and displayed above</li>
            <li>• Copy the code using the copy button</li>
            <li>• Paste it into the input fields below</li>
            <li>• Or type it in manually</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
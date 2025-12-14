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
import { sendOtp, verifyOtp, resendOtp} from '../../api/apiUser'; // Adjust path as needed

const EmailVerification = ({ sessionId, onComplete }) => {
  const [userEmail] = useState(() => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    return user.email || 'user@example.com';
  });
  
  const [userId] = useState(() => {
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  console.log('🔍 Full user from storage:', user);
  return user.id || user.userId || user._id || null;  
});
  const [step, setStep] = useState('request');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);
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
   * Send OTP to user's email
   */
  const handleSendOTP = async () => {
    if (!userEmail) {
      setError('Email address not found. Please log in again.');
      return;
    }
    
    if (!userId) {
      setError('User ID not found. Please log in again.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        userId: userId,
        email: userEmail
      };
      
      console.log('📤 Sending OTP with payload:', payload);
      
      const response = await sendOtp(payload);
      
      console.log('📥 Send OTP response:', response);

      // Backend returns { message: "OTP sent. Check your email." }
      if (response && response.message) {
        setStep('verify');
        setSuccessMessage(response.message || `Verification code sent to ${userEmail}`);
        setResendTimer(60);
        setOtp(['', '', '', '', '', '']);

        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 100);
      } else {
        throw new Error('Failed to send OTP');
      }

    } catch (err) {
      console.error('Failed to send OTP:', err);
      setError(err.message || 'Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resend OTP with cooldown
   */
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setOtp(['', '', '', '', '', '']);
    setIsLoading(true);
    setError(null);

    try {
      const response = await resendOtp({
        userId: userId,
        email: userEmail
      });

      // Backend returns { message: "A new Otp has been sent to your mail." }
      if (response && response.message) {
        setSuccessMessage(response.message || 'New verification code sent!');
        setResendTimer(60);
        otpInputRefs.current[0]?.focus();
      } else {
        throw new Error('Failed to resend OTP');
      }

    } catch (err) {
      console.error('Failed to resend OTP:', err);
      setError(err.message || 'Failed to resend verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
   * Verify OTP with backend
   */
  const handleVerifyOTP = async (otpCode) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await verifyOtp({
        userId: userId,
        otp: otpCode
      });

      // Backend returns { message: "Email verified" }
      if (response && response.message) {
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
        throw new Error('Invalid verification code');
      }

    } catch (err) {
      console.error('Failed to verify OTP:', err);
      setError(err.message || 'Invalid verification code. Please try again.');
      setOtp(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manual submit button handler
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
   * Copy OTP to clipboard (for testing purposes)
   */
  const copyOTPToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };



  return (
    <div className="min-h-screen bg-black py-6 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Email Verification
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Confirm your email address to continue
          </p>
        </div>

        {userEmail && (
          <div className="mb-6 p-4 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl flex items-center gap-3">
            <Mail className="text-yellow-400 flex-shrink-0" size={24} />
            <div>
              <p className="text-sm text-yellow-400 font-medium">Verifying email</p>
              <p className="text-lg font-semibold text-white">{userEmail}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border-2 border-red-500/50 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-red-400 flex-shrink-0" size={24} />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {successMessage && !error && (
          <div className="mb-6 p-4 bg-green-900/20 border-2 border-green-500/50 rounded-xl flex items-center gap-3">
            <CheckCircle className="text-green-400 flex-shrink-0" size={24} />
            <p className="text-green-300">{successMessage}</p>
          </div>
        )}

        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-yellow-500/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(255,215,0,0.1)]">
          {/* STEP 1: Request OTP */}
          {step === 'request' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-500/20 border-2 border-yellow-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail size={40} className="text-yellow-400" />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">
                Send Verification Code
              </h3>
              <p className="text-gray-400 mb-6">
                We'll send a 6-digit verification code to your email
              </p>

              <button
                onClick={handleSendOTP}
                disabled={isLoading || !userEmail || !userId}
                className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-bold rounded-xl hover:shadow-[0_8px_24px_rgba(255,215,0,0.5)] hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2 "
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Code
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 2: Verify OTP */}
          {step === 'verify' && (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Enter Verification Code
                </h3>
                <p className="text-gray-400">
                  Enter the 6-digit code sent to your email
                </p>
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
                    className="w-12 h-14 text-center text-2xl font-bold bg-[#2a2a2a] text-white border-2 border-yellow-500/30 rounded-lg focus:border-yellow-400 focus:outline-none focus:shadow-[0_0_10px_rgba(255,215,0,0.3)] disabled:opacity-50 transition"
                  />
                ))}
              </div>

              {/* Verify Button */}
              <button
                onClick={handleManualSubmit}
                disabled={isLoading || otp.some(d => !d)}
                className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-bold rounded-xl hover:shadow-[0_8px_24px_rgba(255,215,0,0.5)] hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mb-4 cursor-pointer"
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
                <p className="text-sm text-gray-400 mb-2">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0 || isLoading}
                  className="text-yellow-400 hover:text-yellow-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto transition cursor-pointer"
                >
                  <RefreshCw size={16} />
                  {resendTimer > 0 ? (
                    `Resend in ${resendTimer}s`
                  ) : (
                    'Resend Code'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Success */}
          {step === 'success' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500/20 border-2 border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle size={40} className="text-green-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">
                Email Verified!
              </h3>
              <p className="text-gray-400 mb-4">
                Your email has been successfully verified
              </p>
              
              <div className="p-4 bg-green-500/10 border-2 border-green-500/30 rounded-xl">
                <p className="text-green-400 font-semibold">{userEmail}</p>
                <p className="text-sm text-green-500 mt-1">✓ Verified</p>
              </div>

              <div className="mt-6">
                <Loader className="animate-spin mx-auto text-yellow-400" size={24} />
                <p className="text-sm text-gray-400 mt-2">
                  Moving to next step...
                </p>
              </div>
            </div>
          )}
        </div>

        {step === 'request' && (
          <div className="mt-6 p-4 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-[#2a2a2a] rounded-xl">
            <h4 className="font-semibold text-white mb-3 text-sm">Why verify email?</h4>
            <ul className="text-xs text-gray-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">•</span>
                <span>Ensures account security</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">•</span>
                <span>Prevents unauthorized access</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">•</span>
                <span>Allows password recovery</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">•</span>
                <span>Required for trust score calculation</span>
              </li>
            </ul>
          </div>
        )}

        {step === 'verify' && (
          <div className="mt-6 p-4 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl">
            <h4 className="font-semibold text-yellow-400 mb-3 text-sm">📧 Check Your Email</h4>
            <ul className="text-xs text-yellow-200/80 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">•</span>
                <span>Check your inbox for the verification code</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">•</span>
                <span>The code is valid for 30 seconds</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">•</span>
                <span>Don't see it? Check your spam folder</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">•</span>
                <span>You can request a new code after 60 seconds</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
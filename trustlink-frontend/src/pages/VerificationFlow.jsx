// src/pages/VerificationFlow.jsx
// Updated to show overview page first, then navigate to individual verification steps
// Now supports background GPS tracking across all pages

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Loader, 
  Camera, 
  MapPin, 
  Smartphone, 
  Mail, 
  Users,
  Award
} from 'lucide-react';

// Import verification components
import VerificationOverview from '../components/verification/VerificationOverview';
import LivenessDetection from '../components/verification/LivenessDetection';
import GPSTracking from '../components/verification/GPSTracking';
import DeviceFingerprint from '../components/verification/DeviceFingerprint';
import EmailVerification from '../components/verification/EmailVerification';
import CommunityVouch from '../components/verification/CommunityVouch';
import TrustScore from '../components/verification/TrustScore';

import { getVerificationProgress } from '../services/api';

// Timer Widget Component - Shown globally when GPS is active
const TimerWidget = ({ timeRemaining, onGameClick }) => {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-40 flex gap-3">
      {/* Timer */}
      <div className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-bold rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] border-2 border-yellow-500">
        <div className="flex items-center gap-2">
          <span className="text-lg">⏱️</span>
          <span className="text-sm">{formatTime(timeRemaining)}</span>
        </div>
      </div>

      {/* Game Button */}
      {onGameClick && (
        <button
          onClick={onGameClick}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all flex items-center gap-2 text-sm animate-pulse"
        >
          <span>🎮</span>
          Play
        </button>
      )}
    </div>
  );
};

const VerificationFlow = ({ onVerificationComplete }) => {
  const navigate = useNavigate();

  // Get session ID from localStorage/sessionStorage (set during login)
  const [sessionId] = useState(() => {
    return sessionStorage.getItem('sessionId') || 'demo_session_123';
  });

  // Show overview page or individual step
  const [showOverview, setShowOverview] = useState(true);
  const [selectedStep, setSelectedStep] = useState(null);

  // Current step in verification process
  const [currentStep, setCurrentStep] = useState(0);
  
  // Track completion status of each step
  const [stepStatus, setStepStatus] = useState({
    identity: false,      // Liveness detection
    address: false,       // GPS tracking
    device: false,        // Device fingerprint
    email: false,         // Email verification
    community: false,     // Community vouches
    trustScore: false     // Final score
  });

  // Track GPS tracking state across navigation
  const [gpsTrackingActive, setGpsTrackingActive] = useState(false);
  const [gpsTrackingData, setGpsTrackingData] = useState(null);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Define all verification steps
  const VERIFICATION_STEPS = [
    {
      id: 'identity',
      title: 'Identity Verification',
      description: 'Verify your identity with facial recognition',
      icon: Camera,
      color: 'blue',
      component: LivenessDetection,
      estimatedTime: '2 min'
    },
    {
      id: 'address',
      title: 'Address Verification',
      description: 'Verify your location by moving around',
      icon: MapPin,
      color: 'green',
      component: GPSTracking,
      estimatedTime: '1-2 min'
    },
    {
      id: 'device',
      title: 'Device Verification',
      description: 'Register your device fingerprint',
      icon: Smartphone,
      color: 'purple',
      component: DeviceFingerprint,
      estimatedTime: '30 sec'
    },
    {
      id: 'email',
      title: 'Email Verification',
      description: 'Verify your email address',
      icon: Mail,
      color: 'orange',
      component: EmailVerification,
      estimatedTime: '1 min'
    },
    {
      id: 'community',
      title: 'Community Trust',
      description: 'Add referees who can vouch for you',
      icon: Users,
      color: 'pink',
      component: CommunityVouch,
      estimatedTime: '2 min'
    },
    {
      id: 'trustScore',
      title: 'Trust Score',
      description: 'View your verification results',
      icon: Award,
      color: 'yellow',
      component: TrustScore,
      estimatedTime: '1 min'
    }
  ];

  // =============================================================================
  // INITIALIZATION - Load existing progress
  // =============================================================================

  useEffect(() => {
    loadVerificationProgress();
  }, []);

  /**
   * Load user's verification progress from backend
   */
  const loadVerificationProgress = async () => {
    setIsLoading(true);
    try {
      // Fetch progress from backend
      const progress = await getVerificationProgress(sessionId);
      
      // Update step status based on what's already completed
      setStepStatus(progress);
      
    } catch (err) {
      console.error('Failed to load progress:', err);
      // Continue with fresh state if loading fails
    } finally {
      setIsLoading(false);
    }
  };

  // =============================================================================
  // GPS TRACKING MANAGEMENT
  // =============================================================================

  /**
   * Update GPS timer every second
   */
  useEffect(() => {
    if (!gpsTrackingActive || !gpsTrackingData) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - gpsTrackingData.startTime) / 1000);
      const remaining = Math.max(gpsTrackingData.duration - elapsed, 0);

      setGpsTrackingData(prev => ({
        ...prev,
        timeRemaining: remaining
      }));

      // GPS tracking completed
      if (remaining === 0) {
        console.log('🎉 GPS tracking completed!');
        setGpsTrackingActive(false);
        setGpsTrackingData(null);
        
        // Mark address verification as complete
        setStepStatus(prev => ({
          ...prev,
          address: true
        }));

        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gpsTrackingActive, gpsTrackingData]);

  // =============================================================================
  // STEP NAVIGATION
  // =============================================================================

  /**
   * Handle click on a step from the overview page
   * @param {string} stepId - ID of the step to navigate to
   */
  const handleStepClick = (stepId) => {
    setSelectedStep(stepId);
    setShowOverview(false);
    
    // Find the step index
    const stepIndex = VERIFICATION_STEPS.findIndex(step => step.id === stepId);
    setCurrentStep(stepIndex);
  };

  /**
   * Handle completion of current verification step
   * @param {Object} data - Data returned from verification component
   */
  const handleStepComplete = (data) => {
    const currentStepId = selectedStep;
    
    console.log(`✓ Step completed: ${currentStepId}`, data);

    // Mark current step as complete
    setStepStatus(prev => ({
      ...prev,
      [currentStepId]: true
    }));

    // If GPS tracking completed, clear the active state
    if (currentStepId === 'address') {
      setGpsTrackingActive(false);
      setGpsTrackingData(null);
    }

    // Return to overview
    setShowOverview(true);
    setSelectedStep(null);
  };

  /**
   * Handle GPS tracking started - allows continuation to other steps
   * @param {Object} trackingInfo - Information about the tracking session
   */
  const handleGpsTrackingStarted = (trackingInfo) => {
    console.log('GPS tracking started, user can continue to other steps', trackingInfo);
    setGpsTrackingActive(true);
    setGpsTrackingData(trackingInfo);
  };

  /**
   * Handle completion of TrustScore verification
   * This is called when all verification steps are complete
   */
  const handleVerificationComplete = (data) => {
    console.log('🎉 All verification steps completed!', data);
    
    // Mark trust score as complete locally
    setStepStatus(prev => ({
      ...prev,
      trustScore: true
    }));

    // Call parent's callback to update user state in App.jsx
    if (onVerificationComplete) {
      onVerificationComplete(data);
    }
  };

  // =============================================================================
  // PROGRESS CALCULATION
  // =============================================================================

  /**
   * Calculate overall progress percentage
   */
  const calculateProgress = () => {
    const completedSteps = Object.values(stepStatus).filter(Boolean).length;
    return Math.round((completedSteps / VERIFICATION_STEPS.length) * 100);
  };

  const overallProgress = calculateProgress();

  // =============================================================================
  // RENDER COMPONENTS
  // =============================================================================

  /**
   * Render the current step's component
   */
  const renderCurrentStep = () => {
    const step = VERIFICATION_STEPS[currentStep];
    const StepComponent = step.component;

    if (!StepComponent) {
      // Placeholder for components not yet created
      return (
        <div style={{
          minHeight: '100vh',
          background: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%)',
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '600px',
            width: '100%',
            textAlign: 'center',
            border: '2px solid rgba(255, 215, 0, 0.3)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: '#2a2a2a',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <step.icon size={40} color="#666" />
            </div>
            <h3 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '16px'
            }}>
              {step.title}
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#a0a0a0',
              marginBottom: '32px'
            }}>
              {step.description}
            </p>
            <p style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '32px'
            }}>
              This component will be implemented next.
            </p>
            <button
              onClick={() => {
                setShowOverview(true);
                setSelectedStep(null);
              }}
              style={{
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                border: '2px solid #ffd700',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                color: '#0a0a0a',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Back to Overview
            </button>
          </div>
        </div>
      );
    }

    // Render TrustScore component with special onComplete handler
    if (step.id === 'trustScore') {
      return (
        <TrustScore 
          sessionId={sessionId} 
          onComplete={handleVerificationComplete}
          navigate={navigate}
        />
      );
    }

    // Render other verification components
    return (
      <StepComponent 
        sessionId={sessionId} 
        onComplete={handleStepComplete}
        onNext={() => {
          setShowOverview(true);
          setSelectedStep(null);
        }}
        // Pass GPS tracking props for GPSTracking component
        onTrackingStarted={step.id === 'address' ? handleGpsTrackingStarted : undefined}
        gpsTrackingActive={gpsTrackingActive}
        gpsTrackingData={gpsTrackingData}
      />
    );
  };

  // =============================================================================
  // LOADING STATE
  // =============================================================================

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Loader 
            style={{
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }} 
            size={48} 
            color="#ffd700" 
          />
          <p style={{
            fontSize: '18px',
            color: '#a0a0a0'
          }}>
            Loading verification progress...
          </p>
        </div>
      </div>
    );
  }

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <>
      {showOverview ? (
        // Show verification overview page
        <VerificationOverview 
          stepStatus={stepStatus}
          onStepClick={handleStepClick}
          overallProgress={overallProgress}
          gpsTrackingActive={gpsTrackingActive}
        />
      ) : (
        // Show individual verification step
        renderCurrentStep()
      )}

      {/* Global GPS Timer Widget - Shows on all pages when GPS is active */}
      {gpsTrackingActive && gpsTrackingData && (
        <TimerWidget 
          timeRemaining={gpsTrackingData.timeRemaining}
          onGameClick={() => {
            // This could open the game globally
            console.log('Game clicked from global widget - implement game modal here');
          }}
        />
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default VerificationFlow;
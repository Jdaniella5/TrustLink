// src/pages/VerificationFlow.jsx
// FIXED: Now properly calls parent's onVerificationComplete to update App.jsx state

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Circle, 
  Loader, 
  Camera, 
  MapPin, 
  Smartphone, 
  Mail, 
  Users,
  Award,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

// Import verification components
import LivenessDetection from '../components/verification/LivenessDetection';
import GPSTracking from '../components/verification/GPSTracking';
import DeviceFingerprint from '../components/verification/DeviceFingerprint';
import EmailVerification from '../components/verification/EmailVerification';
import CommunityVouch from '../components/verification/CommunityVouch';
import TrustScore from '../components/verification/TrustScore';

import { getVerificationProgress } from '../services/api';

// FIXED: Added onVerificationComplete prop
const VerificationFlow = ({ onVerificationComplete }) => {
  const navigate = useNavigate();

  // Get session ID from localStorage/sessionStorage (set during login)
  const [sessionId] = useState(() => {
    return sessionStorage.getItem('sessionId') || 'demo_session_123';
  });

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
      
      // Find first incomplete step
      const firstIncompleteIndex = VERIFICATION_STEPS.findIndex(
        step => !progress[step.id]
      );
      
      // Set current step to first incomplete, or last step if all complete
      setCurrentStep(firstIncompleteIndex >= 0 ? firstIncompleteIndex : VERIFICATION_STEPS.length - 1);
      
    } catch (err) {
      console.error('Failed to load progress:', err);
      // Continue with fresh state if loading fails
    } finally {
      setIsLoading(false);
    }
  };

  // =============================================================================
  // STEP NAVIGATION
  // =============================================================================

  /**
   * Handle completion of current verification step
   * @param {Object} data - Data returned from verification component
   */
  const handleStepComplete = (data) => {
    const currentStepId = VERIFICATION_STEPS[currentStep].id;
    
    console.log(`✓ Step completed: ${currentStepId}`, data);

    // Mark current step as complete
    setStepStatus(prev => ({
      ...prev,
      [currentStepId]: true
    }));

    // Move to next step
    if (currentStep < VERIFICATION_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  /**
   * Handle completion of TrustScore verification
   * FIXED: Now calls parent's onVerificationComplete to update App.jsx state
   */
  const handleVerificationComplete = (data) => {
    console.log('🎉 All verification steps completed!', data);
    
    // Mark trust score as complete locally
    setStepStatus(prev => ({
      ...prev,
      trustScore: true
    }));

    // CRITICAL FIX: Call parent's callback to update user state in App.jsx
    // This updates verificationStatus to 'completed' so routing works correctly
    if (onVerificationComplete) {
      onVerificationComplete(data);
    }
  };

  /**
   * Skip current step (for testing purposes - remove in production)
   */
  const skipCurrentStep = () => {
    const currentStepId = VERIFICATION_STEPS[currentStep].id;
    
    // Mark as complete
    setStepStatus(prev => ({
      ...prev,
      [currentStepId]: true
    }));

    // Move to next step
    if (currentStep < VERIFICATION_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  /**
   * Go back to previous step
   */
  const goToPreviousStep = () => {
    // Cannot go back from trust score step
    if (currentStep > 0 && currentStep !== VERIFICATION_STEPS.length - 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  /**
   * Navigate to specific step (only if previous steps are complete)
   * @param {number} stepIndex - Index of step to navigate to
   */
  const goToStep = (stepIndex) => {
    // Cannot navigate to trust score until all verification steps are complete
    if (stepIndex === VERIFICATION_STEPS.length - 1) {
      const allStepsComplete = VERIFICATION_STEPS.slice(0, -1).every(
        step => stepStatus[step.id]
      );
      if (!allStepsComplete) return;
    }

    // Check if all previous steps are complete
    const canNavigate = VERIFICATION_STEPS.slice(0, stepIndex).every(
      (step, index) => stepStatus[step.id] || index === currentStep
    );

    if (canNavigate) {
      setCurrentStep(stepIndex);
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
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <step.icon size={40} className="text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{step.title}</h3>
          <p className="text-gray-600 mb-6">{step.description}</p>
          <p className="text-sm text-gray-500 mb-6">
            This component will be implemented next.
          </p>
          <button
            onClick={skipCurrentStep}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Skip for Now (Testing)
          </button>
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
      />
    );
  };

  // =============================================================================
  // LOADING STATE
  // =============================================================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
          <p className="text-gray-600 text-lg">Loading verification progress...</p>
        </div>
      </div>
    );
  }

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  const currentStepData = VERIFICATION_STEPS[currentStep];
  const overallProgress = calculateProgress();
  const isTrustScoreStep = currentStep === VERIFICATION_STEPS.length - 1;
  const allVerificationStepsComplete = VERIFICATION_STEPS.slice(0, -1).every(
    step => stepStatus[step.id]
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Trust Verification</h1>
              <p className="text-gray-600 mt-1">
                {isTrustScoreStep 
                  ? 'View your Trust Score and verification results'
                  : 'Complete all steps to get your Trust Score'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-500">{overallProgress}%</div>
              <p className="text-sm text-gray-600">Complete</p>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Step Navigator */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            {VERIFICATION_STEPS.map((step, index) => {
              const isComplete = stepStatus[step.id];
              const isCurrent = index === currentStep;
              const Icon = step.icon;
              
              // Trust Score can only be accessed if all verification steps are complete
              const isTrustScoreStep = step.id === 'trustScore';
              const canAccess = isTrustScoreStep 
                ? allVerificationStepsComplete
                : VERIFICATION_STEPS.slice(0, index).every(
                    (s, i) => stepStatus[s.id] || i === currentStep
                  );

              return (
                <React.Fragment key={step.id}>
                  {/* Step Circle */}
                  <button
                    onClick={() => goToStep(index)}
                    disabled={!canAccess}
                    className={`flex flex-col items-center gap-2 transition ${
                      canAccess ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                    }`}
                    title={!canAccess && isTrustScoreStep ? 'Complete all verification steps first' : ''}
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition ${
                        isComplete
                          ? 'bg-green-500 text-white'
                          : isCurrent
                          ? `bg-${step.color}-500 text-white`
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {isComplete ? (
                        <CheckCircle size={32} />
                      ) : (
                        <Icon size={32} />
                      )}
                    </div>
                    <div className="text-center">
                      <p className={`text-xs font-medium ${
                        isCurrent ? 'text-gray-800' : 'text-gray-600'
                      }`}>
                        {step.title.split(' ')[0]}
                      </p>
                      {isCurrent && (
                        <p className="text-xs text-blue-500 font-semibold">Current</p>
                      )}
                    </div>
                  </button>

                  {/* Connecting Line */}
                  {index < VERIFICATION_STEPS.length - 1 && (
                    <div className="flex-1 h-1 mx-2">
                      <div
                        className={`h-full rounded ${
                          stepStatus[step.id] ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Current Step Info */}
        <div className={`border rounded-lg p-4 mb-6 ${
          isTrustScoreStep
            ? 'bg-yellow-50 border-yellow-200'
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-${currentStepData.color}-500 rounded-full flex items-center justify-center`}>
                <currentStepData.icon size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{currentStepData.title}</h3>
                <p className="text-sm text-gray-600">{currentStepData.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Estimated time</p>
              <p className="font-semibold text-gray-800">{currentStepData.estimatedTime}</p>
            </div>
          </div>
        </div>

        {/* Current Step Component */}
        <div className="mb-6">
          {renderCurrentStep()}
        </div>

        {/* Navigation Buttons */}
        {!isTrustScoreStep && (
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={20} />
              Previous
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Step {currentStep + 1} of {VERIFICATION_STEPS.length}
              </p>
            </div>

            <button
              onClick={skipCurrentStep}
              className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Skip (Testing)
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationFlow;
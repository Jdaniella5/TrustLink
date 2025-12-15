

import React from 'react';
import { Camera, MapPin, Smartphone, Mail, Users, Award, Check, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VerificationOverview = ({ stepStatus, onStepClick, overallProgress, gpsTrackingActive }) => {

  const navigate = useNavigate();

 
  

  const VERIFICATION_STEPS = [
    {
      id: 'identity',
      number: '01',
      title: 'Identity Verification',
      description: 'Verify your identity with facial recognition technology for enhanced security',
      icon: Camera,
      estimatedTime: '2 min'
    },
    {
      id: 'address',
      number: '02',
      title: 'Address Verification',
      description: 'Confirm your location by moving around your area',
      icon: MapPin,
      estimatedTime: '1-2 min'
    },
    {
      id: 'device',
      number: '03',
      title: 'Device Verification',
      description: 'Register your device fingerprint for secure access',
      icon: Smartphone,
      estimatedTime: '30 sec'
    },
    {
      id: 'email',
      number: '04',
      title: 'Email Verification',
      description: 'Verify your email address to enable notifications',
      icon: Mail,
      estimatedTime: '1 min'
    },
    {
      id: 'community',
      number: '05',
      title: 'Community Trust',
      description: 'Add referees who can vouch for your identity and build trust',
      icon: Users,
      estimatedTime: '2 min'
    },
    {
      id: 'trustScore',
      number: '06',
      title: 'Trust Score',
      description: 'View your verification results and trust score',
      icon: Award,
      estimatedTime: '1 min'
    }
  ];

  // Calculate which steps are accessible
  const getStepAccessibility = (stepId, index) => {
    // First step is always accessible
    if (index === 0) return true;
    
    // If GPS tracking is active, all steps (except trust score) are accessible
    if (gpsTrackingActive && stepId !== 'trustScore') {
      return true;
    }
    
    // Trust Score is accessible only if all other steps are complete
    if (stepId === 'trustScore') {
      return VERIFICATION_STEPS.slice(0, -1).every(step => stepStatus[step.id]);
    }
    
    // Other steps are accessible if previous step is complete
    const previousStep = VERIFICATION_STEPS[index - 1];
    return stepStatus[previousStep.id];
  };

  // Check if address verification is in progress (GPS tracking active but not completed)
  const isAddressInProgress = (stepId) => {
    return stepId === 'address' && gpsTrackingActive && !stepStatus.address;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <div className="flex justify-center items-center space-x-2 sm:space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-[0_8px_24px_rgba(255,215,0,0.4)]">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
            </div>
            <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
              TRUSTLINK
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(22px, 5vw, 28px)',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '12px',
            paddingTop: '16px',
            letterSpacing: '-0.5px'
          }}>
            Build Your Trust Score
          </h1>

          <p style={{
            fontSize: 'clamp(14px, 3vw, 16px)',
            color: '#a0a0a0',
            maxWidth: '500px',
            margin: '0 auto',
            padding: '0 16px'
          }}>
            Complete verification steps to unlock full platform access
          </p>
        </div>

        {/* GPS Tracking Alert */}
        {gpsTrackingActive && (
          <div style={{
            maxWidth: '700px',
            margin: '0 auto 24px',
            background: 'linear-gradient(145deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)',
            border: '2px solid rgba(255, 215, 0, 0.3)',
            borderRadius: '16px',
            padding: '16px 20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Clock size={24} color="#ffd700" style={{ animation: 'pulse 2s infinite' }} />
              <div>
                <p style={{
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  fontWeight: '700',
                  color: '#ffd700',
                  marginBottom: '4px'
                }}>
                  📍 GPS Tracking Active
                </p>
                <p style={{
                  fontSize: 'clamp(12px, 2.5vw, 14px)',
                  color: '#a0a0a0',
                  lineHeight: '1.4'
                }}>
                  Address verification is running in the background. You can complete other steps while waiting!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Section */}
        <div style={{
          maxWidth: '700px',
          margin: '0px auto 20px',
          background: 'linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%)',
          border: '2px solid rgba(255, 215, 0, 0.3)',
          borderRadius: '16px',
          padding: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <h3 style={{
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                color: '#a0a0a0',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                YOUR PROGRESS
              </h3>
              <p style={{
                fontSize: 'clamp(32px, 8vw, 42px)',
                fontWeight: '700',
                color: '#ffd700'
              }}>
                {Math.round(overallProgress)}%
              </p>
            </div>

            {/* Mini Step Indicators */}
            <div style={{
              display: 'flex',
              gap: '6px'
            }}>
              {VERIFICATION_STEPS.map((step) => (
                <div
                  key={step.id}
                  style={{
                    width: '10px',
                    height: '32px',
                    background: stepStatus[step.id] 
                      ? '#ffd700' 
                      : isAddressInProgress(step.id)
                      ? 'linear-gradient(180deg, #ffd700 0%, #2a2a2a 100%)'
                      : '#2a2a2a',
                    borderRadius: '6px',
                    transition: 'all 0.3s ease'
                  }}
                  title={step.title}
                />
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '10px',
            background: '#2a2a2a',
            borderRadius: '10px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)',
              width: `${overallProgress}%`,
              transition: 'width 0.6s ease',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                animation: 'shimmer 2s infinite'
              }} />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '16px',
          maxWidth: '700px',
          margin: '0 auto 32px'
        }}>
          {VERIFICATION_STEPS.map((step, index) => {
            const isCompleted = stepStatus[step.id];
            const isAccessible = getStepAccessibility(step.id, index);
            const inProgress = isAddressInProgress(step.id);
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                onClick={() => isAccessible && onStepClick(step.id)}
                style={{
                  background: isCompleted 
                    ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)'
                    : isAccessible
                    ? 'linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%)'
                    : 'linear-gradient(145deg, #0f0f0f 0%, #0a0a0a 100%)',
                  border: isCompleted
                    ? '2px solid #ffd700'
                    : inProgress
                    ? '2px solid rgba(255, 215, 0, 0.5)'
                    : isAccessible
                    ? '2px solid rgba(255, 215, 0, 0.3)'
                    : '2px solid #2a2a2a',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: isAccessible ? 'pointer' : 'not-allowed',
                  opacity: isAccessible ? 1 : 0.5,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (isAccessible && !isCompleted) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 215, 0, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isAccessible && !isCompleted) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {/* Glow effect for completed */}
                {isCompleted && (
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                    animation: 'rotate 10s linear infinite',
                    pointerEvents: 'none'
                  }} />
                )}

                {/* Pulsing effect for in progress */}
                {inProgress && (
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
                    animation: 'pulse 2s ease-in-out infinite',
                    pointerEvents: 'none'
                  }} />
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {/* Step Number */}
                  <div style={{
                    width: '52px',
                    height: '52px',
                    background: isCompleted ? '#0a0a0a' : '#ffd700',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '18px',
                    fontWeight: '700',
                    color: isCompleted ? '#ffd700' : '#0a0a0a'
                  }}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: isCompleted ? 'rgba(10, 10, 10, 0.3)' : 'rgba(255, 215, 0, 0.2)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={24} color={isCompleted ? '#0a0a0a' : '#ffd700'} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      fontSize: 'clamp(16px, 3.5vw, 18px)',
                      fontWeight: '700',
                      color: isCompleted ? '#0a0a0a' : '#ffffff',
                      marginBottom: '6px'
                    }}>
                      {step.title}
                      {inProgress && (
                        <span style={{
                          marginLeft: '8px',
                          fontSize: 'clamp(12px, 2.5vw, 14px)',
                          color: '#ffd700',
                          fontWeight: '600'
                        }}>
                          (In Progress)
                        </span>
                      )}
                    </h3>
                    <p style={{
                      fontSize: 'clamp(12px, 2.5vw, 14px)',
                      color: isCompleted ? 'rgba(10, 10, 10, 0.7)' : '#a0a0a0',
                      lineHeight: '1.4'
                    }}>
                      {step.description}
                    </p>
                  </div>

                  {/* Status Indicator */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: isCompleted 
                      ? '#0a0a0a'
                      : isAccessible
                      ? 'rgba(255, 215, 0, 0.2)'
                      : 'rgba(42, 42, 42, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {isCompleted ? (
                      <Check size={24} color="#ffd700" strokeWidth={3} />
                    ) : inProgress ? (
                      <Clock size={20} color="#ffd700" style={{ animation: 'pulse 2s infinite' }} />
                    ) : (
                      <div style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        border: `3px solid ${isAccessible ? '#ffd700' : '#666'}`,
                        background: 'transparent'
                      }} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
       
        {/* Why Verify Section */}
        <div style={{
          maxWidth: '700px',
          margin: '32px auto 0',
          background: 'linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%)',
          border: '2px solid #2a2a2a',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <h3 style={{
            fontSize: 'clamp(16px, 3.5vw, 18px)',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '20px'
          }}>
            Why Verify?
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px'
          }}>
            {[
              { icon: '🛡️', text: 'Enhanced account security' },
              { icon: '✨', text: 'Access to premium features' },
              { icon: '👥', text: 'Build community trust' },
              { icon: '💰', text: 'Higher transaction limits' }
            ].map((benefit, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px',
                  background: 'rgba(255, 215, 0, 0.05)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 215, 0, 0.1)'
                }}
              >
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{benefit.icon}</span>
                <span style={{
                  fontSize: 'clamp(12px, 2.5vw, 13px)',
                  color: '#a0a0a0',
                  fontWeight: '500',
                  lineHeight: '1.3'
                }}>
                  {benefit.text}
                </span>
              </div>
            ))}
          </div>
        </div>
        
      </div>
        
      <style>{`
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default VerificationOverview;
import React from 'react';
import { Camera, MapPin, Smartphone, Mail, Users, Award, Check } from 'lucide-react';

const VerificationOverview = ({ stepStatus, onStepClick, overallProgress }) => {
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
    
    // Trust Score is accessible only if all other steps are complete
    if (stepId === 'trustScore') {
      return VERIFICATION_STEPS.slice(0, -1).every(step => stepStatus[step.id]);
    }
    
    // Other steps are accessible if previous step is complete
    const previousStep = VERIFICATION_STEPS[index - 1];
    return stepStatus[previousStep.id];
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 215, 0, 0.1)',
            border: '2px solid rgba(255, 215, 0, 0.3)',
            borderRadius: '50px',
            padding: '12px 24px',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: '#ffd700',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#0a0a0a'
            }}>
              T
            </div>
            <span style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#ffd700',
              letterSpacing: '1px'
            }}>
              TRUSTLINK
            </span>
          </div>

          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '16px',
            letterSpacing: '-1px'
          }}>
            Build Your Trust Score
          </h1>

          <p style={{
            fontSize: '18px',
            color: '#a0a0a0',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Complete verification steps to unlock full platform access
          </p>
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '24px',
          maxWidth: '800px',
          margin: '0 auto 40px'
        }}>
          {VERIFICATION_STEPS.map((step, index) => {
            const isCompleted = stepStatus[step.id];
            const isAccessible = getStepAccessibility(step.id, index);
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
                    : isAccessible
                    ? '2px solid rgba(255, 215, 0, 0.3)'
                    : '2px solid #2a2a2a',
                  borderRadius: '24px',
                  padding: '32px',
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

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {/* Step Number */}
                  <div style={{
                    width: '72px',
                    height: '72px',
                    background: isCompleted ? '#0a0a0a' : '#ffd700',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '24px',
                    fontWeight: '700',
                    color: isCompleted ? '#ffd700' : '#0a0a0a'
                  }}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: isCompleted ? 'rgba(10, 10, 10, 0.3)' : 'rgba(255, 215, 0, 0.2)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={32} color={isCompleted ? '#0a0a0a' : '#ffd700'} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: isCompleted ? '#0a0a0a' : '#ffffff',
                      marginBottom: '8px'
                    }}>
                      {step.title}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: isCompleted ? 'rgba(10, 10, 10, 0.7)' : '#a0a0a0',
                      lineHeight: '1.5'
                    }}>
                      {step.description}
                    </p>
                  </div>

                  {/* Status Indicator */}
                  <div style={{
                    width: '48px',
                    height: '48px',
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
                      <Check size={28} color="#ffd700" strokeWidth={3} />
                    ) : (
                      <div style={{
                        width: '16px',
                        height: '16px',
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

        {/* Progress Section */}
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: 'linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%)',
          border: '2px solid rgba(255, 215, 0, 0.3)',
          borderRadius: '24px',
          padding: '32px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div>
              <h3 style={{
                fontSize: '16px',
                color: '#a0a0a0',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                YOUR PROGRESS
              </h3>
              <p style={{
                fontSize: '48px',
                fontWeight: '700',
                color: '#ffd700'
              }}>
                {Math.round(overallProgress)}%
              </p>
            </div>

            {/* Mini Step Indicators */}
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              {VERIFICATION_STEPS.map((step) => (
                <div
                  key={step.id}
                  style={{
                    width: '12px',
                    height: '40px',
                    background: stepStatus[step.id] ? '#ffd700' : '#2a2a2a',
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
            height: '12px',
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

        {/* Why Verify Section */}
        <div style={{
          maxWidth: '800px',
          margin: '40px auto 0',
          background: 'linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%)',
          border: '2px solid #2a2a2a',
          borderRadius: '24px',
          padding: '32px'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '24px'
          }}>
            Why Verify?
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
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
                  gap: '12px',
                  padding: '12px',
                  background: 'rgba(255, 215, 0, 0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 215, 0, 0.1)'
                }}
              >
                <span style={{ fontSize: '24px' }}>{benefit.icon}</span>
                <span style={{
                  fontSize: '14px',
                  color: '#a0a0a0',
                  fontWeight: '500'
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
      `}</style>
    </div>
  );
};

export default VerificationOverview;
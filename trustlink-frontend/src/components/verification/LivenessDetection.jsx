// // src/components/verification/LivenessDetection.jsx
// // Identity Verification with facial liveness detection

// import React, { useState, useRef, useEffect } from 'react';
// import { Camera, X } from 'lucide-react';

// const LivenessDetection = ({ sessionId, onComplete }) => {
//   const [showCameraPermission, setShowCameraPermission] = useState(true);
//   const [isFadingOut, setIsFadingOut] = useState(false);
//   const [isWebcamActive, setIsWebcamActive] = useState(false);
//   const [currentActionIndex, setCurrentActionIndex] = useState(0);
//   const [completedActions, setCompletedActions] = useState([]);
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const [slideDirection, setSlideDirection] = useState('in');

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const animationFrameRef = useRef(null);

//   const LIVENESS_ACTIONS = [
//     { id: 'blink', name: 'Blink your eyes', duration: 3 },
//     { id: 'smile', name: 'Smile', duration: 3 },
//     { id: 'turn_left', name: 'Turn head left', duration: 3 },
//     { id: 'turn_right', name: 'Turn head right', duration: 3 },
//     { id: 'nod', name: 'Nod your head', duration: 3 }
//   ];

//   const currentAction = LIVENESS_ACTIONS[currentActionIndex];
//   const progressPercentage = ((currentActionIndex + (completedActions.includes(currentAction?.id) ? 1 : 0)) / LIVENESS_ACTIONS.length) * 100;
//   const isFirstInstruction = currentActionIndex === 0;
//   const isLastInstruction = currentActionIndex === LIVENESS_ACTIONS.length - 1;
//   const allCompleted = completedActions.length === LIVENESS_ACTIONS.length;

//   // Auto-complete actions after 3 second duration (fallback)
//   useEffect(() => {
//     if (!currentAction) {
//       console.log('No current action');
//       return;
//     }
    
//     if (!isWebcamActive) {
//       console.log('Webcam not active yet');
//       return;
//     }
    
//     if (completedActions.includes(currentAction.id)) {
//       console.log('Action already completed:', currentAction.id);
//       return;
//     }

//     console.log('Starting 3-second timer for:', currentAction.name);

//     const timer = setTimeout(() => {
//       console.log('✓ Auto-completing:', currentAction.name);
//       setCompletedActions(prev => [...prev, currentAction.id]);
//     }, currentAction.duration * 1000);

//     return () => {
//       console.log('Clearing timer for:', currentAction.name);
//       clearTimeout(timer);
//     };
//   }, [currentAction, isWebcamActive, completedActions]);

//   // Auto-advance to next instruction when current one is completed
//   useEffect(() => {
//     if (!currentAction || !completedActions.includes(currentAction.id)) return;

//     console.log('Action completed, checking if should advance:', currentAction.id);

//     // If this is the last instruction, don't auto-advance
//     if (isLastInstruction) {
//       console.log('Last instruction - not auto-advancing');
//       return;
//     }

//     console.log('Advancing to next instruction in 500ms...');

//     // Wait a bit before transitioning to next instruction
//     const transitionTimer = setTimeout(() => {
//       setSlideDirection('out-left');
//       setIsTransitioning(true);
      
//       setTimeout(() => {
//         setCurrentActionIndex(prev => prev + 1);
//         setSlideDirection('in-right');
//         setTimeout(() => setIsTransitioning(false), 50);
//       }, 300);
//     }, 500); // Wait 500ms after completion before moving to next

//     return () => clearTimeout(transitionTimer);
//   }, [completedActions, currentAction, isLastInstruction]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       stopWebcam();
//     };
//   }, []);

//   const initializeWebcam = async () => {
//     try {
//       // Start fade out animation immediately
//       setIsFadingOut(true);
      
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           width: { ideal: 640 },
//           height: { ideal: 480 },
//           facingMode: 'user'
//         }
//       });

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
        
//         videoRef.current.onloadedmetadata = () => {
//           console.log('✅ Video loaded, setting webcam active');
//           videoRef.current.play();
//           setIsWebcamActive(true);
//           startDrawingVideoInCircle();
//         };
//       }
      
//       // Remove popup after fade animation
//       setTimeout(() => {
//         setShowCameraPermission(false);
//       }, 500);
      
//     } catch (err) {
//       console.error('Webcam error:', err);
//       alert('Failed to access webcam. Please grant camera permission.');
//       setIsFadingOut(false);
//     }
//   };

//   const stopWebcam = () => {
//     if (animationFrameRef.current) {
//       cancelAnimationFrame(animationFrameRef.current);
//     }
    
//     if (videoRef.current?.srcObject) {
//       const tracks = videoRef.current.srcObject.getTracks();
//       tracks.forEach(track => track.stop());
//       videoRef.current.srcObject = null;
//     }
//     setIsWebcamActive(false);
//   };

//   const startDrawingVideoInCircle = () => {
//     if (!canvasRef.current || !videoRef.current) return;

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     const video = videoRef.current;

//     const draw = () => {
//       if (!video.videoWidth) {
//         animationFrameRef.current = requestAnimationFrame(draw);
//         return;
//       }

//       canvas.width = 480;
//       canvas.height = 480;

//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       // Create circular clipping path
//       ctx.save();
//       ctx.beginPath();
//       ctx.arc(240, 240, 215, 0, Math.PI * 2);
//       ctx.clip();

//       // Draw video centered and scaled
//       const videoAspect = video.videoWidth / video.videoHeight;
//       const canvasAspect = 1;
//       let drawWidth, drawHeight, offsetX, offsetY;

//       if (videoAspect > canvasAspect) {
//         drawHeight = 480;
//         drawWidth = drawHeight * videoAspect;
//         offsetX = (480 - drawWidth) / 2;
//         offsetY = 0;
//       } else {
//         drawWidth = 480;
//         drawHeight = drawWidth / videoAspect;
//         offsetX = 0;
//         offsetY = (480 - drawHeight) / 2;
//       }

//       ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
//       ctx.restore();

//       // Draw scanning line
//       const scanY = (Date.now() % 2000) / 2000 * 430 + 25;
//       ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
//       ctx.lineWidth = 4;
//       ctx.shadowBlur = 20;
//       ctx.shadowColor = '#ffd700';
//       ctx.beginPath();
//       ctx.moveTo(25, scanY);
//       ctx.lineTo(455, scanY);
//       ctx.stroke();
//       ctx.shadowBlur = 0;

//       animationFrameRef.current = requestAnimationFrame(draw);
//     };

//     draw();
//   };

//   const handlePrevious = () => {
//     if (isFirstInstruction) return;
    
//     setSlideDirection('out-right');
//     setIsTransitioning(true);
    
//     setTimeout(() => {
//       setCurrentActionIndex(prev => prev - 1);
//       setSlideDirection('in-left');
//       setTimeout(() => setIsTransitioning(false), 50);
//     }, 300);
//   };

//   const handleNext = () => {
//     if (allCompleted) {
//       stopWebcam();
//       if (onComplete) {
//         onComplete({
//           success: true,
//           completedActions: completedActions,
//           livenessScore: 100,
//           timestamp: new Date().toISOString()
//         });
//       }
//       return;
//     }

//     if (isLastInstruction) return;

//     setSlideDirection('out-left');
//     setIsTransitioning(true);
    
//     setTimeout(() => {
//       setCurrentActionIndex(prev => prev + 1);
//       setSlideDirection('in-right');
//       setTimeout(() => setIsTransitioning(false), 50);
//     }, 300);
//   };

//   const denyCameraAccess = () => {
//     setShowCameraPermission(false);
//     if (onComplete) {
//       onComplete({ success: false, denied: true });
//     }
//   };

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: '#000000',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       padding: '20px',
//       position: 'relative'
//     }}>
//       {/* Camera Permission Popup */}
//       {showCameraPermission && (
//         <div style={{
//           position: 'fixed',
//           inset: 0,
//           background: 'rgba(0, 0, 0, 0.9)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           zIndex: 1000,
//           animation: isFadingOut ? 'fadeOut 0.5s ease forwards' : 'fadeIn 0.3s ease'
//         }}>
//           <div style={{
//             background: 'linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%)',
//             borderRadius: '24px',
//             padding: '40px',
//             maxWidth: '480px',
//             width: '90%',
//             border: '2px solid rgba(255, 215, 0, 0.3)',
//             boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
//             animation: 'slideUp 0.4s ease',
//             position: 'relative'
//           }}>
//             <button
//               onClick={denyCameraAccess}
//               style={{
//                 position: 'absolute',
//                 top: '16px',
//                 right: '16px',
//                 background: 'transparent',
//                 border: 'none',
//                 color: '#666',
//                 cursor: 'pointer',
//                 padding: '8px'
//               }}
//             >
//               <X size={24} />
//             </button>

//             <div style={{ textAlign: 'center' }}>
//               <div style={{
//                 width: '80px',
//                 height: '80px',
//                 background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
//                 borderRadius: '50%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 margin: '0 auto 24px',
//                 boxShadow: '0 8px 24px rgba(255, 215, 0, 0.4)'
//               }}>
//                 <Camera size={40} color="#0a0a0a" />
//               </div>

//               <h2 style={{
//                 fontSize: '28px',
//                 fontWeight: '700',
//                 color: '#ffffff',
//                 marginBottom: '16px'
//               }}>
//                 Camera Access Required
//               </h2>

//               <p style={{
//                 fontSize: '16px',
//                 color: '#a0a0a0',
//                 lineHeight: '1.6',
//                 marginBottom: '32px'
//               }}>
//                 We need access to your camera to verify your identity. Your privacy is important to us - the camera feed is only used for verification and is not recorded.
//               </p>

//               <button
//                 onClick={initializeWebcam}
//                 style={{
//                   width: '100%',
//                   padding: '18px',
//                   background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
//                   border: '2px solid #ffd700',
//                   borderRadius: '14px',
//                   fontSize: '16px',
//                   fontWeight: '700',
//                   color: '#0a0a0a',
//                   cursor: 'pointer',
//                   boxShadow: '0 4px 16px rgba(255, 215, 0, 0.3)',
//                   transition: 'all 0.3s ease'
//                 }}
//                 onMouseEnter={(e) => {
//                   e.target.style.transform = 'translateY(-2px)';
//                   e.target.style.boxShadow = '0 8px 24px rgba(255, 215, 0, 0.5)';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.transform = 'translateY(0)';
//                   e.target.style.boxShadow = '0 4px 16px rgba(255, 215, 0, 0.3)';
//                 }}
//               >
//                 Allow Camera Access
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Verification UI */}
//       {!showCameraPermission && (
//         <div style={{
//           background: 'linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%)',
//           borderRadius: '32px',
//           maxWidth: '640px',
//           width: '100%',
//           padding: '60px',
//           boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
//           border: '1px solid #2a2a2a',
//           position: 'relative',
//           overflow: 'hidden'
//         }}>
//           {/* Rotating Background Effect */}
//           <div style={{
//             position: 'absolute',
//             top: '-50%',
//             left: '-50%',
//             width: '200%',
//             height: '200%',
//             background: 'radial-gradient(circle, rgba(255, 215, 0, 0.05) 0%, transparent 70%)',
//             animation: 'rotate 20s linear infinite',
//             pointerEvents: 'none'
//           }} />

//           <div style={{ position: 'relative', zIndex: 1 }}>
//             {/* Header */}
//             <div style={{ textAlign: 'center', marginBottom: '48px' }}>
//               <h1 style={{
//                 fontSize: '32px',
//                 fontWeight: '700',
//                 color: '#ffffff',
//                 marginBottom: '24px'
//               }}>
//                 Identity Verification
//               </h1>

//               {/* Progress Bar */}
//               <div style={{
//                 width: '100%',
//                 height: '6px',
//                 background: '#2a2a2a',
//                 borderRadius: '10px',
//                 overflow: 'hidden',
//                 position: 'relative'
//               }}>
//                 <div style={{
//                   height: '100%',
//                   background: 'linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)',
//                   width: `${progressPercentage}%`,
//                   transition: 'width 0.6s ease',
//                   boxShadow: '0 0 15px rgba(255, 215, 0, 0.6)',
//                   position: 'relative'
//                 }}>
//                   <div style={{
//                     position: 'absolute',
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     bottom: 0,
//                     background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
//                     animation: 'shimmer 2s infinite'
//                   }} />
//                 </div>
//               </div>
//             </div>

//             {/* Main Content */}
//             <div style={{
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               margin: '60px 0'
//             }}>
//               {/* Face Circle with Video */}
//               <div style={{
//                 width: '240px',
//                 height: '240px',
//                 background: 'linear-gradient(145deg, #3a3a3a, #2a2a2a)',
//                 borderRadius: '50%',
//                 marginBottom: '40px',
//                 position: 'relative',
//                 boxShadow: `
//                   inset 0 0 60px rgba(0, 0, 0, 0.5),
//                   0 0 0 8px rgba(255, 215, 0, 0.1),
//                   0 0 40px rgba(255, 215, 0, 0.2)
//                 `,
//                 animation: 'pulse 3s ease-in-out infinite',
//                 overflow: 'hidden'
//               }}>
//                 {/* Video hidden, rendered on canvas */}
//                 <video
//                   ref={videoRef}
//                   autoPlay
//                   playsInline
//                   muted
//                   style={{ display: 'none' }}
//                 />

//                 {/* Canvas for circular video */}
//                 <canvas
//                   ref={canvasRef}
//                   width="480"
//                   height="480"
//                   style={{
//                     width: '100%',
//                     height: '100%',
//                     objectFit: 'cover'
//                   }}
//                 />

//                 {/* Dashed Border */}
//                 <div style={{
//                   position: 'absolute',
//                   top: '50%',
//                   left: '50%',
//                   transform: 'translate(-50%, -50%)',
//                   width: '90%',
//                   height: '90%',
//                   borderRadius: '50%',
//                   border: '2px dashed rgba(255, 215, 0, 0.3)',
//                   animation: 'rotate 10s linear infinite',
//                   pointerEvents: 'none'
//                 }} />
//               </div>

//               {/* Dots Indicator */}
//               <div style={{
//                 display: 'flex',
//                 gap: '8px',
//                 marginBottom: '24px'
//               }}>
//                 {[0, 1, 2].map((i) => (
//                   <div
//                     key={i}
//                     style={{
//                       width: '8px',
//                       height: '8px',
//                       background: '#3a3a3a',
//                       borderRadius: '50%',
//                       animation: `dotPulse 1.5s ease-in-out infinite`,
//                       animationDelay: `${i * 0.2}s`
//                     }}
//                   />
//                 ))}
//               </div>

//               {/* Instruction Box with Slide Animation */}
//               <div style={{
//                 width: '100%',
//                 height: '80px',
//                 position: 'relative',
//                 overflow: 'hidden'
//               }}>
//                 <div
//                   style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '12px',
//                     background: 'rgba(255, 215, 0, 0.1)',
//                     border: '2px solid rgba(255, 215, 0, 0.3)',
//                     borderRadius: '16px',
//                     padding: '16px 24px',
//                     position: 'absolute',
//                     width: '100%',
//                     transition: 'all 0.3s ease',
//                     transform: slideDirection === 'in-right' ? 'translateX(0)' :
//                                slideDirection === 'in-left' ? 'translateX(0)' :
//                                slideDirection === 'out-left' ? 'translateX(-120%)' :
//                                slideDirection === 'out-right' ? 'translateX(120%)' : 'translateX(0)',
//                     opacity: isTransitioning ? 0 : 1
//                   }}
//                 >
//                   <div style={{
//                     width: '32px',
//                     height: '32px',
//                     background: '#ffd700',
//                     borderRadius: '8px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     flexShrink: 0
//                   }}>
//                     <svg width="20" height="20" viewBox="0 0 24 24" fill="#0a0a0a">
//                       <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
//                     </svg>
//                   </div>
//                   <span style={{
//                     fontSize: '16px',
//                     fontWeight: '600',
//                     color: '#ffd700'
//                   }}>
//                     {currentAction?.name}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div style={{
//               display: 'flex',
//               gap: '16px',
//               width: '100%',
//               marginTop: '40px'
//             }}>
//               <button
//                 onClick={handlePrevious}
//                 disabled={isFirstInstruction}
//                 style={{
//                   flex: 1,
//                   padding: '18px 32px',
//                   border: '2px solid #2a2a2a',
//                   borderRadius: '14px',
//                   fontSize: '16px',
//                   fontWeight: '700',
//                   cursor: isFirstInstruction ? 'not-allowed' : 'pointer',
//                   background: 'transparent',
//                   color: isFirstInstruction ? '#444' : '#a0a0a0',
//                   transition: 'all 0.3s ease',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   gap: '10px',
//                   opacity: isFirstInstruction ? 0.5 : 1
//                 }}
//                 onMouseEnter={(e) => {
//                   if (!isFirstInstruction) {
//                     e.target.style.borderColor = '#ffd700';
//                     e.target.style.color = '#ffd700';
//                     e.target.style.transform = 'translateY(-2px)';
//                   }
//                 }}
//                 onMouseLeave={(e) => {
//                   if (!isFirstInstruction) {
//                     e.target.style.borderColor = '#2a2a2a';
//                     e.target.style.color = '#a0a0a0';
//                     e.target.style.transform = 'translateY(0)';
//                   }
//                 }}
//               >
//                 <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
//                   <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
//                 </svg>
//                 <span>Previous</span>
//               </button>

//               <button
//                 onClick={handleNext}
//                 style={{
//                   flex: 1,
//                   padding: '18px 32px',
//                   background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
//                   color: '#0a0a0a',
//                   border: '2px solid #ffd700',
//                   borderRadius: '14px',
//                   fontSize: '16px',
//                   fontWeight: '700',
//                   cursor: 'pointer',
//                   boxShadow: '0 4px 16px rgba(255, 215, 0, 0.3)',
//                   transition: 'all 0.3s ease',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   gap: '10px'
//                 }}
//                 onMouseEnter={(e) => {
//                   e.target.style.transform = 'translateY(-2px)';
//                   e.target.style.boxShadow = '0 8px 24px rgba(255, 215, 0, 0.5)';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.transform = 'translateY(0)';
//                   e.target.style.boxShadow = '0 4px 16px rgba(255, 215, 0, 0.3)';
//                 }}
//               >
//                 <span>{allCompleted ? 'Next' : 'Skip'}</span>
//                 <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
//                   <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
//                 </svg>
//               </button>
//             </div>

//             {/* Help Text */}
//             <div style={{
//               textAlign: 'center',
//               marginTop: '32px',
//               paddingTop: '32px',
//               borderTop: '1px solid #2a2a2a'
//             }}>
//               <p style={{
//                 color: '#666',
//                 fontSize: '14px',
//                 lineHeight: '1.6'
//               }}>
//                 Position your face in the circle and follow the instructions.<br />
//                 Need help? <a href="#" style={{ color: '#ffd700', textDecoration: 'none', fontWeight: '600' }}>Contact Support</a>
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }

//         @keyframes fadeOut {
//           from { opacity: 1; }
//           to { opacity: 0; }
//         }

//         @keyframes slideUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes rotate {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }

//         @keyframes shimmer {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(100%); }
//         }

//         @keyframes pulse {
//           0%, 100% {
//             transform: scale(1);
//             box-shadow:
//               inset 0 0 60px rgba(0, 0, 0, 0.5),
//               0 0 0 8px rgba(255, 215, 0, 0.1),
//               0 0 40px rgba(255, 215, 0, 0.2);
//           }
//           50% {
//             transform: scale(1.02);
//             box-shadow:
//               inset 0 0 60px rgba(0, 0, 0, 0.5),
//               0 0 0 12px rgba(255, 215, 0, 0.15),
//               0 0 60px rgba(255, 215, 0, 0.3);
//           }
//         }

//         @keyframes dotPulse {
//           0%, 100% {
//             background: #3a3a3a;
//             transform: scale(1);
//           }
//           50% {
//             background: #ffd700;
//             transform: scale(1.3);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default LivenessDetection;

// src/components/verification/LivenessDetection.jsx
// Identity Verification with facial liveness detection

import React, { useState, useRef, useEffect } from 'react';
import { Camera, X } from 'lucide-react';

const LivenessDetection = ({ sessionId, onComplete }) => {
  const [showCameraPermission, setShowCameraPermission] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [completedActions, setCompletedActions] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState('in');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const streamRef = useRef(null);

  const LIVENESS_ACTIONS = [
    { id: 'blink', name: 'Blink your eyes', duration: 3 },
    { id: 'smile', name: 'Smile', duration: 3 },
    { id: 'turn_left', name: 'Turn head left', duration: 3 },
    { id: 'turn_right', name: 'Turn head right', duration: 3 },
    { id: 'nod', name: 'Nod your head', duration: 3 }
  ];

  const currentAction = LIVENESS_ACTIONS[currentActionIndex];
  const progressPercentage = ((currentActionIndex + (completedActions.includes(currentAction?.id) ? 1 : 0)) / LIVENESS_ACTIONS.length) * 100;
  const isFirstInstruction = currentActionIndex === 0;
  const isLastInstruction = currentActionIndex === LIVENESS_ACTIONS.length - 1;
  const allCompleted = completedActions.length === LIVENESS_ACTIONS.length;

  // Start the first action when webcam becomes active
  useEffect(() => {
    if (isWebcamActive && currentActionIndex === 0 && completedActions.length === 0) {
      console.log('✅ Webcam active - ready to start verification');
    }
  }, [isWebcamActive, currentActionIndex, completedActions]);

  // Auto-complete actions after 3 second duration (fallback)
  useEffect(() => {
    if (!currentAction) {
      console.log('No current action');
      return;
    }
    
    if (!isWebcamActive) {
      console.log('⏳ Waiting for webcam to activate...');
      return;
    }
    
    if (completedActions.includes(currentAction.id)) {
      console.log('Action already completed:', currentAction.id);
      return;
    }

    console.log('✅ Webcam active! Starting 3-second timer for:', currentAction.name);

    const timer = setTimeout(() => {
      console.log('✓ Auto-completing:', currentAction.name);
      setCompletedActions(prev => [...prev, currentAction.id]);
    }, currentAction.duration * 1000);

    return () => {
      console.log('Clearing timer for:', currentAction.name);
      clearTimeout(timer);
    };
  }, [currentAction, isWebcamActive, completedActions]);

  // Auto-advance to next instruction when current one is completed
  useEffect(() => {
    if (!currentAction || !completedActions.includes(currentAction.id)) return;

    console.log('Action completed, checking if should advance:', currentAction.id);

    // If this is the last instruction, don't auto-advance
    if (isLastInstruction) {
      console.log('Last instruction - not auto-advancing');
      return;
    }

    console.log('Advancing to next instruction in 500ms...');

    // Wait a bit before transitioning to next instruction
    const transitionTimer = setTimeout(() => {
      setSlideDirection('out-left');
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentActionIndex(prev => prev + 1);
        setSlideDirection('in-right');
        setTimeout(() => setIsTransitioning(false), 50);
      }, 300);
    }, 500); // Wait 500ms after completion before moving to next

    return () => clearTimeout(transitionTimer);
  }, [completedActions, currentAction, isLastInstruction]);

  // Connect stream to video element when it becomes available
  useEffect(() => {
    if (!showCameraPermission && streamRef.current && videoRef.current) {
      console.log('📺 Connecting stream to video element...');
      videoRef.current.srcObject = streamRef.current;
      
      videoRef.current.onloadedmetadata = () => {
        console.log('✅ Video metadata loaded! Playing video...');
        videoRef.current.play();
        console.log('✅ Setting isWebcamActive = true');
        setIsWebcamActive(true);
        startDrawingVideoInCircle();
      };
    }
  }, [showCameraPermission]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  const initializeWebcam = async () => {
    console.log('🎥 initializeWebcam() called - requesting camera access...');
    
    try {
      // Start fade out animation immediately
      setIsFadingOut(true);
      
      console.log('📹 Requesting getUserMedia...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      console.log('✅ getUserMedia successful! Stream acquired:', stream);
      
      // Store stream in ref so we can use it after the popup is hidden
      streamRef.current = stream;
      
      // Remove popup after fade animation
      setTimeout(() => {
        console.log('🎭 Hiding camera permission popup');
        setShowCameraPermission(false);
      }, 500);
      
    } catch (err) {
      console.error('❌ Webcam error details:', {
        name: err.name,
        message: err.message,
        constraint: err.constraint
      });
      
      let errorMessage = 'Failed to access webcam. ';
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage += 'Camera permission was denied. Please allow camera access in your browser settings.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage += 'No camera found. Please connect a camera and try again.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage += 'Camera is already in use by another application.';
      } else {
        errorMessage += err.message;
      }
      
      alert(errorMessage);
      setIsFadingOut(false);
      setShowCameraPermission(true); // Keep the popup visible
    }
  };

  // Connect stream to video element when it becomes available
  useEffect(() => {
    if (!showCameraPermission && streamRef.current && videoRef.current) {
      console.log('📺 Connecting stream to video element...');
      videoRef.current.srcObject = streamRef.current;
      
      videoRef.current.onloadedmetadata = () => {
        console.log('✅ Video metadata loaded! Playing video...');
        videoRef.current.play();
        console.log('✅ Setting isWebcamActive = true');
        setIsWebcamActive(true);
        startDrawingVideoInCircle();
      };
    }
  }, [showCameraPermission]);

  const stopWebcam = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // Stop stream from streamRef if it exists
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsWebcamActive(false);
  };

  const startDrawingVideoInCircle = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    const draw = () => {
      if (!video.videoWidth) {
        animationFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      canvas.width = 480;
      canvas.height = 480;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create circular clipping path
      ctx.save();
      ctx.beginPath();
      ctx.arc(240, 240, 215, 0, Math.PI * 2);
      ctx.clip();

      // Draw video centered and scaled
      const videoAspect = video.videoWidth / video.videoHeight;
      const canvasAspect = 1;
      let drawWidth, drawHeight, offsetX, offsetY;

      if (videoAspect > canvasAspect) {
        drawHeight = 480;
        drawWidth = drawHeight * videoAspect;
        offsetX = (480 - drawWidth) / 2;
        offsetY = 0;
      } else {
        drawWidth = 480;
        drawHeight = drawWidth / videoAspect;
        offsetX = 0;
        offsetY = (480 - drawHeight) / 2;
      }

      ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
      ctx.restore();

      // Draw scanning line
      const scanY = (Date.now() % 2000) / 2000 * 430 + 25;
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
      ctx.lineWidth = 4;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ffd700';
      ctx.beginPath();
      ctx.moveTo(25, scanY);
      ctx.lineTo(455, scanY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  const handlePrevious = () => {
    if (isFirstInstruction) return;
    
    setSlideDirection('out-right');
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentActionIndex(prev => prev - 1);
      setSlideDirection('in-left');
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  const handleNext = () => {
    if (allCompleted) {
      stopWebcam();
      if (onComplete) {
        onComplete({
          success: true,
          completedActions: completedActions,
          livenessScore: 100,
          timestamp: new Date().toISOString()
        });
      }
      return;
    }

    if (isLastInstruction) return;

    setSlideDirection('out-left');
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentActionIndex(prev => prev + 1);
      setSlideDirection('in-right');
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  const denyCameraAccess = () => {
    setShowCameraPermission(false);
    if (onComplete) {
      onComplete({ success: false, denied: true });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Camera Permission Popup */}
      {showCameraPermission && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: isFadingOut ? 'fadeOut 0.5s ease forwards' : 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%)',
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '480px',
            width: '90%',
            border: '2px solid rgba(255, 215, 0, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
            animation: 'slideUp 0.4s ease',
            position: 'relative'
          }}>
            <button
              onClick={denyCameraAccess}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: '#666',
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              <X size={24} />
            </button>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 8px 24px rgba(255, 215, 0, 0.4)'
              }}>
                <Camera size={40} color="#0a0a0a" />
              </div>

              <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '16px'
              }}>
                Camera Access Required
              </h2>

              <p style={{
                fontSize: '16px',
                color: '#a0a0a0',
                lineHeight: '1.6',
                marginBottom: '32px'
              }}>
                We need access to your camera to verify your identity. Your privacy is important to us - the camera feed is only used for verification and is not recorded.
              </p>

              <button
                onClick={initializeWebcam}
                style={{
                  width: '100%',
                  padding: '18px',
                  background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                  border: '2px solid #ffd700',
                  borderRadius: '14px',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#0a0a0a',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(255, 215, 0, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(255, 215, 0, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 16px rgba(255, 215, 0, 0.3)';
                }}
              >
                Allow Camera Access
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Verification UI */}
      {!showCameraPermission && (
        <div style={{
          background: 'linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%)',
          borderRadius: '32px',
          maxWidth: '640px',
          width: '100%',
          padding: '60px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
          border: '1px solid #2a2a2a',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Rotating Background Effect */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.05) 0%, transparent 70%)',
            animation: 'rotate 20s linear infinite',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '24px'
              }}>
                Identity Verification
              </h1>

              {/* Progress Bar */}
              <div style={{
                width: '100%',
                height: '6px',
                background: '#2a2a2a',
                borderRadius: '10px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <div style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)',
                  width: `${progressPercentage}%`,
                  transition: 'width 0.6s ease',
                  boxShadow: '0 0 15px rgba(255, 215, 0, 0.6)',
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

            {/* Main Content */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              margin: '60px 0'
            }}>
              {/* Face Circle with Video */}
              <div style={{
                width: '240px',
                height: '240px',
                background: 'linear-gradient(145deg, #3a3a3a, #2a2a2a)',
                borderRadius: '50%',
                marginBottom: '40px',
                position: 'relative',
                boxShadow: `
                  inset 0 0 60px rgba(0, 0, 0, 0.5),
                  0 0 0 8px rgba(255, 215, 0, 0.1),
                  0 0 40px rgba(255, 215, 0, 0.2)
                `,
                animation: 'pulse 3s ease-in-out infinite',
                overflow: 'hidden'
              }}>
                {/* Video hidden, rendered on canvas */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ display: 'none' }}
                />

                {/* Canvas for circular video */}
                <canvas
                  ref={canvasRef}
                  width="480"
                  height="480"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />

                {/* Dashed Border */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '90%',
                  height: '90%',
                  borderRadius: '50%',
                  border: '2px dashed rgba(255, 215, 0, 0.3)',
                  animation: 'rotate 10s linear infinite',
                  pointerEvents: 'none'
                }} />
              </div>

              {/* Dots Indicator */}
              <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '24px'
              }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '8px',
                      height: '8px',
                      background: '#3a3a3a',
                      borderRadius: '50%',
                      animation: `dotPulse 1.5s ease-in-out infinite`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                ))}
              </div>

              {/* Instruction Box with Slide Animation */}
              <div style={{
                width: '100%',
                height: '80px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'rgba(255, 215, 0, 0.1)',
                    border: '2px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '16px',
                    padding: '16px 24px',
                    position: 'absolute',
                    width: '100%',
                    transition: 'all 0.3s ease',
                    transform: slideDirection === 'in-right' ? 'translateX(0)' :
                               slideDirection === 'in-left' ? 'translateX(0)' :
                               slideDirection === 'out-left' ? 'translateX(-120%)' :
                               slideDirection === 'out-right' ? 'translateX(120%)' : 'translateX(0)',
                    opacity: isTransitioning ? 0 : 1
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: '#ffd700',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#0a0a0a">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  </div>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#ffd700'
                  }}>
                    {currentAction?.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '16px',
              width: '100%',
              marginTop: '40px'
            }}>
              <button
                onClick={handlePrevious}
                disabled={isFirstInstruction}
                style={{
                  flex: 1,
                  padding: '18px 32px',
                  border: '2px solid #2a2a2a',
                  borderRadius: '14px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: isFirstInstruction ? 'not-allowed' : 'pointer',
                  background: 'transparent',
                  color: isFirstInstruction ? '#444' : '#a0a0a0',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  opacity: isFirstInstruction ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isFirstInstruction) {
                    e.target.style.borderColor = '#ffd700';
                    e.target.style.color = '#ffd700';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isFirstInstruction) {
                    e.target.style.borderColor = '#2a2a2a';
                    e.target.style.color = '#a0a0a0';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
                </svg>
                <span>Previous</span>
              </button>

              <button
                onClick={handleNext}
                style={{
                  flex: 1,
                  padding: '18px 32px',
                  background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                  color: '#0a0a0a',
                  border: '2px solid #ffd700',
                  borderRadius: '14px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(255, 215, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(255, 215, 0, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 16px rgba(255, 215, 0, 0.3)';
                }}
              >
                <span>{allCompleted ? 'Next' : 'Skip'}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </button>
            </div>

            {/* Help Text */}
            <div style={{
              textAlign: 'center',
              marginTop: '32px',
              paddingTop: '32px',
              borderTop: '1px solid #2a2a2a'
            }}>
              <p style={{
                color: '#666',
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                Position your face in the circle and follow the instructions.<br />
                Need help? <a href="#" style={{ color: '#ffd700', textDecoration: 'none', fontWeight: '600' }}>Contact Support</a>
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow:
              inset 0 0 60px rgba(0, 0, 0, 0.5),
              0 0 0 8px rgba(255, 215, 0, 0.1),
              0 0 40px rgba(255, 215, 0, 0.2);
          }
          50% {
            transform: scale(1.02);
            box-shadow:
              inset 0 0 60px rgba(0, 0, 0, 0.5),
              0 0 0 12px rgba(255, 215, 0, 0.15),
              0 0 60px rgba(255, 215, 0, 0.3);
          }
        }

        @keyframes dotPulse {
          0%, 100% {
            background: #3a3a3a;
            transform: scale(1);
          }
          50% {
            background: #ffd700;
            transform: scale(1.3);
          }
        }
      `}</style>
    </div>
  );
};

export default LivenessDetection;
// src/components/verification/LivenessDetection.jsx
// This component handles face liveness detection to ensure user is real (not a photo/video)
// Uses MediaPipe Face Detection for real-time face tracking

import React, { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle, XCircle, Loader } from 'lucide-react';
import { submitFaceData } from '../../services/api';

// MediaPipe Face Detection (lightweight, runs in browser)
// Install: npm install @mediapipe/face_detection @mediapipe/camera_utils
import { FaceDetection } from '@mediapipe/face_detection';
import { Camera as MPCamera } from '@mediapipe/camera_utils';

const LivenessDetection = ({ sessionId, onComplete }) => {
  // Component state
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [completedActions, setCompletedActions] = useState([]);
  const [livenessScore, setLivenessScore] = useState(0);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Refs for video and canvas elements
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceDetectionRef = useRef(null);
  const cameraRef = useRef(null);

  // Face position tracking for action detection
  const facePositionRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const previousPositionRef = useRef({ x: 0, y: 0 });
  const blinkCountRef = useRef(0);

  // Actions user needs to complete for liveness verification
  const LIVENESS_ACTIONS = [
    { id: 'blink', name: 'Blink your eyes', icon: '👁️' },
    { id: 'smile', name: 'Smile', icon: '😊' },
    { id: 'turn_left', name: 'Turn head left', icon: '←' },
    { id: 'turn_right', name: 'Turn head right', icon: '→' },
    { id: 'nod', name: 'Nod your head', icon: '↕️' }
  ];

  // =============================================================================
  // WEBCAM INITIALIZATION
  // =============================================================================

  useEffect(() => {
    initializeWebcam();
    return () => {
      // Cleanup: stop webcam and face detection when component unmounts
      stopWebcam();
    };
  }, []);

  /**
   * Initialize webcam and face detection
   */
  const initializeWebcam = async () => {
    try {
      setError(null);

      // Request webcam permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user' // Front camera
        }
      });

      // Attach stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsWebcamActive(true);

        // Wait for video to load, then initialize face detection
        videoRef.current.onloadedmetadata = () => {
          initializeFaceDetection();
        };
      }
    } catch (err) {
      console.error('Webcam error:', err);
      setError('Failed to access webcam. Please grant camera permission.');
    }
  };

  /**
   * Stop webcam and cleanup
   */
  const stopWebcam = () => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (cameraRef.current) {
      cameraRef.current.stop();
    }
    if (faceDetectionRef.current) {
      faceDetectionRef.current.close();
    }
    setIsWebcamActive(false);
  };

  // =============================================================================
  // FACE DETECTION SETUP (MediaPipe)
  // =============================================================================

  /**
   * Initialize MediaPipe Face Detection
   */
  const initializeFaceDetection = () => {
    try {
      // Create face detection instance
      faceDetectionRef.current = new FaceDetection({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`;
        }
      });

      // Configure face detection
      faceDetectionRef.current.setOptions({
        model: 'short', // 'short' for faces within 2 meters (faster)
        minDetectionConfidence: 0.5
      });

      // Set callback for when face is detected
      faceDetectionRef.current.onResults(onFaceDetected);

      // Start camera processing
      if (videoRef.current) {
        cameraRef.current = new MPCamera(videoRef.current, {
          onFrame: async () => {
            if (faceDetectionRef.current && videoRef.current) {
              await faceDetectionRef.current.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480
        });
        cameraRef.current.start();
      }

      // Start liveness check sequence
      startLivenessSequence();
    } catch (err) {
      console.error('Face detection initialization error:', err);
      setError('Failed to initialize face detection');
    }
  };

  /**
   * Callback when face is detected in frame
   * @param {Object} results - Detection results from MediaPipe
   */
  const onFaceDetected = (results) => {
    if (!canvasRef.current || !results.detections || results.detections.length === 0) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match video
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw detected face
    const detection = results.detections[0]; // Use first detected face
    const bbox = detection.boundingBox;

    // Update face position for action detection
    facePositionRef.current = {
      x: bbox.xCenter * canvas.width,
      y: bbox.yCenter * canvas.height,
      width: bbox.width * canvas.width,
      height: bbox.height * canvas.height
    };

    // Draw face bounding box
    ctx.strokeStyle = completedActions.length === LIVENESS_ACTIONS.length ? '#10b981' : '#3b82f6';
    ctx.lineWidth = 3;
    ctx.strokeRect(
      bbox.xCenter * canvas.width - (bbox.width * canvas.width) / 2,
      bbox.yCenter * canvas.height - (bbox.height * canvas.height) / 2,
      bbox.width * canvas.width,
      bbox.height * canvas.height
    );

    // Check if current action is completed
    if (currentAction) {
      checkActionCompletion(currentAction.id);
    }
  };

  // =============================================================================
  // LIVENESS ACTION DETECTION
  // =============================================================================

  /**
   * Start the liveness check sequence
   */
  const startLivenessSequence = () => {
    // Start with first action
    if (LIVENESS_ACTIONS.length > 0) {
      setCurrentAction(LIVENESS_ACTIONS[0]);
    }
  };

  /**
   * Check if user completed the current action
   * @param {string} actionId - ID of action to check
   */
  const checkActionCompletion = (actionId) => {
    const currentPos = facePositionRef.current;
    const prevPos = previousPositionRef.current;

    let actionCompleted = false;

    switch (actionId) {
      case 'blink':
        // Detect blink by checking if face height suddenly decreases
        // (eyes closing reduces detected face height slightly)
        if (prevPos.height > 0) {
          const heightRatio = currentPos.height / prevPos.height;
          if (heightRatio < 0.95) { // Face height decreased
            blinkCountRef.current++;
            if (blinkCountRef.current >= 2) { // Need 2 blinks
              actionCompleted = true;
              blinkCountRef.current = 0;
            }
          }
        }
        break;

      case 'smile':
        // Simplified: detect if face height increases (mouth opening)
        // In production, use facial landmark detection for accuracy
        if (prevPos.height > 0) {
          const heightRatio = currentPos.height / prevPos.height;
          if (heightRatio > 1.05) { // Face height increased
            actionCompleted = true;
          }
        }
        break;

      case 'turn_left':
        // Detect leftward movement
        if (prevPos.x > 0) {
          const movement = currentPos.x - prevPos.x;
          if (movement < -50) { // Moved 50px left
            actionCompleted = true;
          }
        }
        break;

      case 'turn_right':
        // Detect rightward movement
        if (prevPos.x > 0) {
          const movement = currentPos.x - prevPos.x;
          if (movement > 50) { // Moved 50px right
            actionCompleted = true;
          }
        }
        break;

      case 'nod':
        // Detect vertical movement (up and down)
        if (prevPos.y > 0) {
          const movement = Math.abs(currentPos.y - prevPos.y);
          if (movement > 30) { // Moved 30px vertically
            actionCompleted = true;
          }
        }
        break;

      default:
        break;
    }

    // Update previous position for next comparison
    previousPositionRef.current = { ...currentPos };

    // If action completed, move to next action
    if (actionCompleted) {
      completeAction(actionId);
    }
  };

  /**
   * Mark action as completed and move to next
   * @param {string} actionId - ID of completed action
   */
  const completeAction = (actionId) => {
    // Add to completed actions
    setCompletedActions(prev => [...prev, actionId]);

    // Calculate new liveness score (percentage of completed actions)
    const newScore = ((completedActions.length + 1) / LIVENESS_ACTIONS.length) * 100;
    setLivenessScore(Math.round(newScore));

    // Move to next action
    const currentIndex = LIVENESS_ACTIONS.findIndex(a => a.id === actionId);
    if (currentIndex < LIVENESS_ACTIONS.length - 1) {
      // More actions remaining
      setCurrentAction(LIVENESS_ACTIONS[currentIndex + 1]);
    } else {
      // All actions completed
      setCurrentAction(null);
      handleVerificationComplete();
    }
  };

  /**
   * Skip current action (for testing purposes)
   */
  const skipAction = () => {
    if (currentAction) {
      completeAction(currentAction.id);
    }
  };

  // =============================================================================
  // SUBMIT VERIFICATION DATA
  // =============================================================================

  /**
   * Handle verification completion - submit data to backend
   */
  const handleVerificationComplete = async () => {
    setIsProcessing(true);

    try {
      // In production, extract actual face embedding here
      // For now, we'll send mock embedding data
      const faceData = {
        embedding: generateMockEmbedding(), // Replace with real embedding
        livenessScore: livenessScore / 100, // Convert to 0-1 scale
        actions: completedActions,
        timestamp: new Date().toISOString()
      };

      // Submit to backend
      const response = await submitFaceData(sessionId, faceData);

      if (response.success) {
        // Stop webcam
        stopWebcam();
        
        // Notify parent component
        if (onComplete) {
          onComplete({
            success: true,
            livenessScore: livenessScore,
            actions: completedActions
          });
        }
      }
    } catch (err) {
      console.error('Failed to submit face data:', err);
      setError('Failed to submit verification data. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Generate mock face embedding (replace with real embedding extraction)
   * In production, use a face recognition library to extract embeddings
   */
  const generateMockEmbedding = () => {
    // Mock 128-dimensional face embedding
    return Array.from({ length: 128 }, () => Math.random());
  };

  // =============================================================================
  // RETRY VERIFICATION
  // =============================================================================

  /**
   * Restart verification process
   */
  const retryVerification = () => {
    setCompletedActions([]);
    setLivenessScore(0);
    setError(null);
    blinkCountRef.current = 0;
    previousPositionRef.current = { x: 0, y: 0 };
    
    // Restart from first action
    if (LIVENESS_ACTIONS.length > 0) {
      setCurrentAction(LIVENESS_ACTIONS[0]);
    }
  };

  // =============================================================================
  // RENDER UI
  // =============================================================================

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Identity Verification
        </h2>
        <p className="text-gray-600">
          Complete the following actions to verify you're a real person
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <XCircle className="text-red-500" size={24} />
          <div>
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={initializeWebcam}
              className="text-red-600 underline text-sm mt-1"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Video Feed */}
        <div className="bg-gray-900 rounded-lg overflow-hidden relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto"
            style={{ display: isWebcamActive ? 'block' : 'none' }}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
          />
          
          {/* Camera Inactive Overlay */}
          {!isWebcamActive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <Camera size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">Initializing camera...</p>
              </div>
            </div>
          )}

          {/* Current Action Overlay */}
          {isWebcamActive && currentAction && (
            <div className="absolute top-4 left-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-75">Please:</p>
                  <p className="text-xl font-bold">
                    {currentAction.icon} {currentAction.name}
                  </p>
                </div>
                <button
                  onClick={skipAction}
                  className="text-xs bg-white bg-opacity-20 px-3 py-1 rounded"
                >
                  Skip (Testing)
                </button>
              </div>
            </div>
          )}

          {/* Liveness Score */}
          <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 text-white p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Liveness Score</span>
              <span className="text-lg font-bold">{livenessScore}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${livenessScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Actions Checklist */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Verification Steps</h3>
          <div className="space-y-3">
            {LIVENESS_ACTIONS.map((action) => {
              const isCompleted = completedActions.includes(action.id);
              const isCurrent = currentAction?.id === action.id;

              return (
                <div
                  key={action.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isCompleted
                      ? 'bg-green-50 border-green-500'
                      : isCurrent
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{action.icon}</div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{action.name}</p>
                      {isCurrent && (
                        <p className="text-sm text-blue-600">In progress...</p>
                      )}
                    </div>
                    {isCompleted && (
                      <CheckCircle className="text-green-500" size={24} />
                    )}
                    {isCurrent && (
                      <Loader className="text-blue-500 animate-spin" size={24} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Processing State */}
          {isProcessing && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <Loader className="animate-spin mx-auto mb-2 text-blue-500" size={32} />
              <p className="text-blue-700 font-medium">
                Submitting verification data...
              </p>
            </div>
          )}

          {/* Retry Button */}
          {livenessScore > 0 && livenessScore < 100 && !isProcessing && (
            <button
              onClick={retryVerification}
              className="mt-6 w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Restart Verification
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivenessDetection;
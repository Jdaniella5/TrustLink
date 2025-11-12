
import React, { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle, XCircle, Loader } from 'lucide-react';
import { submitFaceData } from '../../services/api';

const LivenessDetection = ({ sessionId, onComplete }) => {
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [completedActions, setCompletedActions] = useState([]);
  const [livenessScore, setLivenessScore] = useState(0);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const LIVENESS_ACTIONS = [
    { id: 'blink', name: 'Blink your eyes', icon: '/eye.svg', duration: 3 },
    { id: 'smile', name: 'Smile', icon: '/smile.svg', duration: 3 },
    { id: 'turn_left', name: 'Turn head left', icon: '←', duration: 3 },
    { id: 'turn_right', name: 'Turn head right', icon: '→', duration: 3 },
    { id: 'nod', name: 'Nod your head', icon: '/nod.svg', duration: 3 }
  ];

  // Initialize webcam
  useEffect(() => {
    initializeWebcam();
    return () => {
      stopWebcam();
    };
  }, []);

  // Auto-complete actions for testing (simulate user actions)
  useEffect(() => {
    if (!currentAction || !isWebcamActive) return;

    // Simulate action completion after action duration
    const actionDuration = LIVENESS_ACTIONS.find(a => a.id === currentAction.id)?.duration || 3;
    const timer = setTimeout(() => {
      completeAction(currentAction.id);
    }, actionDuration * 1000);

    return () => clearTimeout(timer);
  }, [currentAction, isWebcamActive]);

  const initializeWebcam = async () => {
    try {
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsWebcamActive(true);

        // Start face detection drawing
        videoRef.current.onloadedmetadata = () => {
          startDrawingFaceBox();
          startLivenessSequence();
        };
      }
    } catch (err) {
      console.error('Webcam error:', err);
      setError('Failed to access webcam. Please grant camera permission and refresh.');
    }
  };

  const stopWebcam = () => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsWebcamActive(false);
  };

  // Draw a simple face detection box
  const startDrawingFaceBox = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    const draw = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw a center box where face should be
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const boxWidth = 200;
      const boxHeight = 250;

      ctx.strokeStyle = completedActions.length === LIVENESS_ACTIONS.length ? '#10b981' : '#3b82f6';
      ctx.lineWidth = 3;
      ctx.strokeRect(centerX - boxWidth / 2, centerY - boxHeight / 2, boxWidth, boxHeight);

      // Draw corner accents
      ctx.fillStyle = ctx.strokeStyle;
      const cornerSize = 20;
      
      // Top-left
      ctx.fillRect(centerX - boxWidth / 2, centerY - boxHeight / 2, cornerSize, cornerSize);
      ctx.fillRect(centerX - boxWidth / 2, centerY - boxHeight / 2, cornerSize, 3);
      
      // Top-right
      ctx.fillRect(centerX + boxWidth / 2 - cornerSize, centerY - boxHeight / 2, cornerSize, cornerSize);
      ctx.fillRect(centerX + boxWidth / 2 - cornerSize, centerY - boxHeight / 2, cornerSize, 3);
      
      // Bottom-left
      ctx.fillRect(centerX - boxWidth / 2, centerY + boxHeight / 2 - cornerSize, cornerSize, cornerSize);
      ctx.fillRect(centerX - boxWidth / 2, centerY + boxHeight / 2 - 3, cornerSize, 3);
      
      // Bottom-right
      ctx.fillRect(centerX + boxWidth / 2 - cornerSize, centerY + boxHeight / 2 - cornerSize, cornerSize, cornerSize);
      ctx.fillRect(centerX + boxWidth / 2 - cornerSize, centerY + boxHeight / 2 - 3, cornerSize, 3);

      if (isWebcamActive) {
        requestAnimationFrame(draw);
      }
    };

    draw();
  };

  const startLivenessSequence = () => {
    if (LIVENESS_ACTIONS.length > 0) {
      setCurrentAction(LIVENESS_ACTIONS[0]);
    }
  };

  const completeAction = (actionId) => {
    if (completedActions.includes(actionId)) return;

    setCompletedActions(prev => [...prev, actionId]);
    const newScore = Math.round(((completedActions.length + 1) / LIVENESS_ACTIONS.length) * 100);
    setLivenessScore(newScore);

    const currentIndex = LIVENESS_ACTIONS.findIndex(a => a.id === actionId);
    
    if (currentIndex < LIVENESS_ACTIONS.length - 1) {
      // Move to next action
      setTimeout(() => {
        setCurrentAction(LIVENESS_ACTIONS[currentIndex + 1]);
      }, 500);
    } else {
      // All actions completed
      setCurrentAction(null);
      setTimeout(() => {
        handleVerificationComplete();
      }, 500);
    }
  };

  const skipAction = () => {
    if (currentAction && !completedActions.includes(currentAction.id)) {
      completeAction(currentAction.id);
    }
  };

  const handleVerificationComplete = async () => {
    setIsProcessing(true);

    try {
      const faceData = {
        embedding: generateMockEmbedding(),
        livenessScore: livenessScore / 100,
        actions: completedActions,
        timestamp: new Date().toISOString()
      };

      // Mock API call - replace with actual when backend is ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      stopWebcam();

      if (onComplete) {
        onComplete({
          success: true,
          livenessScore: livenessScore,
          actions: completedActions
        });
      }
    } catch (err) {
      console.error('Failed to submit face data:', err);
      setError('Failed to submit verification data. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateMockEmbedding = () => {
    return Array.from({ length: 128 }, () => Math.random());
  };

  const retryVerification = () => {
    setCompletedActions([]);
    setLivenessScore(0);
    setError(null);

    if (LIVENESS_ACTIONS.length > 0) {
      setCurrentAction(LIVENESS_ACTIONS[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Identity Verification
        </h2>
        <p className="text-gray-600">
          Complete the following actions to verify you're a real person
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4  bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
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

      <div className="grid md:grid-cols-2 gap-6">
        {/* Video Feed */}
        <div className="bg-gray-900 rounded-lg overflow-hidden relative aspect-video">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ display: isWebcamActive ? 'block' : 'none' }}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
          />

          {!isWebcamActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-center text-white">
                <Camera size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">Initializing camera...</p>
              </div>
            </div>
          )}

          {isWebcamActive && currentAction && (
            <div className="absolute top-1 left-4 right-4 bg-opacity-70 text-white p-1 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-75">Please:</p>
                  <p className="text-xl font-bold flex items-center gap-2">
                  {currentAction.icon?.endsWith('.svg') ? (
                    <img
                      src={currentAction.icon}
                      alt={currentAction.name}
                      className="w-6 h-6 inline-block filter invert"
                    />
                  ) : (
                    <span>{currentAction.icon}</span>
                  )}
                  {currentAction.name}
                </p>

                </div>
                <button
                  onClick={skipAction}
                  className="text-xs bg-white bg-opacity-20 px-3 py-1 rounded hover:bg-opacity-30"
                >
                  Skip
                </button>
              </div>
            </div>
          )}

          <div className="absolute bottom-1 backdrop-blur-2xl left-4 right-4  bg-opacity-70 text-white p-1 rounded-lg">
            <div className="flex items-center justify-between ">
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
                    <div className="w-8 h-8 flex items-center justify-center rounded-md">
                      {action.icon?.endsWith('.svg') ? (
                        <img
                          src={action.icon}
                          alt={action.name}
                          className="w-5 h-5 "
                        />
                      ) : (
                        <span className="text-2xl">{action.icon}</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{action.name}</p>
                      {isCurrent && (
                        <p className="text-sm text-blue-600">In progress ({action.duration}s)...</p>
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

          {isProcessing && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <Loader className="animate-spin mx-auto mb-2 text-blue-500" size={32} />
              <p className="text-blue-700 font-medium">
                Submitting verification data...
              </p>
            </div>
          )}

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
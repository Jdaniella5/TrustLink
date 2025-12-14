import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, CheckCircle, XCircle, Loader, ArrowRight, Shuffle } from 'lucide-react';

const WordPuzzleGame = ({ onClose }) => {
  const words = [
    { word: 'HOME', hint: 'Where you live' },
    { word: 'VERIFY', hint: 'To confirm something' },
    { word: 'SECURE', hint: 'Keep safe' },
    { word: 'TRUST', hint: 'Belief in someone' },
    { word: 'PROOF', hint: 'Evidence' },
    { word: 'CHECK', hint: 'To examine' }
  ];

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [scrambledWord, setScrambledWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isSolved, setIsSolved] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const currentWord = words[currentWordIndex].word;
  const currentHint = words[currentWordIndex].hint;

  useEffect(() => {
    scrambleWord();
  }, [currentWordIndex]);

  const scrambleWord = () => {
    const letters = currentWord.split('');
    let shuffled = [...letters];
    
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Make sure it's actually scrambled
    if (shuffled.join('') === currentWord) {
      [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
    }
    
    setScrambledWord(shuffled.join(''));
    setUserInput('');
    setIsSolved(false);
    setAttempts(0);
  };

  const handleSubmit = () => {
    setAttempts(attempts + 1);
    
    if (userInput.toUpperCase() === currentWord) {
      setIsSolved(true);
      const points = Math.max(100 - (attempts * 10), 50);
      setScore(score + points);
    }
  };

  const nextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      setCurrentWordIndex(0);
      setScore(0);
    }
  };

  const giveHint = () => {
    setUserInput(currentWord[0]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-purple-500/50 rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Word Unscramble 🧩
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition text-3xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <p className="text-purple-300 text-sm font-semibold mb-1">Hint: {currentHint}</p>
          <p className="text-gray-400 text-xs">Unscramble the letters to form the word!</p>
        </div>

        <div className="mb-4 flex items-center justify-between text-sm">
          <div className="text-gray-400">
            Attempts: <span className="text-yellow-400 font-bold">{attempts}</span>
          </div>
          <div className="text-gray-400">
            Score: <span className="text-purple-400 font-bold">{score}</span>
          </div>
        </div>

        {/* Scrambled Word Display */}
        <div className="mb-6">
          <p className="text-gray-400 text-xs mb-2 text-center">Scrambled Letters:</p>
          <div className="flex justify-center gap-2 mb-4">
            {scrambledWord.split('').map((letter, index) => (
              <div
                key={index}
                className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg"
              >
                {letter}
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        {!isSolved && (
          <div className="mb-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value.toUpperCase())}
              placeholder="Type your answer..."
              className="w-full px-4 py-3 bg-[#2a2a2a] text-white rounded-lg border-2 border-gray-600 focus:border-purple-500 focus:outline-none text-center text-lg font-semibold uppercase"
              maxLength={currentWord.length}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
        )}

        {isSolved && (
          <div className="mb-4 p-4 bg-green-500/20 border-2 border-green-500/50 rounded-lg text-center">
            <p className="text-green-400 font-bold text-lg mb-2">🎉 Correct!</p>
            <p className="text-green-300 text-sm">
              You got it in {attempts} attempt{attempts !== 1 ? 's' : ''}!
            </p>
            <p className="text-green-200 text-xs mt-1">
              +{Math.max(100 - ((attempts - 1) * 10), 50)} points
            </p>
          </div>
        )}

        {attempts > 0 && !isSolved && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-center">
            <p className="text-red-300 text-sm">Try again! Keep going!</p>
          </div>
        )}

        <div className="flex gap-3">
          {!isSolved && (
            <>
              <button
                onClick={giveHint}
                className="flex-1 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition text-sm"
              >
                💡 Hint
              </button>
              <button
                onClick={handleSubmit}
                disabled={userInput.length !== currentWord.length}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Submit
              </button>
            </>
          )}
          {isSolved && (
            <>
              <button
                onClick={scrambleWord}
                className="flex-1 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2"
              >
                <Shuffle size={18} />
                Retry
              </button>
              <button
                onClick={nextWord}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition flex items-center justify-center gap-2"
              >
                Next
                <ArrowRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Timer Widget Component
const TimerWidget = ({ timeRemaining, isTracking, onGameClick }) => {
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

  if (!isTracking) return null;

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
      <button
        onClick={onGameClick}
        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all flex items-center gap-2 text-sm animate-pulse"
      >
        <span>🎮</span>
        Play
      </button>
    </div>
  );
};

const GPSTracking = ({ sessionId, onComplete, onNext, onTrackingStarted, gpsTrackingActive, gpsTrackingData }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    lat: 6.5244,
    lon: 3.3792,
    accuracy: 10,
    timestamp: new Date().toISOString()
  });
  const [trackingProgress, setTrackingProgress] = useState(0);
  const [error, setError] = useState(null);
  const [timeAtAddress, setTimeAtAddress] = useState(0);
  const [heartbeatCount, setHeartbeatCount] = useState(0);
  const [isWithinAddress, setIsWithinAddress] = useState(true);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3600);
  const [pulseSize, setPulseSize] = useState(1);

  const TRACKING_DURATION = 3600; // 1 hour in seconds
  const HEARTBEAT_INTERVAL = 30; // Send location every 30 seconds
  const REQUIRED_TIME_AT_ADDRESS = 2400; // 40 minutes (2/3 of hour)

  const trackingIntervalRef = useRef(null);
  const trackingStartTimeRef = useRef(null);
  const pulseIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  // Pulsating effect
  useEffect(() => {
    if (isTracking) {
      pulseIntervalRef.current = setInterval(() => {
        setPulseSize(prev => prev === 1 ? 1.3 : 1);
      }, 1000);
    } else {
      if (pulseIntervalRef.current) {
        clearInterval(pulseIntervalRef.current);
      }
    }
    
    return () => {
      if (pulseIntervalRef.current) {
        clearInterval(pulseIntervalRef.current);
      }
    };
  }, [isTracking]);

  const startTracking = () => {
    console.log('Start tracking clicked!');
    setIsTracking(true);
    setError(null);
    setTrackingProgress(0);
    setTimeAtAddress(0);
    setHeartbeatCount(0);
    setTimeRemaining(TRACKING_DURATION);
    trackingStartTimeRef.current = Date.now();

    // Notify parent that tracking has started
    if (onTrackingStarted) {
      onTrackingStarted({
        startTime: Date.now(),
        timeRemaining: TRACKING_DURATION,
        duration: TRACKING_DURATION
      });
    }

    // Update timer and send heartbeats
    trackingIntervalRef.current = setInterval(() => {
      updateTrackingProgress();
      
      // Send heartbeat every HEARTBEAT_INTERVAL seconds
      const elapsed = Math.floor((Date.now() - trackingStartTimeRef.current) / 1000);
      if (elapsed % HEARTBEAT_INTERVAL === 0 && elapsed > 0) {
        setHeartbeatCount(prev => prev + 1);
        console.log('Heartbeat sent to server');
      }
      
      // Increment time at address
      setTimeAtAddress(prev => prev + 1);
    }, 1000);
  };

  const stopTracking = () => {
    if (trackingIntervalRef.current) {
      clearInterval(trackingIntervalRef.current);
      trackingIntervalRef.current = null;
    }
  };

  const updateTrackingProgress = () => {
    const elapsed = (Date.now() - trackingStartTimeRef.current) / 1000;
    const progress = Math.min((elapsed / TRACKING_DURATION) * 100, 100);
    const remaining = Math.max(TRACKING_DURATION - elapsed, 0);
    
    setTrackingProgress(Math.round(progress));
    setTimeRemaining(Math.floor(remaining));

    // Timer completed
    if (elapsed >= TRACKING_DURATION && onComplete) {
      stopTracking();
      onComplete({
        success: timeAtAddress >= REQUIRED_TIME_AT_ADDRESS,
        totalPings: heartbeatCount,
        heartbeats: heartbeatCount,
        timeAtAddress: timeAtAddress,
        requiredTime: REQUIRED_TIME_AT_ADDRESS,
        duration: TRACKING_DURATION
      });
    }
  };

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
    <div className="min-h-screen bg-black py-6 px-4">
      {/* Timer Widget - Always visible when tracking */}
      <TimerWidget 
        timeRemaining={timeRemaining} 
        isTracking={isTracking}
        onGameClick={() => setShowMiniGame(true)}
      />

      {/* Word Puzzle Game Modal */}
      {showMiniGame && (
        <WordPuzzleGame onClose={() => setShowMiniGame(false)} />
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Address Verification
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            {!isTracking 
              ? "Click 'Start Tracking' to begin verification" 
              : "Verification in progress - stay at your address"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border-2 border-red-500/50 rounded-xl flex items-center gap-3">
            <XCircle className="text-red-400 flex-shrink-0" size={24} />
            <div className="flex-1">
              <p className="text-red-300 font-medium text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Location Indicator */}
          <div className="md:col-span-2">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-8 border-2 border-yellow-500/30 shadow-[0_0_30px_rgba(255,215,0,0.1)] min-h-[400px] flex items-center justify-center relative overflow-hidden">
              {/* Background Grid Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'linear-gradient(#2a2a2a 1px, transparent 1px), linear-gradient(90deg, #2a2a2a 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }}></div>
              </div>

              {!isTracking ? (
                <div className="text-center text-gray-500 z-10">
                  <MapPin size={64} className="mx-auto mb-4 opacity-30" />
                  <p className="text-base">Start tracking to begin verification</p>
                </div>
              ) : (
                <div className="relative z-10">
                  {/* Pulsating Location Pin */}
                  <div className="relative flex items-center justify-center">
                    {/* Outer pulse rings */}
                    <div 
                      className="absolute w-32 h-32 bg-yellow-400/20 rounded-full animate-ping"
                      style={{ animationDuration: '2s' }}
                    ></div>
                    <div 
                      className="absolute w-24 h-24 bg-yellow-400/30 rounded-full animate-ping"
                      style={{ animationDuration: '1.5s', animationDelay: '0.5s' }}
                    ></div>
                    
                    {/* Main location pin */}
                    <div 
                      className="relative w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,215,0,0.6)] transition-transform duration-1000"
                      style={{ transform: `scale(${pulseSize})` }}
                    >
                      <MapPin size={32} className="text-black" />
                    </div>
                  </div>

                  <div className="text-center mt-8">
                    <p className="text-yellow-400 font-bold text-lg mb-2">
                      📍 Tracking Your Location
                    </p>
                    <p className="text-gray-400 text-sm">
                      Stay at your address for verification
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tracking Controls & Stats */}
          <div className="space-y-4">
            {/* Tracking Stats */}
            {isTracking && (
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-yellow-500/30 rounded-xl p-4">
                <h3 className="font-bold text-white mb-4 text-lg">Verification Status</h3>

                <div className="space-y-4">
                  {/* Heartbeats Sent */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-400">Heartbeats Sent</span>
                      <span className="font-bold text-yellow-400 text-lg">{heartbeatCount}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Every {HEARTBEAT_INTERVAL} seconds
                    </div>
                  </div>

                  {/* Time at Address */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-400">Time at Address</span>
                      <span className="font-bold text-yellow-400 text-lg">
                        {formatTime(timeAtAddress)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Required: {formatTime(REQUIRED_TIME_AT_ADDRESS)}
                    </div>
                    <div className="w-full h-2 bg-[#2a2a2a] rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((timeAtAddress / REQUIRED_TIME_AT_ADDRESS) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Location Status */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-400">Location Status</span>
                      <span className="font-bold text-lg text-green-400">
                        ✓ At Address
                      </span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-400">Overall Progress</span>
                      <span className="font-bold text-yellow-400 text-lg">{trackingProgress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                        style={{ width: `${trackingProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Accuracy */}
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">GPS Accuracy</span>
                      <span className="font-bold text-yellow-400 text-lg">
                        ±{Math.round(currentLocation.accuracy)}m
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tracking Controls */}
            <div className="space-y-3">
              {!isTracking && (
                <button
                  onClick={startTracking}
                  className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-bold rounded-xl hover:shadow-[0_8px_24px_rgba(255,215,0,0.5)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Navigation size={20} />
                  Start Tracking
                </button>
              )}
              
              {/* Next Button - Shows immediately after Start Tracking */}
              {isTracking && onNext && (
                <button
                  onClick={onNext}
                  className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:shadow-[0_8px_24px_rgba(255,215,0,0.5)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  Continue to Next Step
                  <ArrowRight size={20} />
                </button>
              )}
            </div>

            {isTracking && (
              <div className="p-4 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl text-center">
                <p className="text-yellow-400 text-sm font-semibold mb-2">
                  ✓ Tracking Active
                </p>
                <p className="text-yellow-500/70 text-xs">
                  You can continue with other verification steps. The timer will stay visible at the top-right corner of all pages.
                </p>
              </div>
            )}

            {/* How It Works */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-[#2a2a2a] rounded-xl p-4">
              <h4 className="font-bold text-white mb-3 text-sm">How It Works</h4>
              <ul className="text-xs text-gray-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5">•</span>
                  <span>Click "Start Tracking" to begin</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5">•</span>
                  <span>Location tracked automatically for 1 hour</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5">•</span>
                  <span>Click "Continue" to proceed with other steps</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5">•</span>
                  <span>Timer stays visible on all pages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5">•</span>
                  <span>This step completes automatically when timer ends</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5">•</span>
                  <span>Play word game while you wait!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPSTracking;
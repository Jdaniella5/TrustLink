// src/components/verification/TrustScore.jsx
// FIXED: Removed automatic onComplete call, fixed navigation

import React, { useState, useEffect } from 'react';
import { 
  Award, 
  CheckCircle, 
  Loader, 
  Download,
  Share2,
  TrendingUp,
  Camera,
  MapPin,
  Smartphone,
  Mail,
  Users,
  Shield,
  Copy,
  Check,
  Home
} from 'lucide-react';
import { getTrustScore } from '../../services/api';

const TrustScore = ({ sessionId, onComplete, navigate }) => {
  // Component state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [copiedPassport, setCopiedPassport] = useState(false);

  // Category icons mapping
  const CATEGORY_ICONS = {
    identity: Camera,
    address: MapPin,
    device: Smartphone,
    email: Mail,
    community: Users
  };

  // Category colors
  const CATEGORY_COLORS = {
    identity: 'blue',
    address: 'green',
    device: 'purple',
    email: 'orange',
    community: 'pink'
  };

  // =============================================================================
  // LOAD TRUST SCORE
  // =============================================================================

  useEffect(() => {
    loadTrustScore();
  }, []);

  /**
   * Fetch trust score from backend
   * FIXED: Only call onComplete when user explicitly clicks button
   */
  const loadTrustScore = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch trust score calculation from backend
      const data = await getTrustScore(sessionId);
      
      setScoreData(data);
      
      // DON'T call onComplete automatically - only when user navigates away
      // This prevents the redirect loop
      
    } catch (err) {
      console.error('Failed to load trust score:', err);
      setError('Failed to calculate trust score. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // =============================================================================
  // NAVIGATION
  // =============================================================================

  /**
   * Handle navigation to dashboard
   * FIXED: Use React Router navigate instead of window.location
   */
  const handleGoToDashboard = () => {
    // Mark verification as complete
    if (onComplete && scoreData) {
      onComplete({
        success: true,
        trustScore: scoreData.trustScore,
        trustPassport: scoreData.trustPassport
      });
    }

    // Navigate to dashboard or home
    if (navigate) {
      navigate('/dashboard'); // Change this to your actual dashboard route
    } else {
      // Fallback if navigate prop not provided
      window.location.href = '/dashboard';
    }
  };

  // =============================================================================
  // HELPER FUNCTIONS
  // =============================================================================

  /**
   * Get score color based on value
   * @param {number} score - Score value (0-100)
   * @returns {string} - Color class
   */
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  /**
   * Get score label based on value
   * @param {number} score - Score value (0-100)
   * @returns {string} - Score label
   */
  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 50) return 'Average';
    return 'Needs Improvement';
  };

  /**
   * Copy trust passport to clipboard
   */
  const handleCopyPassport = async () => {
    if (!scoreData?.trustPassport) return;

    try {
      await navigator.clipboard.writeText(scoreData.trustPassport);
      setCopiedPassport(true);
      setTimeout(() => setCopiedPassport(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  /**
   * Download trust score as JSON
   */
  const handleDownloadReport = () => {
    if (!scoreData) return;

    const report = {
      trustScore: scoreData.trustScore,
      breakdown: scoreData.breakdown,
      trustPassport: scoreData.trustPassport,
      verifiedAt: scoreData.verifiedAt,
      sessionId: sessionId
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trust-score-${sessionId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // =============================================================================
  // RENDER UI
  // =============================================================================

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <Loader className="animate-spin mx-auto mb-4 text-blue-500" size={64} />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Calculating Your Trust Score
          </h3>
          <p className="text-gray-600">
            Analyzing all verification data...
          </p>
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Processing identity verification
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-75"></div>
              Analyzing location data
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-150"></div>
              Validating device fingerprint
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award size={40} className="text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Error Calculating Score
          </h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={loadTrustScore}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Success state with score
  if (!scoreData) return null;

  const scoreColor = getScoreColor(scoreData.trustScore);
  const scoreLabel = getScoreLabel(scoreData.trustScore);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Your Trust Score
        </h2>
        <p className="text-gray-600">
          Verification complete! Here's your detailed trust assessment
        </p>
      </div>

      {/* Main Score Card */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-2xl p-8 mb-6 text-white">
        <div className="text-center">
          <div className="inline-block p-4 bg-white bg-opacity-20 rounded-full mb-4">
            <Award size={64} />
          </div>
          
          <div className="mb-4">
            <div className={`text-7xl font-bold mb-2 ${scoreColor}`}>
              {scoreData.trustScore}
            </div>
            <div className="text-2xl font-semibold opacity-90">
              {scoreLabel}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm opacity-75">
            <Shield size={16} />
            <span>Trust Score Verified</span>
          </div>

          {/* Score Meter */}
          <div className="mt-6 bg-white bg-opacity-20 rounded-full h-4 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${scoreData.trustScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Breakdown by Category */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp size={24} className="text-blue-500" />
          Score Breakdown
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(scoreData.breakdown).map(([category, score]) => {
            const Icon = CATEGORY_ICONS[category];
            const color = CATEGORY_COLORS[category];
            
            return (
              <div
                key={category}
                className={`bg-${color}-50 border border-${color}-200 rounded-lg p-4`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon size={20} className={`text-${color}-500`} />
                    <span className="font-semibold text-gray-800 capitalize">
                      {category}
                    </span>
                  </div>
                  <span className={`text-2xl font-bold text-${color}-600`}>
                    {score}
                  </span>
                </div>
                <div className={`w-full bg-${color}-200 rounded-full h-2`}>
                  <div
                    className={`bg-${color}-500 h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust Passport */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Shield size={24} className="text-green-500" />
          Trust Passport
        </h3>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-2">
            Your unique trust verification token (JWT)
          </p>
          <div className="bg-white border border-gray-200 rounded-lg p-3 font-mono text-xs break-all mb-3">
            {scoreData.trustPassport}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleCopyPassport}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm"
            >
              {copiedPassport ? (
                <>
                  <Check size={16} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy Token
                </>
              )}
            </button>
            
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
            >
              <Download size={16} />
              Download Report
            </button>
          </div>
        </div>
      </div>

      {/* Verification Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Verification Summary
        </h3>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <CheckCircle className="text-blue-500" size={24} />
            <div>
              <p className="font-semibold text-gray-800">Identity Verified</p>
              <p className="text-sm text-gray-600">Facial liveness detection completed</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="text-green-500" size={24} />
            <div>
              <p className="font-semibold text-gray-800">Location Verified</p>
              <p className="text-sm text-gray-600">GPS movement tracking completed</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <CheckCircle className="text-purple-500" size={24} />
            <div>
              <p className="font-semibold text-gray-800">Device Registered</p>
              <p className="text-sm text-gray-600">Unique device fingerprint captured</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
            <CheckCircle className="text-orange-500" size={24} />
            <div>
              <p className="font-semibold text-gray-800">Email Confirmed</p>
              <p className="text-sm text-gray-600">Email address verified via OTP</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
            <CheckCircle className="text-pink-500" size={24} />
            <div>
              <p className="font-semibold text-gray-800">Community Trust</p>
              <p className="text-sm text-gray-600">Vouchers added for peer verification</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Session ID</p>
            <p className="font-mono text-gray-800">{sessionId}</p>
          </div>
          <div>
            <p className="text-gray-600">Verified At</p>
            <p className="font-mono text-gray-800">
              {new Date(scoreData.verifiedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action - FIXED */}
      <div className="text-center">
        <button
          onClick={handleGoToDashboard}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition text-lg font-semibold shadow-lg flex items-center gap-2 mx-auto"
        >
          <Home size={24} />
          Go to Dashboard
        </button>
      </div>

      {/* What's Next Section */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2 text-sm">What's Next?</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Use your Trust Passport to access secure services</li>
          <li>• Share your trust score with platforms that require verification</li>
          <li>• Your score will improve as vouchers confirm your identity</li>
          <li>• Keep your device and email verified to maintain your score</li>
          <li>• You can re-verify anytime to update your score</li>
        </ul>
      </div>
    </div>
  );
};

export default TrustScore;
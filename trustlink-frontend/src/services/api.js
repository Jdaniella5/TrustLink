// src/services/api.js
// API service connected to TrustLink backend
// Backend URL: https://trustlink-backend-jthl.onrender.com

import axios from 'axios';

// =============================================================================
// API CONFIGURATION
// =============================================================================

// Backend base URL - your deployed Render backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://trustlink-backend-jthl.onrender.com/api';

// Toggle between mock and real API (set to false to use real backend)
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true' || false; // Now defaults to REAL API

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout (Render can be slow on cold starts)
  withCredentials: true, // Important: Send cookies with requests
});

// Add request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('sessionId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// =============================================================================
// MOCK DATA (for testing - remove when fully connected)
// =============================================================================

const generateMockUser = (email, name) => ({
  _id: `user_${Date.now()}`,
  email,
  name,
  sessionId: `session_${Date.now()}`,
  trustScore: 0,
  emailVerified: false,
  createdAt: new Date().toISOString(),
});

const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// =============================================================================
// AUTHENTICATION API
// =============================================================================

/**
 * Register a new user
 * POST /api/user/register
 * @param {Object} userData - { name, email, password }
 * @returns {Promise<Object>} - { userId, sessionId, message }
 */
export const registerUser = async (userData) => {
  if (USE_MOCK) {
    await mockDelay();
    const user = generateMockUser(userData.email, userData.name);
    return { userId: user._id, sessionId: user.sessionId, message: 'Registered' };
  }

  try {
    const response = await api.post('/user/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password
    });
    
    // Store userId and sessionId for later use
    if (response.data.userId) {
      sessionStorage.setItem('userId', response.data.userId);
    }
    if (response.data.sessionId) {
      sessionStorage.setItem('sessionId', response.data.sessionId);
    }
    
    return response.data;
  } catch (error) {
    console.error('Register error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Login existing user
 * POST /api/user/login
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} - { userId, sessionId, message }
 */
export const loginUser = async (credentials) => {
  if (USE_MOCK) {
    await mockDelay();
    const user = generateMockUser(credentials.email, 'Mock User');
    return { userId: user._id, sessionId: user.sessionId, message: 'Logged in' };
  }

  try {
    const response = await api.post('/user/login', {
      email: credentials.email,
      password: credentials.password
    });
    
    // Store auth data
    if (response.data.userId) {
      sessionStorage.setItem('userId', response.data.userId);
    }
    if (response.data.sessionId) {
      sessionStorage.setItem('sessionId', response.data.sessionId);
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Verify email with OTP
 * POST /api/user/verify-otp
 * @param {string} userId - User ID
 * @param {string} otp - OTP code from email
 * @returns {Promise<Object>} - { message }
 */
export const verifyEmailOTP = async (userId, otp) => {
  if (USE_MOCK) {
    await mockDelay(600);
    const isValid = otp === '123456';
    return { 
      success: isValid, 
      message: isValid ? 'Email verified' : 'Invalid OTP' 
    };
  }

  try {
    const response = await api.post('/user/verify-otp', {
      userId,
      otp
    });
    return response.data;
  } catch (error) {
    console.error('Verify OTP error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Logout current user
 */
export const logoutUser = async () => {
  sessionStorage.clear();
  return { success: true };
};

// =============================================================================
// IDENTITY VERIFICATION API (Face + Liveness)
// =============================================================================

/**
 * Submit face verification with liveness detection
 * POST /api/face/verify
 * @param {string} sessionId - Session ID
 * @param {Object} faceData - { actionsDetected: Array, embedding: Array }
 * @returns {Promise<Object>} - { success, liveness, faceMatched, trustScore }
 */
export const submitFaceData = async (sessionId, faceData) => {
  if (USE_MOCK) {
    await mockDelay(1000);
    console.log('📸 Mock: Submitted face data', { sessionId, faceData });
    return { 
      success: true, 
      message: 'Face data verified',
      liveness: {
        livenessScore: faceData.livenessScore || 0.95,
        actionsDetected: faceData.actions || [],
        verified: true
      }
    };
  }

  try {
    const response = await api.post('/face/verify', {
      sessionId,
      actionsDetected: faceData.actions || [],
      embedding: faceData.embedding || null
    });
    return response.data;
  } catch (error) {
    console.error('Face verification error:', error.response?.data || error.message);
    throw error;
  }
};

// =============================================================================
// ADDRESS VERIFICATION API (GPS + Movement)
// =============================================================================

/**
 * Submit GPS ping
 * POST /api/motion/ping
 * @param {string} sessionId - Session ID
 * @param {Object} locationData - { lat, lon, accuracy, ts }
 * @returns {Promise<Object>} - { movementScore, totalDistance, avgSpeed }
 */
export const submitLocationPing = async (sessionId, locationData) => {
  if (USE_MOCK) {
    await mockDelay(300);
    console.log('📍 Mock: Location ping', { sessionId, locationData });
    return { success: true, movementScore: 0.75 };
  }

  try {
    const response = await api.post('/motion/ping', {
      sessionId,
      lat: locationData.lat,
      lon: locationData.lon,
      accuracy: locationData.accuracy,
      ts: locationData.timestamp || new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('Location ping error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Complete motion tracking
 * POST /api/motion/complete
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} - { movementScore, totalDistance }
 */
export const completeMotionTracking = async (sessionId) => {
  if (USE_MOCK) {
    await mockDelay(500);
    return { success: true, movementScore: 0.85, totalDistance: 120 };
  }

  try {
    const response = await api.post('/motion/complete', { sessionId });
    return response.data;
  } catch (error) {
    console.error('Complete motion error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Submit multiple location pings (batch)
 * Note: Backend doesn't have batch endpoint, so we'll send individually
 */
export const submitLocationBatch = async (sessionId, locationPings) => {
  if (USE_MOCK) {
    await mockDelay(500);
    return { success: true, totalPings: locationPings.length };
  }

  try {
    // Send pings individually since backend doesn't support batch
    const results = await Promise.all(
      locationPings.map(ping => submitLocationPing(sessionId, ping))
    );
    return { 
      success: true, 
      totalPings: results.length,
      movementScore: results[results.length - 1]?.movementScore 
    };
  } catch (error) {
    console.error('Batch location error:', error.response?.data || error.message);
    throw error;
  }
};

// =============================================================================
// DEVICE FINGERPRINT API
// =============================================================================

/**
 * Register device fingerprint
 * POST /api/device/register
 * @param {string} userId - User ID
 * @param {Object} deviceData - Device fingerprint data
 * @returns {Promise<Object>} - { deviceId, message }
 */
export const registerDevice = async (userId, deviceData) => {
  if (USE_MOCK) {
    await mockDelay(500);
    console.log('💻 Mock: Device registered', { userId, deviceData });
    return { success: true, deviceId: `device_${Date.now()}` };
  }

  try {
    // Convert device fingerprint to string for hashing
    const fingerprintString = JSON.stringify(deviceData);
    
    const response = await api.post('/device/register', {
      userId,
      fingerprint: fingerprintString,
      meta: deviceData
    });
    
    // Store device ID for OTP verification
    if (response.data.deviceId) {
      sessionStorage.setItem('deviceId', response.data.deviceId);
    }
    
    return response.data;
  } catch (error) {
    console.error('Device register error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Verify device with OTP
 * POST /api/device/verify-otp
 * @param {string} deviceId - Device ID
 * @param {string} otp - OTP code
 * @returns {Promise<Object>} - { message }
 */
export const verifyDeviceOTP = async (deviceId, otp) => {
  if (USE_MOCK) {
    await mockDelay(600);
    return { success: true, message: 'Device verified' };
  }

  try {
    const response = await api.post('/device/verify-otp', {
      deviceId,
      otp
    });
    return response.data;
  } catch (error) {
    console.error('Device verify error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Legacy: Submit device fingerprint (calls registerDevice)
 */
export const submitDeviceFingerprint = async (sessionId, deviceData) => {
  const userId = sessionStorage.getItem('userId');
  if (!userId) {
    throw new Error('User ID not found. Please login first.');
  }
  return registerDevice(userId, deviceData);
};

// =============================================================================
// EMAIL VERIFICATION API
// =============================================================================

/**
 * Request email verification
 * Note: Email is sent during registration, this is just for re-sending
 */
export const requestEmailVerification = async (email) => {
  if (USE_MOCK) {
    await mockDelay(800);
    return { success: true, message: 'Verification email sent', mockOTP: '123456' };
  }

  // Backend sends OTP during registration, no separate request needed
  // You could add a resend endpoint if needed
  return { 
    success: true, 
    message: 'Check your email for OTP (sent during registration)' 
  };
};

// =============================================================================
// COMMUNITY VOUCH API
// =============================================================================

/**
 * Submit community vouch
 * POST /api/community/vouch
 * @param {string} sessionId - Session ID
 * @param {string} refereeUserId - Referee user ID
 * @returns {Promise<Object>} - { success, communityVouches }
 */
export const submitCommunityVouch = async (sessionId, refereeUserId) => {
  if (USE_MOCK) {
    await mockDelay(500);
    console.log('🤝 Mock: Community vouch', { sessionId, refereeUserId });
    return { success: true, communityVouches: 1 };
  }

  try {
    const response = await api.post('/community/vouch', {
      sessionId,
      refereeUserId
    });
    return response.data;
  } catch (error) {
    console.error('Community vouch error:', error.response?.data || error.message);
    throw error;
  }
};

// =============================================================================
// TRUST SCORE API
// =============================================================================

/**
 * Get trust score
 * GET /api/trust/score/:sessionId
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} - { trustScore, label, breakdown, passportJwt }
 */
export const getTrustScore = async (sessionId) => {
  if (USE_MOCK) {
    await mockDelay(1500);
    return {
      trustScore: 87,
      label: 'Excellent',
      breakdown: {
        livenessScore: 0.9,
        faceMatched: true,
        movementScore: 0.85,
        deviceVerified: true,
        emailVerified: true,
        communityVouches: 2
      },
      passportJwt: `TRUST_${Date.now()}`,
      verifiedAt: new Date().toISOString()
    };
  }

  try {
    const response = await api.get(`/trust/score/${sessionId}`);
    
    // Store trust passport JWT in cookie (backend also sets it)
    if (response.data.passportJwt) {
      sessionStorage.setItem('trustPassport', response.data.passportJwt);
    }
    
    return response.data;
  } catch (error) {
    console.error('Get trust score error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get verification progress
 * Note: Backend doesn't have progress endpoint, we'll fetch session data
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} - Progress object
 */
export const getVerificationProgress = async (sessionId) => {
  if (USE_MOCK) {
    await mockDelay(300);
    return {
      identity: false,
      address: false,
      device: false,
      email: false,
      community: false,
      trustScore: false
    };
  }

  try {
    // Fetch trust score which contains all verification status
    const trustData = await getTrustScore(sessionId);
    
    // Map backend signals to frontend progress
    return {
      identity: (trustData.breakdown?.livenessScore || 0) > 0,
      address: (trustData.breakdown?.movementScore || 0) > 0,
      device: trustData.breakdown?.deviceVerified || false,
      email: trustData.breakdown?.emailVerified || false,
      community: (trustData.breakdown?.communityVouches || 0) > 0,
      trustScore: trustData.trustScore > 0
    };
  } catch (error) {
    // If error, return empty progress
    console.error('Get progress error:', error.response?.data || error.message);
    return {
      identity: false,
      address: false,
      device: false,
      email: false,
      community: false,
      trustScore: false
    };
  }
};

// =============================================================================
// EXPORT API INSTANCE & FUNCTIONS
// =============================================================================

export { api };

export default {
  // Auth
  registerUser,
  loginUser,
  logoutUser,
  verifyEmailOTP,
  
  // Identity
  submitFaceData,
  
  // Address
  submitLocationPing,
  submitLocationBatch,
  completeMotionTracking,
  
  // Email
  requestEmailVerification,
  
  // Device
  registerDevice,
  verifyDeviceOTP,
  submitDeviceFingerprint,
  
  // Community
  submitCommunityVouch,
  
  // Trust Score
  getTrustScore,
  getVerificationProgress,
};
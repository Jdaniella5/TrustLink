// src/services/api.js
// This file contains all API calls to the backend
// Currently using MOCK data - replace with real axios calls when backend is ready

import axios from 'axios';

// Base URL - change this to your backend URL when ready
// For Vite, use import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Check if we should use mock API (useful during development)
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true' || true; // Default to true for now

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor to attach JWT token to all requests
api.interceptors.request.use(
  (config) => {
    // Get token from sessionStorage (we'll store it after login)
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

// Add response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// =============================================================================
// MOCK DATA GENERATORS (Remove these when backend is ready)
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

const generateMockToken = () => {
  // Fake JWT token for development
  return `mock_token_${Date.now()}`;
};

// Simulate network delay for realistic testing
const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// =============================================================================
// AUTHENTICATION API
// =============================================================================

/**
 * Register a new user
 * @param {Object} userData - { name, email, password }
 * @returns {Promise<Object>} - { user, token, sessionId }
 */
export const registerUser = async (userData) => {
  if (USE_MOCK) {
    await mockDelay();
    const user = generateMockUser(userData.email, userData.name);
    const token = generateMockToken();
    return { user, token, sessionId: user.sessionId };
  }

  // REAL API CALL (uncomment when backend is ready):
  // const response = await api.post('/auth/register', userData);
  // return response.data;
  
  throw new Error('Backend not connected yet');
};

/**
 * Login existing user
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} - { user, token, sessionId }
 */
export const loginUser = async (credentials) => {
  if (USE_MOCK) {
    await mockDelay();
    const user = generateMockUser(credentials.email, 'Mock User');
    const token = generateMockToken();
    return { user, token, sessionId: user.sessionId };
  }

  // REAL API CALL (uncomment when backend is ready):
  // const response = await api.post('/auth/login', credentials);
  // return response.data;
  
  throw new Error('Backend not connected yet');
};

/**
 * Logout current user
 */
export const logoutUser = async () => {
  if (USE_MOCK) {
    await mockDelay(200);
    return { success: true };
  }

  // REAL API CALL (uncomment when backend is ready):
  // const response = await api.post('/auth/logout');
  // return response.data;
  
  return { success: true };
};

// =============================================================================
// IDENTITY VERIFICATION API (Face + Liveness)
// =============================================================================

/**
 * Submit face embedding and liveness score
 * @param {string} sessionId - User's session ID
 * @param {Object} faceData - { embedding: Array, livenessScore: Number, actions: Array }
 * @returns {Promise<Object>} - { success, message }
 */
export const submitFaceData = async (sessionId, faceData) => {
  if (USE_MOCK) {
    await mockDelay(1000);
    console.log('📸 Mock: Submitted face data', { sessionId, faceData });
    return { 
      success: true, 
      message: 'Face data verified successfully',
      livenessScore: faceData.livenessScore 
    };
  }

  // REAL API CALL (uncomment when backend is ready):
  // const response = await api.post(`/session/${sessionId}/face`, {
  //   embedding: faceData.embedding,
  //   livenessScore: faceData.livenessScore,
  //   timestamp: new Date().toISOString(),
  //   actionsCompleted: faceData.actions
  // });
  // return response.data;
  
  throw new Error('Backend not connected yet');
};

// =============================================================================
// ADDRESS VERIFICATION API (GPS + Movement)
// =============================================================================

/**
 * Submit GPS ping with location data
 * @param {string} sessionId - User's session ID
 * @param {Object} locationData - { lat, lon, accuracy, timestamp }
 * @returns {Promise<Object>} - { success, message }
 */
export const submitLocationPing = async (sessionId, locationData) => {
  if (USE_MOCK) {
    await mockDelay(300);
    console.log('📍 Mock: Submitted location ping', { sessionId, locationData });
    return { success: true, message: 'Location recorded' };
  }

  // REAL API CALL (uncomment when backend is ready):
  // const response = await api.post(`/session/${sessionId}/ping`, {
  //   lat: locationData.lat,
  //   lon: locationData.lon,
  //   acc: locationData.accuracy,
  //   ts: locationData.timestamp
  // });
  // return response.data;
  
  throw new Error('Backend not connected yet');
};

/**
 * Submit multiple location pings at once
 * @param {string} sessionId - User's session ID
 * @param {Array} locationPings - Array of location objects
 * @returns {Promise<Object>} - { success, message, totalPings }
 */
export const submitLocationBatch = async (sessionId, locationPings) => {
  if (USE_MOCK) {
    await mockDelay(500);
    console.log('📍 Mock: Submitted location batch', { sessionId, count: locationPings.length });
    return { 
      success: true, 
      message: 'Location batch recorded',
      totalPings: locationPings.length 
    };
  }

  // REAL API CALL (uncomment when backend is ready):
  // const response = await api.post(`/session/${sessionId}/ping/batch`, {
  //   pings: locationPings
  // });
  // return response.data;
  
  throw new Error('Backend not connected yet');
};

// =============================================================================
// EMAIL VERIFICATION API
// =============================================================================

/**
 * Request email verification (sends email with link/OTP)
 * @param {string} email - User's email address
 * @returns {Promise<Object>} - { success, message }
 */
export const requestEmailVerification = async (email) => {
  if (USE_MOCK) {
    await mockDelay(800);
    console.log('📧 Mock: Email verification sent to', email);
    return { 
      success: true, 
      message: 'Verification email sent',
      mockOTP: '123456' // In real app, this comes via email
    };
  }

  // REAL API CALL (uncomment when backend is ready):
  // const response = await api.post('/verify-email/request', { email });
  // return response.data;
  
  throw new Error('Backend not connected yet');
};

/**
 * Verify email with OTP code
 * @param {string} email - User's email
 * @param {string} otp - OTP code from email
 * @returns {Promise<Object>} - { success, message }
 */
export const verifyEmailOTP = async (email, otp) => {
  if (USE_MOCK) {
    await mockDelay(600);
    const isValid = otp === '123456'; // Mock OTP
    console.log('📧 Mock: Email verification', { email, otp, isValid });
    return { 
      success: isValid, 
      message: isValid ? 'Email verified' : 'Invalid OTP' 
    };
  }

  // REAL API CALL (uncomment when backend is ready):
  // const response = await api.post('/verify-email', { email, otp });
  // return response.data;
  
  throw new Error('Backend not connected yet');
};

// =============================================================================
// DEVICE FINGERPRINT API
// =============================================================================

/**
 * Submit device fingerprint data
 * @param {string} sessionId - User's session ID
 * @param {Object} deviceData - Device fingerprint object
 * @returns {Promise<Object>} - { success, message }
 */
export const submitDeviceFingerprint = async (sessionId, deviceData) => {
  if (USE_MOCK) {
    await mockDelay(500);
    console.log('💻 Mock: Submitted device fingerprint', { sessionId, deviceData });
    return { success: true, message: 'Device registered' };
  }

  // REAL API CALL (uncomment when backend is ready):
  // const response = await api.post(`/session/${sessionId}/device`, deviceData);
  // return response.data;
  
  throw new Error('Backend not connected yet');
};

// =============================================================================
// COMMUNITY VOUCH API
// =============================================================================

/**
 * Submit a community vouch (referee)
 * @param {string} sessionId - User's session ID
 * @param {Object} vouchData - { referrerUserId, relationship, notes }
 * @returns {Promise<Object>} - { success, message }
 */
export const submitCommunityVouch = async (sessionId, vouchData) => {
  if (USE_MOCK) {
    await mockDelay(500);
    console.log('🤝 Mock: Submitted community vouch', { sessionId, vouchData });
    return { success: true, message: 'Vouch recorded' };
  }

  // REAL API CALL (uncomment when backend is ready):
  // const response = await api.post(`/session/${sessionId}/community-vouch`, vouchData);
  // return response.data;
  
  throw new Error('Backend not connected yet');
};

// =============================================================================
// TRUST SCORE API
// =============================================================================

/**
 * Get calculated trust score for user
 * @param {string} sessionId - User's session ID
 * @returns {Promise<Object>} - { trustScore, breakdown, trustPassport }
 */
export const getTrustScore = async (sessionId) => {
  if (USE_MOCK) {
    await mockDelay(1500); // Simulate computation time
    console.log('🎯 Mock: Calculated trust score for', sessionId);
    
    // Mock trust score calculation
    const mockScore = {
      trustScore: 87,
      breakdown: {
        identity: 90,      // Face + liveness
        address: 85,       // GPS + movement
        device: 88,        // Device fingerprint
        email: 100,        // Email verified
        community: 75      // Vouches
      },
      trustPassport: `TRUST_${Date.now()}`, // JWT token in real app
      verifiedAt: new Date().toISOString()
    };
    
    return mockScore;
  }

  // REAL API CALL (uncomment when backend is ready):
  // const response = await api.get(`/session/${sessionId}/trust-score`);
  // return response.data;
  
  throw new Error('Backend not connected yet');
};

/**
 * Get user's verification progress
 * @param {string} sessionId - User's session ID
 * @returns {Promise<Object>} - Progress status for each verification step
 */
export const getVerificationProgress = async (sessionId) => {
  if (USE_MOCK) {
    await mockDelay(300);
    return {
      identity: false,
      address: false,
      device: false,
      email: false,
      community: false
    };
  }

  // REAL API CALL (uncomment when backend is ready):
  // const response = await api.get(`/session/${sessionId}/progress`);
  // return response.data;
  
  throw new Error('Backend not connected yet');
};

// =============================================================================
// EXPORT ALL API FUNCTIONS
// =============================================================================

export default {
  // Auth
  registerUser,
  loginUser,
  logoutUser,
  
  // Identity
  submitFaceData,
  
  // Address
  submitLocationPing,
  submitLocationBatch,
  
  // Email
  requestEmailVerification,
  verifyEmailOTP,
  
  // Device
  submitDeviceFingerprint,
  
  // Community
  submitCommunityVouch,
  
  // Trust Score
  getTrustScore,
  getVerificationProgress,
};
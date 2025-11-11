// src/components/verification/DeviceFingerprint.jsx
// This component captures device/browser fingerprint for device verification
// Uses FingerprintJS library to generate unique device identifier

import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Monitor, 
  CheckCircle, 
  Loader, 
  Info,
  Globe,
  Cpu,
  HardDrive
} from 'lucide-react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { submitDeviceFingerprint } from '../../services/api';

const DeviceFingerprint = ({ sessionId, onComplete }) => {
  // Component state
  const [isCapturing, setIsCapturing] = useState(false);
  const [deviceData, setDeviceData] = useState(null);
  const [fingerprintId, setFingerprintId] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // =============================================================================
  // AUTO-CAPTURE ON MOUNT
  // =============================================================================

  useEffect(() => {
    // Automatically start capturing device info when component mounts
    captureDeviceFingerprint();
  }, []);

  // =============================================================================
  // DEVICE FINGERPRINT CAPTURE
  // =============================================================================

  /**
   * Capture device fingerprint and browser information
   */
  const captureDeviceFingerprint = async () => {
    setIsCapturing(true);
    setError(null);

    try {
      // Initialize FingerprintJS
      const fp = await FingerprintJS.load();
      
      // Get the visitor identifier (unique device fingerprint)
      const result = await fp.get();
      const visitorId = result.visitorId;
      
      setFingerprintId(visitorId);

      // Collect additional device information
      const deviceInfo = collectDeviceInfo();
      
      // Combine fingerprint with device info
      const fullDeviceData = {
        fingerprintId: visitorId,
        ...deviceInfo,
        components: result.components, // Detailed component data from FingerprintJS
        confidence: result.confidence?.score || 1.0
      };

      setDeviceData(fullDeviceData);
      
      console.log('📱 Device fingerprint captured:', fullDeviceData);

    } catch (err) {
      console.error('Failed to capture device fingerprint:', err);
      setError('Failed to capture device information. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  /**
   * Collect device and browser information using Navigator API
   * @returns {Object} - Device information object
   */
  const collectDeviceInfo = () => {
    const nav = window.navigator;
    const screen = window.screen;

    return {
      // Browser Information
      browser: {
        userAgent: nav.userAgent,
        language: nav.language,
        languages: nav.languages || [],
        platform: nav.platform,
        vendor: nav.vendor || 'Unknown',
        cookieEnabled: nav.cookieEnabled,
        doNotTrack: nav.doNotTrack || 'unspecified',
        onLine: nav.onLine
      },

      // Screen Information
      screen: {
        width: screen.width,
        height: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
        orientation: screen.orientation?.type || 'unknown'
      },

      // Hardware Information
      hardware: {
        deviceMemory: nav.deviceMemory || 'unknown', // GB of RAM
        hardwareConcurrency: nav.hardwareConcurrency || 'unknown', // CPU cores
        maxTouchPoints: nav.maxTouchPoints || 0
      },

      // Timezone & Location
      timezone: {
        offset: new Date().getTimezoneOffset(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },

      // Window Information
      window: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
        devicePixelRatio: window.devicePixelRatio || 1
      },

      // Canvas Fingerprint (helps detect uniqueness)
      canvas: generateCanvasFingerprint(),

      // WebGL Fingerprint (GPU information)
      webgl: getWebGLInfo(),

      // Timestamp
      capturedAt: new Date().toISOString()
    };
  };

  /**
   * Generate canvas fingerprint for additional uniqueness
   * Different devices render canvas slightly differently
   * @returns {string} - Canvas fingerprint hash
   */
  const generateCanvasFingerprint = () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Draw some text and shapes
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('Trust Verify', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Canvas Print', 4, 17);

      // Get image data and create hash
      return canvas.toDataURL();
    } catch (err) {
      return 'canvas_unavailable';
    }
  };

  /**
   * Get WebGL information (GPU details)
   * @returns {Object} - WebGL renderer and vendor info
   */
  const getWebGLInfo = () => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        return { available: false };
      }

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      
      return {
        available: true,
        vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'unknown',
        renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown',
        version: gl.getParameter(gl.VERSION),
        shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
      };
    } catch (err) {
      return { available: false, error: err.message };
    }
  };

  // =============================================================================
  // SUBMIT FINGERPRINT
  // =============================================================================

  /**
   * Submit device fingerprint to backend
   */
  const handleSubmit = async () => {
    if (!deviceData) {
      setError('No device data to submit. Please try capturing again.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Submit to backend
      const response = await submitDeviceFingerprint(sessionId, deviceData);

      if (response.success) {
        // Notify parent component
        if (onComplete) {
          onComplete({
            success: true,
            fingerprintId: fingerprintId,
            deviceInfo: deviceData
          });
        }
      }
    } catch (err) {
      console.error('Failed to submit device fingerprint:', err);
      setError('Failed to submit device information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Retry capturing device fingerprint
   */
  const retryCapture = () => {
    setDeviceData(null);
    setFingerprintId(null);
    setError(null);
    captureDeviceFingerprint();
  };

  // =============================================================================
  // RENDER HELPERS
  // =============================================================================

  /**
   * Detect device type from user agent
   * @returns {string} - 'mobile', 'tablet', or 'desktop'
   */
  const getDeviceType = () => {
    if (!deviceData) return 'unknown';
    
    const ua = deviceData.browser.userAgent.toLowerCase();
    
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(ua)) {
      return 'tablet';
    }
    if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  };

  /**
   * Get browser name from user agent
   * @returns {string} - Browser name
   */
  const getBrowserName = () => {
    if (!deviceData) return 'Unknown';
    
    const ua = deviceData.browser.userAgent;
    
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    if (ua.includes('Opera')) return 'Opera';
    
    return 'Unknown Browser';
  };

  /**
   * Get OS name from platform
   * @returns {string} - OS name
   */
  const getOSName = () => {
    if (!deviceData) return 'Unknown';
    
    const ua = deviceData.browser.userAgent;
    
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    
    return 'Unknown OS';
  };

  // =============================================================================
  // RENDER UI
  // =============================================================================

  const deviceType = getDeviceType();
  const browserName = getBrowserName();
  const osName = getOSName();

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Device Verification
        </h2>
        <p className="text-gray-600">
          We'll register your device to prevent unauthorized access
        </p>
      </div>

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
        <Info className="text-blue-500 flex-shrink-0 mt-1" size={20} />
        <div className="text-sm text-blue-700">
          <p className="font-medium mb-1">What is device fingerprinting?</p>
          <p>
            We collect anonymous technical information about your device (browser type, 
            screen size, timezone, etc.) to create a unique identifier. This helps prevent 
            fraud and ensures account security.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <div className="flex-1">
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={retryCapture}
              className="text-red-600 underline text-sm mt-1"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Capturing State */}
      {isCapturing && (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <Loader className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
          <p className="text-lg text-gray-700 font-medium">
            Capturing device information...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This will only take a moment
          </p>
        </div>
      )}

      {/* Device Information Display */}
      {!isCapturing && deviceData && (
        <div className="space-y-6">
          {/* Device Overview Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Device Information Captured
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Device Type */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  {deviceType === 'mobile' ? (
                    <Smartphone className="text-purple-500" size={24} />
                  ) : (
                    <Monitor className="text-purple-500" size={24} />
                  )}
                  <span className="font-semibold text-gray-800">Device Type</span>
                </div>
                <p className="text-2xl font-bold text-purple-600 capitalize">
                  {deviceType}
                </p>
              </div>

              {/* Browser */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="text-blue-500" size={24} />
                  <span className="font-semibold text-gray-800">Browser</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {browserName}
                </p>
              </div>

              {/* Operating System */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <HardDrive className="text-green-500" size={24} />
                  <span className="font-semibold text-gray-800">OS</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {osName}
                </p>
              </div>
            </div>
          </div>

          {/* Fingerprint ID Card */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Unique Device ID</p>
                <p className="text-2xl font-bold font-mono">{fingerprintId}</p>
              </div>
              <CheckCircle size={48} className="opacity-90" />
            </div>
          </div>

          {/* Detailed Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Technical Details
            </h3>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              {/* Screen Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2">Screen</p>
                <div className="space-y-1 text-gray-600">
                  <p>Resolution: {deviceData.screen.width} × {deviceData.screen.height}</p>
                  <p>Color Depth: {deviceData.screen.colorDepth}-bit</p>
                  <p>Pixel Ratio: {deviceData.window.devicePixelRatio}x</p>
                </div>
              </div>

              {/* Hardware Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Cpu size={16} /> Hardware
                </p>
                <div className="space-y-1 text-gray-600">
                  <p>CPU Cores: {deviceData.hardware.hardwareConcurrency || 'Unknown'}</p>
                  <p>RAM: {deviceData.hardware.deviceMemory || 'Unknown'} GB</p>
                  <p>Touch Points: {deviceData.hardware.maxTouchPoints}</p>
                </div>
              </div>

              {/* Browser Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2">Browser</p>
                <div className="space-y-1 text-gray-600">
                  <p>Language: {deviceData.browser.language}</p>
                  <p>Platform: {deviceData.browser.platform}</p>
                  <p>Cookies: {deviceData.browser.cookieEnabled ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>

              {/* Location Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2">Location</p>
                <div className="space-y-1 text-gray-600">
                  <p>Timezone: {deviceData.timezone.timezone}</p>
                  <p>UTC Offset: {deviceData.timezone.offset} min</p>
                  <p>Online: {deviceData.browser.onLine ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* WebGL Information (if available) */}
          {deviceData.webgl.available && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                GPU Information
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Vendor:</strong> {deviceData.webgl.vendor}</p>
                <p><strong>Renderer:</strong> {deviceData.webgl.renderer}</p>
                <p className="text-xs mt-2 text-gray-500">
                  This information helps us detect device changes and prevent fraud.
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              onClick={retryCapture}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
            >
              Recapture
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Verify Device
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceFingerprint;
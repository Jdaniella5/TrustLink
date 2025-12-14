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

const DeviceFingerprint = ({ sessionId, onComplete }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [deviceData, setDeviceData] = useState(null);
  const [fingerprintId, setFingerprintId] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    captureDeviceFingerprint();
  }, []);

  const captureDeviceFingerprint = async () => {
    setIsCapturing(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const visitorId = generateFingerprint();
      setFingerprintId(visitorId);

      const deviceInfo = collectDeviceInfo();
      
      const fullDeviceData = {
        fingerprintId: visitorId,
        ...deviceInfo,
        confidence: 0.95
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

  const generateFingerprint = () => {
    const components = [
      window.navigator.userAgent,
      window.screen.width,
      window.screen.height,
      window.screen.colorDepth,
      new Date().getTimezoneOffset(),
      window.navigator.language
    ];
    
    const str = components.join('|');
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return Math.abs(hash).toString(16).padStart(16, '0');
  };

  const collectDeviceInfo = () => {
    const nav = window.navigator;
    const screen = window.screen;

    return {
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

      screen: {
        width: screen.width,
        height: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
        orientation: screen.orientation?.type || 'unknown'
      },

      hardware: {
        deviceMemory: nav.deviceMemory || 'unknown',
        hardwareConcurrency: nav.hardwareConcurrency || 'unknown',
        maxTouchPoints: nav.maxTouchPoints || 0
      },

      timezone: {
        offset: new Date().getTimezoneOffset(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },

      window: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
        devicePixelRatio: window.devicePixelRatio || 1
      },

      canvas: generateCanvasFingerprint(),
      webgl: getWebGLInfo(),
      capturedAt: new Date().toISOString()
    };
  };

  const generateCanvasFingerprint = () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('Trust Verify', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Canvas Print', 4, 17);

      return canvas.toDataURL();
    } catch (err) {
      return 'canvas_unavailable';
    }
  };

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

  const handleSubmit = async () => {
    if (!deviceData) {
      setError('No device data to submit. Please try capturing again.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (onComplete) {
        onComplete({
          success: true,
          fingerprintId: fingerprintId,
          deviceInfo: deviceData
        });
      }
    } catch (err) {
      console.error('Failed to submit device fingerprint:', err);
      setError('Failed to submit device information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const retryCapture = () => {
    setDeviceData(null);
    setFingerprintId(null);
    setError(null);
    captureDeviceFingerprint();
  };

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

  const deviceType = getDeviceType();
  const browserName = getBrowserName();
  const osName = getOSName();

  return (
    <div className="min-h-screen bg-black py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Device Verification
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            We'll register your device to prevent unauthorized access
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-6 p-4 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl flex items-start gap-3">
          <Info className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
          <div className="text-sm text-yellow-100">
            <p className="font-semibold mb-1 text-yellow-400">What is device fingerprinting?</p>
            <p className="text-yellow-200/80">
              We collect anonymous technical information about your device (browser type, 
              screen size, timezone, etc.) to create a unique identifier. This helps prevent 
              fraud and ensures account security.
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border-2 border-red-500/50 rounded-xl flex items-center gap-3">
            <div className="flex-1">
              <p className="text-red-300 font-medium">{error}</p>
              <button
                onClick={retryCapture}
                className="text-red-400 underline text-sm mt-1 hover:text-red-300 transition"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Capturing State */}
        {isCapturing && (
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-yellow-500/30 rounded-2xl p-8 text-center shadow-[0_0_30px_rgba(255,215,0,0.1)]">
            <Loader className="animate-spin mx-auto mb-4 text-yellow-400" size={48} />
            <p className="text-lg text-white font-semibold">
              Capturing device information...
            </p>
            <p className="text-sm text-gray-400 mt-2">
              This will only take a moment
            </p>
          </div>
        )}

        {/* Device Information Display */}
        {!isCapturing && deviceData && (
          <div className="space-y-6">
            {/* Device Overview Card */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-yellow-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(255,215,0,0.1)]">
              <h3 className="text-xl font-bold text-white mb-6">
                Device Information Captured
              </h3>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Device Type */}
                <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-2 border-yellow-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    {deviceType === 'mobile' ? (
                      <Smartphone className="text-yellow-400" size={24} />
                    ) : (
                      <Monitor className="text-yellow-400" size={24} />
                    )}
                    <span className="font-semibold text-gray-300 text-sm">Device Type</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-400 capitalize">
                    {deviceType}
                  </p>
                </div>

                {/* Browser */}
                <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-2 border-yellow-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe className="text-yellow-400" size={24} />
                    <span className="font-semibold text-gray-300 text-sm">Browser</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-400">
                    {browserName}
                  </p>
                </div>

                {/* Operating System */}
                <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-2 border-yellow-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <HardDrive className="text-yellow-400" size={24} />
                    <span className="font-semibold text-gray-300 text-sm">OS</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-400">
                    {osName}
                  </p>
                </div>
              </div>
            </div>

            {/* Fingerprint ID Card */}
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-2xl p-6 shadow-[0_0_30px_rgba(255,215,0,0.3)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-black/70 font-medium mb-1">Unique Device ID</p>
                  <p className="text-2xl font-bold font-mono text-black">{fingerprintId}</p>
                </div>
                <CheckCircle size={48} className="text-black/80" />
              </div>
            </div>

            {/* Detailed Information */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-yellow-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(255,215,0,0.1)]">
              <h3 className="text-lg font-bold text-white mb-4">
                Technical Details
              </h3>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                {/* Screen Information */}
                <div className="bg-[#2a2a2a] border border-yellow-500/20 rounded-xl p-4">
                  <p className="font-semibold text-yellow-400 mb-3">Screen</p>
                  <div className="space-y-2 text-gray-300">
                    <p>Resolution: <span className="text-white font-medium">{deviceData.screen.width} × {deviceData.screen.height}</span></p>
                    <p>Color Depth: <span className="text-white font-medium">{deviceData.screen.colorDepth}-bit</span></p>
                    <p>Pixel Ratio: <span className="text-white font-medium">{deviceData.window.devicePixelRatio}x</span></p>
                  </div>
                </div>

                {/* Hardware Information */}
                <div className="bg-[#2a2a2a] border border-yellow-500/20 rounded-xl p-4">
                  <p className="font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                    <Cpu size={16} /> Hardware
                  </p>
                  <div className="space-y-2 text-gray-300">
                    <p>CPU Cores: <span className="text-white font-medium">{deviceData.hardware.hardwareConcurrency || 'Unknown'}</span></p>
                    <p>RAM: <span className="text-white font-medium">{deviceData.hardware.deviceMemory || 'Unknown'} GB</span></p>
                    <p>Touch Points: <span className="text-white font-medium">{deviceData.hardware.maxTouchPoints}</span></p>
                  </div>
                </div>

                {/* Browser Information */}
                <div className="bg-[#2a2a2a] border border-yellow-500/20 rounded-xl p-4">
                  <p className="font-semibold text-yellow-400 mb-3">Browser</p>
                  <div className="space-y-2 text-gray-300">
                    <p>Language: <span className="text-white font-medium">{deviceData.browser.language}</span></p>
                    <p>Platform: <span className="text-white font-medium">{deviceData.browser.platform}</span></p>
                    <p>Cookies: <span className="text-white font-medium">{deviceData.browser.cookieEnabled ? 'Enabled' : 'Disabled'}</span></p>
                  </div>
                </div>

                {/* Location Information */}
                <div className="bg-[#2a2a2a] border border-yellow-500/20 rounded-xl p-4">
                  <p className="font-semibold text-yellow-400 mb-3">Location</p>
                  <div className="space-y-2 text-gray-300">
                    <p>Timezone: <span className="text-white font-medium">{deviceData.timezone.timezone}</span></p>
                    <p>UTC Offset: <span className="text-white font-medium">{deviceData.timezone.offset} min</span></p>
                    <p>Online: <span className="text-white font-medium">{deviceData.browser.onLine ? 'Yes' : 'No'}</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* WebGL Information (if available) */}
            {deviceData.webgl.available && (
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-yellow-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(255,215,0,0.1)]">
                <h3 className="text-lg font-bold text-white mb-4">
                  GPU Information
                </h3>
                <div className="text-sm text-gray-300 space-y-2">
                  <p><strong className="text-yellow-400">Vendor:</strong> <span className="text-white">{deviceData.webgl.vendor}</span></p>
                  <p><strong className="text-yellow-400">Renderer:</strong> <span className="text-white">{deviceData.webgl.renderer}</span></p>
                  <p className="text-xs mt-3 text-gray-500">
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
                className="px-6 py-3 bg-transparent border-2 border-gray-600 text-gray-400 font-semibold rounded-xl hover:border-yellow-400 hover:text-yellow-400 transition disabled:opacity-50 cursor-pointer"
              >
                Recapture
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-3.5 bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-bold rounded-xl hover:shadow-[0_8px_24px_rgba(255,215,0,0.5)] hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
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
    </div>
  );
};

export default DeviceFingerprint;
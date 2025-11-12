// // src/components/verification/GPSTracking.jsx
// // This component tracks user's GPS location and movement for address verification
// // Requires user to move around for 10-20 seconds to prove physical presence

// import React, { useState, useRef, useEffect } from 'react';
// import { MapPin, Navigation, CheckCircle, XCircle, Loader } from 'lucide-react';
// import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
// import { submitLocationPing, submitLocationBatch } from '../../services/api';

// const GPSTracking = ({ sessionId, onComplete }) => {
//   // Component state
//   const [isTracking, setIsTracking] = useState(false);
//   const [locationPermission, setLocationPermission] = useState(null); // null, 'granted', 'denied'
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [locationPings, setLocationPings] = useState([]); // Array of location points
//   const [trackingProgress, setTrackingProgress] = useState(0); // 0-100%
//   const [totalDistance, setTotalDistance] = useState(0); // Total distance moved in meters
//   const [error, setError] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Tracking configuration
//   const TRACKING_DURATION = 15; // seconds
//   const MIN_DISTANCE_REQUIRED = 10; // minimum 10 meters of movement
//   const PING_INTERVAL = 1000; // Send location every 1 second

//   // Refs
//   const watchIdRef = useRef(null);
//   const trackingIntervalRef = useRef(null);
//   const trackingStartTimeRef = useRef(null);

//   // Google Maps configuration
//   const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';
//   const mapContainerStyle = {
//     width: '100%',
//     height: '500px',
//     borderRadius: '12px'
//   };
//   const mapOptions = {
//     disableDefaultUI: false,
//     zoomControl: true,
//     streetViewControl: false,
//     fullscreenControl: false,
//   };

//   // =============================================================================
//   // LOCATION PERMISSION & INITIALIZATION
//   // =============================================================================

//   /**
//    * Request location permission when component mounts
//    */
//   useEffect(() => {
//     checkLocationPermission();
    
//     return () => {
//       // Cleanup: stop tracking when component unmounts
//       stopTracking();
//     };
//   }, []);

//   /**
//    * Check if browser supports geolocation and request permission
//    */
//   const checkLocationPermission = async () => {
//     if (!navigator.geolocation) {
//       setError('Geolocation is not supported by your browser');
//       setLocationPermission('denied');
//       return;
//     }

//     try {
//       // Try to get current position (this will prompt for permission)
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLocationPermission('granted');
//           const location = {
//             lat: position.coords.latitude,
//             lon: position.coords.longitude,
//             accuracy: position.coords.accuracy,
//             timestamp: new Date(position.timestamp).toISOString()
//           };
//           setCurrentLocation(location);
//           setError(null);
//         },
//         (err) => {
//           console.error('Location permission error:', err);
//           setLocationPermission('denied');
          
//           if (err.code === err.PERMISSION_DENIED) {
//             setError('Location permission denied. Please enable location access in your browser settings.');
//           } else if (err.code === err.POSITION_UNAVAILABLE) {
//             setError('Location information is unavailable. Please check your device settings.');
//           } else {
//             setError('Failed to get your location. Please try again.');
//           }
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 10000,
//           maximumAge: 0
//         }
//       );
//     } catch (err) {
//       console.error('Geolocation error:', err);
//       setError('Failed to access location services');
//       setLocationPermission('denied');
//     }
//   };

//   // =============================================================================
//   // LOCATION TRACKING
//   // =============================================================================

//   /**
//    * Start tracking user's location
//    */
//   const startTracking = () => {
//     if (!currentLocation) {
//       setError('Please allow location access first');
//       return;
//     }

//     setIsTracking(true);
//     setError(null);
//     setLocationPings([currentLocation]); // Start with current location
//     setTrackingProgress(0);
//     setTotalDistance(0);
//     trackingStartTimeRef.current = Date.now();

//     // Start watching position changes
//     watchIdRef.current = navigator.geolocation.watchPosition(
//       handleLocationUpdate,
//       handleLocationError,
//       {
//         enableHighAccuracy: true, // Use GPS if available
//         timeout: 5000,
//         maximumAge: 0
//       }
//     );

//     // Start progress tracking
//     trackingIntervalRef.current = setInterval(() => {
//       updateTrackingProgress();
//     }, 1000); // Update every second
//   };

//   /**
//    * Stop tracking user's location
//    */
//   const stopTracking = () => {
//     if (watchIdRef.current !== null) {
//       navigator.geolocation.clearWatch(watchIdRef.current);
//       watchIdRef.current = null;
//     }
//     if (trackingIntervalRef.current) {
//       clearInterval(trackingIntervalRef.current);
//       trackingIntervalRef.current = null;
//     }
//     setIsTracking(false);
//   };

//   /**
//    * Handle location update from GPS
//    * @param {GeolocationPosition} position - New position data
//    */
//   const handleLocationUpdate = (position) => {
//     const newLocation = {
//       lat: position.coords.latitude,
//       lon: position.coords.longitude,
//       accuracy: position.coords.accuracy,
//       timestamp: new Date(position.timestamp).toISOString()
//     };

//     // Update current location
//     setCurrentLocation(newLocation);

//     // Add to location pings array
//     setLocationPings(prev => {
//       const updated = [...prev, newLocation];
      
//       // Calculate total distance moved
//       if (prev.length > 0) {
//         const lastLocation = prev[prev.length - 1];
//         const distance = calculateDistance(
//           lastLocation.lat,
//           lastLocation.lon,
//           newLocation.lat,
//           newLocation.lon
//         );
//         setTotalDistance(prevDist => prevDist + distance);
//       }
      
//       return updated;
//     });
//   };

//   /**
//    * Handle location tracking error
//    * @param {GeolocationPositionError} err - Error object
//    */
//   const handleLocationError = (err) => {
//     console.error('Location tracking error:', err);
    
//     if (err.code === err.PERMISSION_DENIED) {
//       setError('Location permission was revoked. Please enable it again.');
//       stopTracking();
//     } else if (err.code === err.POSITION_UNAVAILABLE) {
//       setError('Unable to determine your location. Please ensure GPS is enabled.');
//     }
//   };

//   /**
//    * Update tracking progress based on time elapsed
//    */
//   const updateTrackingProgress = () => {
//     const elapsed = (Date.now() - trackingStartTimeRef.current) / 1000; // seconds
//     const progress = Math.min((elapsed / TRACKING_DURATION) * 100, 100);
//     setTrackingProgress(Math.round(progress));

//     // Auto-complete when duration reached
//     if (elapsed >= TRACKING_DURATION) {
//       stopTracking();
//       handleTrackingComplete();
//     }
//   };

//   /**
//    * Calculate distance between two GPS coordinates (Haversine formula)
//    * @param {number} lat1 - Latitude of point 1
//    * @param {number} lon1 - Longitude of point 1
//    * @param {number} lat2 - Latitude of point 2
//    * @param {number} lon2 - Longitude of point 2
//    * @returns {number} - Distance in meters
//    */
//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371e3; // Earth's radius in meters
//     const φ1 = (lat1 * Math.PI) / 180;
//     const φ2 = (lat2 * Math.PI) / 180;
//     const Δφ = ((lat2 - lat1) * Math.PI) / 180;
//     const Δλ = ((lon2 - lon1) * Math.PI) / 180;

//     const a =
//       Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//       Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c; // Distance in meters
//   };

//   // =============================================================================
//   // SUBMIT TRACKING DATA
//   // =============================================================================

//   /**
//    * Handle tracking completion - submit data to backend
//    */
//   const handleTrackingComplete = async () => {
//     // Check if user moved enough
//     if (totalDistance < MIN_DISTANCE_REQUIRED) {
//       setError(
//         `Please move around more. You've only moved ${Math.round(totalDistance)}m, need at least ${MIN_DISTANCE_REQUIRED}m.`
//       );
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       // Submit all location pings to backend
//       const response = await submitLocationBatch(sessionId, locationPings);

//       if (response.success) {
//         // Notify parent component
//         if (onComplete) {
//           onComplete({
//             success: true,
//             totalPings: locationPings.length,
//             totalDistance: totalDistance,
//             duration: TRACKING_DURATION
//           });
//         }
//       }
//     } catch (err) {
//       console.error('Failed to submit location data:', err);
//       setError('Failed to submit location data. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   /**
//    * Manual submit (for testing or if auto-complete fails)
//    */
//   const manualSubmit = () => {
//     stopTracking();
//     handleTrackingComplete();
//   };

//   /**
//    * Retry tracking
//    */
//   const retryTracking = () => {
//     setLocationPings([]);
//     setTotalDistance(0);
//     setTrackingProgress(0);
//     setError(null);
//     checkLocationPermission();
//   };

//   // =============================================================================
//   // RENDER UI
//   // =============================================================================

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       {/* Header */}
//       <div className="text-center mb-6">
//         <h2 className="text-3xl font-bold text-gray-800 mb-2">
//           Address Verification
//         </h2>
//         <p className="text-gray-600">
//           Move around for {TRACKING_DURATION} seconds to verify your location
//         </p>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
//           <XCircle className="text-red-500" size={24} />
//           <div className="flex-1">
//             <p className="text-red-700 font-medium">{error}</p>
//             {locationPermission === 'denied' && (
//               <button
//                 onClick={checkLocationPermission}
//                 className="text-red-600 underline text-sm mt-1"
//               >
//                 Try again
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Location Permission Status */}
//       {locationPermission === null && (
//         <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
//           <Loader className="text-blue-500 animate-spin" size={24} />
//           <p className="text-blue-700">Requesting location permission...</p>
//         </div>
//       )}

//       {/* Main Content */}
//       <div className="grid md:grid-cols-3 gap-6">
//         {/* Map Display */}
//         <div className="md:col-span-2">
//           {currentLocation ? (
//             <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
//               <GoogleMap
//                 mapContainerStyle={mapContainerStyle}
//                 center={{ lat: currentLocation.lat, lng: currentLocation.lon }}
//                 zoom={18}
//                 options={mapOptions}
//               >
//                 {/* Current Location Marker */}
//                 <Marker
//                   position={{ lat: currentLocation.lat, lng: currentLocation.lon }}
//                   icon={{
//                     path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
//                     scale: 8,
//                     fillColor: '#3b82f6',
//                     fillOpacity: 1,
//                     strokeColor: '#ffffff',
//                     strokeWeight: 2,
//                   }}
//                 />

//                 {/* Path Line (showing movement) */}
//                 {locationPings.length > 1 && (
//                   <Polyline
//                     path={locationPings.map(ping => ({
//                       lat: ping.lat,
//                       lng: ping.lon
//                     }))}
//                     options={{
//                       strokeColor: '#10b981',
//                       strokeOpacity: 0.8,
//                       strokeWeight: 3,
//                     }}
//                   />
//                 )}

//                 {/* All Location Pings as Dots */}
//                 {locationPings.map((ping, index) => (
//                   <Marker
//                     key={index}
//                     position={{ lat: ping.lat, lng: ping.lon }}
//                     icon={{
//                       path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
//                       scale: 4,
//                       fillColor: '#10b981',
//                       fillOpacity: 0.6,
//                       strokeColor: '#ffffff',
//                       strokeWeight: 1,
//                     }}
//                   />
//                 ))}
//               </GoogleMap>
//             </LoadScript>
//           ) : (
//             <div className="bg-gray-100 rounded-lg h-[500px] flex items-center justify-center">
//               <div className="text-center text-gray-500">
//                 <MapPin size={48} className="mx-auto mb-4 opacity-50" />
//                 <p className="text-lg">Waiting for location access...</p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Tracking Controls & Stats */}
//         <div className="space-y-4">
//           {/* Tracking Stats */}
//           <div className="bg-white border border-gray-200 rounded-lg p-4">
//             <h3 className="font-semibold text-gray-800 mb-3">Tracking Stats</h3>
            
//             <div className="space-y-3">
//               {/* Location Pings */}
//               <div>
//                 <div className="flex items-center justify-between text-sm mb-1">
//                   <span className="text-gray-600">Location Pings</span>
//                   <span className="font-bold text-gray-800">{locationPings.length}</span>
//                 </div>
//               </div>

//               {/* Distance Moved */}
//               <div>
//                 <div className="flex items-center justify-between text-sm mb-1">
//                   <span className="text-gray-600">Distance Moved</span>
//                   <span className="font-bold text-gray-800">
//                     {Math.round(totalDistance)}m
//                   </span>
//                 </div>
//                 <div className="text-xs text-gray-500">
//                   Min required: {MIN_DISTANCE_REQUIRED}m
//                 </div>
//               </div>

//               {/* Progress */}
//               <div>
//                 <div className="flex items-center justify-between text-sm mb-1">
//                   <span className="text-gray-600">Progress</span>
//                   <span className="font-bold text-gray-800">{trackingProgress}%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div
//                     className="bg-blue-500 h-2 rounded-full transition-all duration-300"
//                     style={{ width: `${trackingProgress}%` }}
//                   />
//                 </div>
//               </div>

//               {/* Accuracy */}
//               {currentLocation && (
//                 <div>
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-gray-600">GPS Accuracy</span>
//                     <span className="font-bold text-gray-800">
//                       ±{Math.round(currentLocation.accuracy)}m
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Tracking Controls */}
//           <div className="space-y-3">
//             {!isTracking && trackingProgress === 0 && locationPermission === 'granted' && (
//               <button
//                 onClick={startTracking}
//                 className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
//               >
//                 <Navigation size={20} />
//                 Start Tracking
//               </button>
//             )}

//             {isTracking && (
//               <>
//                 <button
//                   onClick={stopTracking}
//                   className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
//                 >
//                   Stop Tracking
//                 </button>
//                 <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
//                   <p className="text-blue-700 text-sm font-medium">
//                     Please walk around slowly
//                   </p>
//                   <p className="text-blue-600 text-xs mt-1">
//                     Stay outdoors for better GPS accuracy
//                   </p>
//                 </div>
//               </>
//             )}

//             {trackingProgress === 100 && !isSubmitting && (
//               <button
//                 onClick={manualSubmit}
//                 className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2"
//               >
//                 <CheckCircle size={20} />
//                 Submit Verification
//               </button>
//             )}

//             {isSubmitting && (
//               <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
//                 <Loader className="animate-spin mx-auto mb-2 text-blue-500" size={32} />
//                 <p className="text-blue-700 font-medium">
//                   Submitting location data...
//                 </p>
//               </div>
//             )}

//             {locationPings.length > 0 && !isTracking && !isSubmitting && (
//               <button
//                 onClick={retryTracking}
//                 className="w-full py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm"
//               >
//                 Start Over
//               </button>
//             )}
//           </div>

//           {/* Instructions */}
//           <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
//             <h4 className="font-semibold text-gray-800 mb-2 text-sm">Instructions</h4>
//             <ul className="text-xs text-gray-600 space-y-1">
//               <li>• Allow location access when prompted</li>
//               <li>• Move around for {TRACKING_DURATION} seconds</li>
//               <li>• Walk at least {MIN_DISTANCE_REQUIRED} meters</li>
//               <li>• Stay outdoors for best GPS signal</li>
//               <li>• Keep this tab active during tracking</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GPSTracking;

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, CheckCircle, XCircle, Loader } from 'lucide-react';

const GPSTracking = ({ sessionId, onComplete }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [locationPermission, setLocationPermission] = useState('granted');
  const [currentLocation, setCurrentLocation] = useState({
    lat: 6.5244,
    lon: 3.3792,
    accuracy: 10,
    timestamp: new Date().toISOString()
  });
  const [locationPings, setLocationPings] = useState([]);
  const [trackingProgress, setTrackingProgress] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const TRACKING_DURATION = 8; // seconds
  const MIN_DISTANCE_REQUIRED = 5; // meters

  const trackingIntervalRef = useRef(null);
  const trackingStartTimeRef = useRef(null);
  const canvasRef = useRef(null);
  const simulationIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  // Draw map on canvas
  useEffect(() => {
    if (locationPings.length > 0) {
      drawMap();
    }
  }, [locationPings, currentLocation]);

  // Simulate location updates
  const simulateLocationUpdates = () => {
    simulationIntervalRef.current = setInterval(() => {
      // Simulate random walk around initial location
      const latOffset = (Math.random() - 0.5) * 0.0001; // ~10m variation
      const lonOffset = (Math.random() - 0.5) * 0.0001; // ~10m variation

      const newLocation = {
        lat: currentLocation.lat + latOffset,
        lon: currentLocation.lon + lonOffset,
        accuracy: 10 + Math.random() * 5,
        timestamp: new Date().toISOString()
      };

      setCurrentLocation(newLocation);

      setLocationPings(prev => {
        const updated = [...prev, newLocation];

        if (prev.length > 0) {
          const lastLocation = prev[prev.length - 1];
          const distance = calculateDistance(
            lastLocation.lat,
            lastLocation.lon,
            newLocation.lat,
            newLocation.lon
          );
          setTotalDistance(prevDist => prevDist + distance);
        }

        return updated;
      });
    }, 1000);
  };

  const startTracking = () => {
    setIsTracking(true);
    setError(null);
    setLocationPings([currentLocation]);
    setTrackingProgress(0);
    setTotalDistance(0);
    trackingStartTimeRef.current = Date.now();

    // Start simulating location updates
    simulateLocationUpdates();

    // Update progress
    trackingIntervalRef.current = setInterval(() => {
      updateTrackingProgress();
    }, 1000);
  };

  const stopTracking = () => {
    if (trackingIntervalRef.current) {
      clearInterval(trackingIntervalRef.current);
      trackingIntervalRef.current = null;
    }
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    setIsTracking(false);
  };

  const updateTrackingProgress = () => {
    const elapsed = (Date.now() - trackingStartTimeRef.current) / 1000;
    const progress = Math.min((elapsed / TRACKING_DURATION) * 100, 100);
    setTrackingProgress(Math.round(progress));

    if (elapsed >= TRACKING_DURATION) {
      stopTracking();
      handleTrackingComplete();
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const drawMap = () => {
    if (!canvasRef.current || locationPings.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, height);

    // Find bounds
    let minLat = locationPings[0].lat;
    let maxLat = locationPings[0].lat;
    let minLon = locationPings[0].lon;
    let maxLon = locationPings[0].lon;

    locationPings.forEach(ping => {
      minLat = Math.min(minLat, ping.lat);
      maxLat = Math.max(maxLat, ping.lat);
      minLon = Math.min(minLon, ping.lon);
      maxLon = Math.max(maxLon, ping.lon);
    });

    const latRange = maxLat - minLat || 0.0001;
    const lonRange = maxLon - minLon || 0.0001;
    const padding = 40;

    // Convert lat/lon to canvas coordinates
    const toCanvasX = (lon) => {
      return padding + ((lon - minLon) / lonRange) * (width - 2 * padding);
    };

    const toCanvasY = (lat) => {
      return height - padding - ((lat - minLat) / latRange) * (height - 2 * padding);
    };

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const x = padding + ((width - 2 * padding) / 3) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();

      const y = padding + ((height - 2 * padding) / 3) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw path line
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    locationPings.forEach((ping, index) => {
      const x = toCanvasX(ping.lon);
      const y = toCanvasY(ping.lat);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw location dots
    locationPings.forEach((ping, index) => {
      const x = toCanvasX(ping.lon);
      const y = toCanvasY(ping.lat);

      if (index === locationPings.length - 1) {
        // Current location - blue
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        // Previous locations - green
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw border
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.strokeRect(padding, padding, width - 2 * padding, height - 2 * padding);
  };

  const handleTrackingComplete = async () => {
   
    setIsSubmitting(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (onComplete) {
        onComplete({
          success: true,
          totalPings: locationPings.length,
          totalDistance: totalDistance,
          duration: TRACKING_DURATION
        });
      }
    } catch (err) {
      console.error('Failed to submit location data:', err);
      setError('Failed to submit location data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const manualSubmit = () => {
    stopTracking();
    handleTrackingComplete();
  };

  const retryTracking = () => {
    setLocationPings([]);
    setTotalDistance(0);
    setTrackingProgress(0);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Address Verification
        </h2>
        <p className="text-gray-600">
          Tracking your location for {TRACKING_DURATION} seconds
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <XCircle className="text-red-500" size={24} />
          <div className="flex-1">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Map Canvas */}
        <div className="md:col-span-2">
          <canvas
            ref={canvasRef}
            width={500}
            height={400}
            className="w-full border border-gray-200 rounded-lg bg-gray-100"
          />
          {locationPings.length === 0 && (
            <div className="text-center text-gray-500 mt-4">
              <MapPin size={32} className="mx-auto mb-2 opacity-50" />
              <p>Click "Start Tracking" to begin location capture</p>
            </div>
          )}
        </div>

        {/* Tracking Controls & Stats */}
        <div className="space-y-4">
          {/* Tracking Stats */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Tracking Stats</h3>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Location Pings</span>
                  <span className="font-bold text-gray-800">{locationPings.length}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Distance Moved</span>
                  <span className="font-bold text-gray-800">
                    {Math.round(totalDistance * 100) / 100}m
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Min required: {MIN_DISTANCE_REQUIRED}m
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-bold text-gray-800">{trackingProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${trackingProgress}%` }}
                  />
                </div>
              </div>

              {currentLocation && (
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">GPS Accuracy</span>
                    <span className="font-bold text-gray-800">
                      ±{Math.round(currentLocation.accuracy)}m
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tracking Controls */}
          <div className="space-y-3">
            {!isTracking && trackingProgress === 0 && (
              <button
                onClick={startTracking}
                className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
              >
                <Navigation size={20} />
                Start Tracking
              </button>
            )}

            {isTracking && (
              <>
                <button
                  onClick={stopTracking}
                  className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Stop Tracking
                </button>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <p className="text-blue-700 text-sm font-medium">
                    Tracking in progress...
                  </p>
                  <p className="text-blue-600 text-xs mt-1">
                    Simulating location data
                  </p>
                </div>
              </>
            )}

            {trackingProgress === 100 && !isSubmitting && (
              <button
                onClick={manualSubmit}
                className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                Submit Verification
              </button>
            )}

            {isSubmitting && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <Loader className="animate-spin mx-auto mb-2 text-blue-500" size={32} />
                <p className="text-blue-700 font-medium">
                  Submitting location data...
                </p>
              </div>
            )}

            {locationPings.length > 0 && !isTracking && !isSubmitting && (
              <button
                onClick={retryTracking}
                className="w-full py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm"
              >
                Start Over
              </button>
            )}
          </div>

          {/* Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2 text-sm">Info</h4>
            <p className="text-xs text-gray-600">
              This is a simulated GPS tracker for testing. In production, real GPS coordinates would be used.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPSTracking;
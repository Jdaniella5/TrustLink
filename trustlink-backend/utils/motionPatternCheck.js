import getDistanceMeters from './getGpsDistance.js';

// gpsData: array of {lat, lon, accuracy, ts}
export const analyzeMotionPattern = (gpsData) => {
  if (!gpsData || gpsData.length < 3) {
    return { movementScore: 0, totalDistance: 0, avgSpeed: 0 };
  }

  let totalDist = 0;
  for (let i = 1; i < gpsData.length; i++) {
    totalDist += getDistanceMeters(gpsData[i-1], gpsData[i]);
  }
  const timeSecs = (new Date(gpsData[gpsData.length-1].ts) - new Date(gpsData[0].ts)) / 1000;
  const avgSpeed = timeSecs > 0 ? totalDist / timeSecs : 0; // m/s

  // simple heuristics:
  // - walking typical avgSpeed 0.4 - 1.8 m/s
  // - distance > 50m -> good
  let speedScore = 0;
  if (avgSpeed >= 0.4 && avgSpeed <= 1.8) speedScore = 1;
  else if (avgSpeed > 1.8 && avgSpeed <= 5) speedScore = 0.6;
  else if (avgSpeed < 0.4) speedScore = 0.3;

  const distScore = Math.min(1, totalDist / 50); // >=50m => 1

  const movementScore = Math.min(1, 0.6 * speedScore + 0.4 * distScore);

  return { movementScore, totalDistance: totalDist, avgSpeed };
};

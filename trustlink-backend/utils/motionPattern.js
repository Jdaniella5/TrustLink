import { haversine } from './geoUtils.js';
export const analyzeMotionPattern = (pings) => {
  if (!pings || pings.length < 3) return { movementScore: 0, totalDistance:0, avgSpeed:0 };
  let total = 0;
  for (let i=1;i<pings.length;i++) total += haversine(pings[i-1], pings[i]);
  const timeSecs = (new Date(pings[pings.length-1].ts) - new Date(pings[0].ts))/1000 || 1;
  const avgSpeed = total / timeSecs;
  let speedScore = 0;
  if (avgSpeed >= 0.4 && avgSpeed <= 1.8) speedScore = 1;
  else if (avgSpeed > 1.8 && avgSpeed <= 5) speedScore = 0.6;
  else if (avgSpeed < 0.4) speedScore = 0.3;
  const distScore = Math.min(1, total/50);
  const movementScore = Math.min(1, 0.6*speedScore + 0.4*distScore);
  return { movementScore, totalDistance: total, avgSpeed };
};

import { WEIGHTS } from '../config/trustConfig.js';
export const calculateTrustScore = (signals) => {
  let score = 0;
  score += (signals.livenessScore || 0) * (WEIGHTS.liveness);
  if (signals.faceMatched) score += WEIGHTS.faceMatch;
  score += (signals.movementScore || 0) * (WEIGHTS.movement);
  if (signals.deviceVerified) score += WEIGHTS.device;
  if (signals.emailVerified) score += WEIGHTS.email;
  const communityPoints = Math.min((signals.communityVouches || 0) * 3, 10); // each +3, cap at 10
  score += communityPoints;
  return Math.round(Math.min(100, score));
};
export const mapScoreLabel = (score) => {
  if (score <= 30) return 'Critical';
  if (score <= 50) return 'Bad';
  if (score <= 70) return 'Good';
  return 'Excellent';
};

import calculateTrustScore from '../utils/calculateTrustScore.js';

// Accept raw signals, normalize, and return final score + breakdown
export const computeTrust = (signals) => {
  const score = calculateTrustScore(signals);
  const breakdown = {
    liveness: Math.round((signals.livenessScore || 0) * 100),
    faceMatched: signals.faceMatched ? 15 : 0,
    movement: Math.round((signals.movementScore || 0) * 100),
    device: signals.deviceVerified ? 10 : 0,
    email: signals.emailVerified ? 10 : 0,
    community: Math.min((signals.communityVouches || 0) * 5, 10)
  };
  return { score, breakdown };
};

import { WEIGHTS } from "../config/trustConfig.js";

export const calculateTrustScore = (session) => {
  let score = 0;

  if (session.emailVerifiedAt) score += WEIGHTS.email;
  if (session.face === "verified") score += WEIGHTS.faceMatch;
  if (session.primaryDeviceId) score += WEIGHTS.device;

  score += session.communityVouches * 3;
  score -= session.movementScore || 0;

  return Math.max(0, Math.min(100, score));
};

export const mapScoreLabel = (score) => {
  if (score < 30) return "Critical";
  if (score < 50) return "Bad";
  if (score < 70) return "Good";
  return "Excellent";
};

// signals: { livenessScore, faceMatched, movementScore, deviceVerified, emailVerified, communityVouches }
export default function calculateTrustScore(signals) {
  const {
    livenessScore = 0,
    faceMatched = false,
    movementScore = 0,
    deviceVerified = false,
    emailVerified = false,
    communityVouches = 0
  } = signals;

  let score = 0;
  score += livenessScore * 30;         // up to 30
  if (faceMatched) score += 15;        // up to 15
  score += movementScore * 25;         // up to 25
  if (deviceVerified) score += 10;     // up to 10
  if (emailVerified) score += 10;      // up to 10
  score += Math.min(communityVouches * 5, 10); // up to 10

  return Math.round(Math.min(100, score));
}

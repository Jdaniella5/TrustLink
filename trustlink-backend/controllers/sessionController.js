import Session from "../models/sessionModel.js";
import { calculateTrustScore, mapScoreLabel } from "../utils/trustCalc.js";
import { recalcSessionTrust } from "../utils/recalculateTrust.js";


export const markAddressVerified = async (sessionId, confidence = 100) => {
  const session = await Session.findById(sessionId);
  if (!session) return;

  session.addressVerifiedAt = new Date();
  session.addressConfidence = confidence;
  await session.save();

  await recalcSessionTrust(sessionId);
};

export const calculateSessionTrust = async (req, res) => {
  const { sessionId } = req.params;

  const session = await Session.findById(sessionId);
  if (!session) return res.status(404).json({ message: "Session not found" });

  const score = calculateTrustScore(session);
  const label = mapScoreLabel(score);

  session.trustScore = score;
  session.trustLabel = label;
  session.scoredAt = new Date();
  await session.save();

  res.json({
    sessionId,
    trustScore: score,
    trustLabel: label
  });
};

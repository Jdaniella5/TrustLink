import Session from "../models/sessionModel.js";
import { calculateTrustScore, mapScoreLabel } from "./trustCalc.js";
import { generateTrustPassportInternal } from "../services/trustPassService.js";

export const recalcSessionTrust = async (sessionId) => {
  const session = await Session.findById(sessionId);
  if (!session) return;

  const score = calculateTrustScore(session);
  session.trustScore = score;
  session.trustLabel = mapScoreLabel(score);
  session.scoredAt = new Date();

  await session.save();
  if (score >= 50 && !session.trustPassportJwt) {
    await generateTrustPassportInternal(session);
}
};

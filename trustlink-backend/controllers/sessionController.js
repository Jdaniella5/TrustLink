import Session from "../models/sessionModel.js";
import { calculateTrustScore } from "../utils/trustCalc.js";

export const finalizeSessionTrust = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const session = await Session.findById(sessionId);

    session.trustScore = calculateTrustScore(session);
    await session.save();

    res.json({ trustScore: session.trustScore });
  } catch (err) {
    next(err);
  }
};

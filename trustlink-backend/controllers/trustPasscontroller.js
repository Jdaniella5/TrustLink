import jwt from "jsonwebtoken";
import Session from "../models/sessionModel.js";
import { generateTrustPassportInternal } from "../services/trustPassService.js";
/**
 * Generate Trust Passport
 * Must be called AFTER trust score is calculated
 */
export const generateTrustPassport = async (req, res, next) => {
  try {
    const { sessionId } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (typeof session.trustScore !== "number") {
      return res.status(400).json({ message: "Trust score not finalized" });
    }

    const passport = await generateTrustPassportInternal(session);

    res.json({
      trustPassport: passport,
      trustScore: session.trustScore,
      trustLabel: session.trustLabel
    });
  } catch (err) {
    next(err);
  }
};

export const verifyTrustPassport = async (req, res) => {
  try {
    const { passport } = req.body;
    const decoded = jwt.verify(
      passport,
      process.env.TRUST_PASSPORT_SECRET
    );

    const session = await Session.findById(decoded.sessionId);
    if (!session) {
      return res.status(400).json({ valid: false });
    }

    if (session.expiresAt && session.expiresAt < Date.now()) {
      return res.status(400).json({ valid: false, reason: "Session expired" });
    }

    res.json({
      valid: true,
      trustScore: decoded.trustScore,
      trustLabel: decoded.trustLabel,
      issuedAt: decoded.iat,
      expiresAt: decoded.exp,
      signals: decoded.signals
    });
  } catch (err) {
    res.status(400).json({ valid: false });
  }
};

import User from "../models/user.js";
import Device from "../models/deviceModel.js";
import Session from '../models/sessionModel.js';
import { calculateTrustScore, mapScoreLabel } from '../utils/trustCalc.js';
import { verifyLiveness } from '../ai/liveness.js';
import jwt from "jsonwebtoken";

export const verifyFace = async (req, res, next) => {
  try {
    const { sessionId, actionsDetected = [], embedding } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'sessionId required' });

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'session not found' });

    // Use enhanced AI workflow: computes liveness, compares embeddings, updates trust score
    const result = await verifyLiveness(session, actionsDetected, embedding);

    // --- Update Trust Score after liveness ---
    const user = await User.findById(session.userId);
    const device = user && user.primaryDeviceId ? await Device.findById(user.primaryDeviceId) : null;

    const signals = {
      livenessScore: result.livenessScore || 0,
      faceMatched: result.faceMatched || false,
      movementScore: session.movementScore || 0,
      deviceVerified: device ? device.isBound : false,
      emailVerified: !!user && user.isVerified,
      communityVouches: session.communityVouches || 0
    };
    const score = calculateTrustScore(signals);
    const label = mapScoreLabel(score);
    user.trustScore = score;
    await user.save();

    // --- Issue JWT cookie for trust passport ---
    const payload = { sub: session.userId.toString(), sessionId: session._id.toString(), score, label };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
    session.trustPassportJwt = token;
    await session.save();

    res.cookie('trustPassport', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000, // 24h
    });

    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

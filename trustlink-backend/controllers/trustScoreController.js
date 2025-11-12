import Session from '../models/sessionModel.js';
import User from '../models/user.js';
import Device from '../models/deviceModel.js';
import { calculateTrustScore, mapScoreLabel } from '../utils/trustCalc.js';
import jwt from 'jsonwebtoken';

export const getTrustScore = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'session not found' });
    const user = await User.findById(session.userId);
    const device = user && user.primaryDeviceId ? await Device.findById(user.primaryDeviceId) : null;

    const signals = {
      livenessScore: (session.face && session.face.livenessScore) || 0,
      faceMatched: (session.face && session.face.matched) || false,
      movementScore: session.movementScore || 0,
      deviceVerified: device ? device.isBound : false,
      emailVerified: !!user && user.isVerified,
      communityVouches: session.communityVouches || 0
    };

    const score = calculateTrustScore(signals);
    const label = mapScoreLabel(score);
    if (user) { user.trustScore = score; await user.save(); }
    // issue trust passport JWT (HS256 for demo)
    const payload = { sub: session.userId.toString(), sessionId: session._id.toString(), score, label };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
    session.trustPassportJwt = token;
    await session.save();
    res.json({ trustScore: score, label, breakdown: signals, passportJwt: token });
  } catch (err) { next(err); }
};

import Session from '../models/Session.js';
import User from '../models/user.js';
import { computeTrust } from '../ai/trustEngine.js';
import calculateTrustScore from '../utils/calculateTrustScore.js';
import jwt from 'jsonwebtoken';

export const getTrustForSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const user = await User.findById(session.userId);
    const signals = {
      livenessScore: (session.face && session.face.livenessScore) || 0,
      faceMatched: (session.face && session.face.matched) || false,
      movementScore: session.movementScore || 0,
      deviceVerified: user && user.primaryDeviceId ? true : false,
      emailVerified: user && user.emailVerified ? true : false,
      communityVouches: session.communityVouches || 0
    };

    const { score, breakdown } = computeTrust(signals);
    // update user trustScore
    if (user) {
      user.trustScore = score;
      await user.save();
    }

    // issue Trust Passport JWT
    const payload = {
      sub: session.userId.toString(),
      sessionId: session._id.toString(),
      score,
      breakdown,
      iat: Math.floor(Date.now() / 1000)
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '24h' });
    session.trustPassportJwt = token;
    await session.save();

    res.json({ trustScore: score, breakdown, passportJwt: token });
  } catch (err) {
    next(err);
  }
};

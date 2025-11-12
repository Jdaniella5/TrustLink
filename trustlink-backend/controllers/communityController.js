import CommunityVouch from '../models/communityModel.js';
import Session from '../models/sessionModel.js';
import User from '../models/user.js';

export const vouch = async (req, res, next) => {
  try {
    const { sessionId, refereeUserId } = req.body;
    if (!sessionId || !refereeUserId) return res.status(400).json({ message: 'sessionId & refereeUserId required' });
    const referee = await User.findById(refereeUserId);
    if (!referee || referee.trustScore < 50) return res.status(400).json({ message: 'Referee must be a verified/trusted user (trustScore >=50)' });

    await CommunityVouch.create({ sessionId, refereeUserId });

    const session = await Session.findById(sessionId);
    session.communityVouches = (session.communityVouches || 0) + 1;
    // Add +3 per vouch in trustCalc; we just increment count here
    await session.save();

    // Update trust score
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
user.trustScore = score;
await user.save();

// JWT cookie update
const payload = { sub: session.userId.toString(), sessionId: session._id.toString(), score, label };
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
session.trustPassportJwt = token;
await session.save();
res.cookie('trustPassport', token, { httpOnly:true, secure: process.env.NODE_ENV==='production', sameSite:'Strict', maxAge: 24*60*60*1000 });
    res.json({ success: true, communityVouches: session.communityVouches });
  } catch (err) { next(err); }
};

import Session from '../models/sessionModel.js';
import { analyzeMotionPattern } from '../utils/motionPattern.js';
import User from "../models/user.js";
import Device from "../models/deviceModel.js";
import { calculateTrustScore, mapScoreLabel } from '../utils/trustCalc.js';
import jwt from "jsonwebtoken";

export const ping = async (req, res, next) => {
  try {
    const { sessionId, lat, lon, accuracy, ts } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'sessionId required' });
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'session not found' });
    session.locationPings.push({ lat, lon, accuracy, ts: ts ? new Date(ts) : new Date() });
    const analysis = analyzeMotionPattern(session.locationPings);
    session.movementScore = analysis.movementScore;
    await session.save();
    res.json({ movementScore: session.movementScore, totalDistance: analysis.totalDistance, avgSpeed: analysis.avgSpeed });
  } catch (err) { next(err); }
};

export const complete = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'session not found' });
    const analysis = analyzeMotionPattern(session.locationPings);
    session.movementScore = analysis.movementScore;
    await session.save();
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

const payload = { sub: session.userId.toString(), sessionId: session._id.toString(), score, label };
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn:'24h' });
session.trustPassportJwt = token;
await session.save();
res.cookie('trustPassport', token, { httpOnly:true, secure: process.env.NODE_ENV==='production', sameSite:'Strict', maxAge: 24*60*60*1000 });

    res.json({ movementScore: session.movementScore, totalDistance: analysis.totalDistance });
  } catch (err) { next(err); }
};

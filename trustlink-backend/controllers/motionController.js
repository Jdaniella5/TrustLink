import Session from '../models/sessionModel.js';
import { analyzeMotionPattern } from '../utils/motionPattern.js';

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
    res.json({ movementScore: session.movementScore, totalDistance: analysis.totalDistance });
  } catch (err) { next(err); }
};

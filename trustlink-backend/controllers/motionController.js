import Session from '../models/Session.js';
import { analyzeMotionPattern } from '../utils/motionPatternCheck.js';

export const ping = async (req, res, next) => {
  try {
    const { sessionId, lat, lon, accuracy, ts } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'sessionId required' });
    const p = { lat, lon, accuracy, ts: ts ? new Date(ts) : new Date() };

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    session.locationPings.push(p);
    await session.save();

    // incremental analysis (optional)
    const analysis = analyzeMotionPattern(session.locationPings);
    session.movementScore = analysis.movementScore;
    await session.save();

    res.json({ success: true, movementScore: session.movementScore, totalDistance: analysis.totalDistance, avgSpeed: analysis.avgSpeed });
  } catch (err) {
    next(err);
  }
};

export const completeMotion = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    const analysis = analyzeMotionPattern(session.locationPings);
    session.movementScore = analysis.movementScore;
    await session.save();
    res.json({ success: true, movementScore: analysis.movementScore, totalDistance: analysis.totalDistance });
  } catch (err) {
    next(err);
  }
};

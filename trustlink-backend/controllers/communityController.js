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
    res.json({ success: true, communityVouches: session.communityVouches });
  } catch (err) { next(err); }
};

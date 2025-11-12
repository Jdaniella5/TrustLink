import CommunityVouch from '../models/CommunityVouch.js';
import Session from '../models/Session.js';

export const vouch = async (req, res, next) => {
  try {
    const { sessionId, refereeUserId } = req.body;
    if (!sessionId || !refereeUserId) return res.status(400).json({ message: 'sessionId and refereeUserId required' });
    await CommunityVouch.create({ sessionId, refereeUserId });
    // increment session.vouches
    const session = await Session.findById(sessionId);
    if (session) {
      session.communityVouches = (session.communityVouches || 0) + 1;
      await session.save();
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

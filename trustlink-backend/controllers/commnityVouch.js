import CommunityVouch from "../models/communityVouchModel.js";
import Session from "../models/sessionModel.js";

export const submitVouch = async (req, res, next) => {
  try {
    const { refereeUserId, referrerUserId, sessionId, relationship, knownFor } = req.body;

    await CommunityVouch.create({
      refereeUserId,
      referrerUserId,
      sessionId,
      relationship,
      knownFor
    });

    await Session.findByIdAndUpdate(sessionId, {
      $inc: { communityVouches: 1 }
    });

    res.json({ message: "Vouch submitted" });
  } catch (err) {
    next(err);
  }
};

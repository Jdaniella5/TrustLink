import CommunityVouch from "../models/communityModel.js";
import Session from "../models/sessionModel.js";
import { recalcSessionTrust } from "../utils/recalculateTrust.js";
import User from "../models/user.js";

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

    res.json({ message: "Vouch submitted" });
  } catch (err) {
    next(err);
  }
};



export const approveVouch = async (req, res, next) => {
  try {
  const { vouchId } = req.body;

  const vouch = await CommunityVouch.findById(vouchId);
  if (!vouch || vouch.status !== "pending") {
    return res.status(400).json({ message: "Invalid vouch" });
  }
  const referrer = await User.findById(vouch.referrerUserId);
  const refereeSession = await Session.findById(vouch.sessionId);

    if (!referrer || !refereeSession)
      return res.status(404).json({ message: "Invalid data" });

    //based on referrer trust
    let refereePoints = 1;
    if (referrer.trustScore >= 80) refereePoints = 3;
    else if (referrer.trustScore >= 60) refereePoints = 2;

  vouch.status = "approved";
  vouch.approvedAt = new Date();
  await vouch.save();

  // reward referee session
    refereeSession.communityVouches += refereePoints;
    await refereeSession.save();

    // reward referrer reputation
    await User.findByIdAndUpdate(vouch.referrerUserId, {
  $inc: { reputation: referrerTrust >= 70 ? 3 : 2 }
});
    await referrer.save();

    // recalc trust AFTER approval
    await recalcSessionTrust(refereeSession._id);

  res.json({ message: "Vouch approved", refereePoints, referrerReputation: referrer.reputation });
} catch (err) {
  next(err);
}
};
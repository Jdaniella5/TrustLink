import jwt from "jsonwebtoken";
import Session from "../models/sessionModel.js";

export const generateTrustPassportInternal = async (session) => {
  if (!session || typeof session.trustScore !== "number") return null;

  const payload = {
    sessionId: session._id,
    userId: session.userId,
    trustScore: session.trustScore,
    trustLabel: session.trustLabel,
    signals: {
      deviceBound: !!session.primaryDeviceId,
      emailVerified: !!session.emailVerifiedAt,
      faceVerified: session.face === "verified",
      communityVouches: session.communityVouches
    }
  };

  const passportJwt = jwt.sign(
    payload,
    process.env.TRUST_PASSPORT_SECRET,
    { expiresIn: "24h" }
  );

  session.trustPassportJwt = passportJwt;
  session.passportIssuedAt = new Date();
  await session.save();

  return passportJwt;
};

import Device from '../models/deviceModel.js';
import User from '../models/user.js';
import Verification from '../models/verificationModel.js';
import { hashFingerprint } from '../utils/deviceFingerprint.js';
import { createAndHashOtp } from '../utils/generateOtp.js';
import { sendVerificationEmail } from '../utils/sendVerificationEmail.js';

export const registerDevice = async (req, res, next) => {
  try {
    const { userId, fingerprint, meta } = req.body;
    if (!userId || !fingerprint) return res.status(400).json({ message: 'userId & fingerprint required' });
    const fHash = hashFingerprint(fingerprint);
    const device = await Device.create({ userId, fingerprintHash: fHash, meta, ipAddresses: [req.ip] });

    // create OTP to confirm device binding
    const { otp, otpHash } = await createAndHashOtp();
    const expiresAt = new Date(Date.now() + 5*60*1000);
    await Verification.create({ userId, otpHash, purpose:'device', expiresAt });
    // send OTP to user's email for device confirmation
    const user = await User.findById(userId);
    await sendVerificationEmail(user.email, otp);
    res.json({ deviceId: device._id, message: 'Device registered. Check email for OTP to confirm binding.' });
  } catch (err) { next(err); }
};

export const verifyDeviceOtp = async (req, res, next) => {
  try {
    const { deviceId, otp } = req.body;
    const device = await Device.findById(deviceId);
    if (!device) return res.status(404).json({ message: 'Device not found' });
    const rec = await Verification.findOne({ userId: device.userId, purpose: 'device' }).sort({ createdAt:-1 });
    if (!rec) return res.status(400).json({ message: 'No OTP' });
    if (new Date() > rec.expiresAt) return res.status(400).json({ message: 'OTP expired' });
    const bcrypt = (await import('bcryptjs')).default;
    const ok = await bcrypt.compare(otp, rec.otpHash);
    if (!ok) { rec.attempts++; await rec.save(); return res.status(400).json({ message: 'Invalid OTP' }); }
    device.isBound = true;
    await device.save();
    const user = await User.findById(device.userId);
const signals = {
  livenessScore: (session.face && session.face.livenessScore) || 0,
  faceMatched: (session.face && session.face.matched) || false,
  movementScore: session.movementScore || 0,
  deviceVerified: device.isBound,
  emailVerified: !!user && user.isVerified,
  communityVouches: session.communityVouches || 0
};
const score = calculateTrustScore(signals);
const label = mapScoreLabel(score);
user.trustScore = score;
await user.save();

// JWT cookie update
const payload = { sub: user._id.toString(), sessionId: session._id.toString(), score, label };
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn:'24h' });
session.trustPassportJwt = token;
await session.save();
res.cookie('trustPassport', token, { httpOnly:true, secure: process.env.NODE_ENV==='production', sameSite:'Strict', maxAge: 24*60*60*1000 });

    if (user && !user.primaryDeviceId) { user.primaryDeviceId = device._id; await user.save(); }
    await rec.deleteOne();
    res.json({ message: 'Device confirmed and bound' });
  } catch (err) { next(err); }
};

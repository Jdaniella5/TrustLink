import Device from '../models/Device.js';
import User from '../models/user.js';
import { randomToken } from '../utils/generateToken.js';
import VerificationToken from '../models/verificationToken.js';
import { sendVerificationEmail } from '../utils/sendEmail.js';

// register device fingerprint
export const registerDevice = async (req, res, next) => {
  try {
    const { userId, fingerprint, meta } = req.body;
    if (!userId || !fingerprint) return res.status(400).json({ message: 'userId and fingerprint required' });

    const hashed = fingerprint; // for demo; you should hash
    const device = await Device.create({ userId, fingerprint: hashed, meta, ipAddresses: [req.ip] });

    // optional: create verification token to bind device via email
    const token = randomToken(16);
    await VerificationToken.create({ userId, token, type: 'device', expiresAt: new Date(Date.now() + 3600000) });
    // send email with token to confirm device binding (optional)
    await sendVerificationEmail(user.email, token);

    res.json({ deviceId: device._id, message: 'Device registered (confirm via email if configured)' });
  } catch (err) {
    next(err);
  }
};

export const confirmDevice = async (req, res, next) => {
  try {
    const { token } = req.query;
    const v = await VerificationToken.findOne({ token, type: 'device' });
    if (!v) return res.status(400).json({ message: 'Invalid token' });
    const device = await Device.findOne({ userId: v.userId });
    if (device) {
      device.isBound = true;
      await device.save();
      const user = await User.findById(v.userId);
      if (user && !user.primaryDeviceId) {
        user.primaryDeviceId = device._id;
        await user.save();
      }
    }
    await v.deleteOne();
    res.json({ message: 'Device confirmed' });
  } catch (err) {
    next(err);
  }
};

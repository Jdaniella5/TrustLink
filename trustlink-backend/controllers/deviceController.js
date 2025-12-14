import Device from "../models/deviceModel.js";
import Session from "../models/sessionModel.js";
import User from "../models/user.js";
import {
  hashFingerprint,
  buildDeviceName,
  deviceTypeFromMeta
} from "../utils/deviceFingerprint.js";

export const bindDeviceAfterVerification = async (req, res, next) => {
  try {
    const { userId, sessionId, meta } = req.body;

    const fingerprintHash = hashFingerprint(meta);
    const deviceCount = await Device.countDocuments({ userId });

    if (deviceCount >= 2) {
      return res.status(403).json({ message: "Device limit reached" });
    }

    const device = await Device.create({
      userId,
      sessionId,
      fingerprintHash,
      deviceName: buildDeviceName(meta),
      deviceType: deviceTypeFromMeta(meta),
      meta,
      isBound: true
    });

    await Session.findByIdAndUpdate(sessionId, {
      primaryDeviceId: device._id,
      deviceVerifiedAt: new Date()
    });

    await User.findByIdAndUpdate(userId, {
      primaryDeviceId: device._id
    });

    res.json({ message: "Device verified and bound" });
  } catch (err) {
    next(err);
  }
};

export const getUserDevices = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const devices = await Device.find({ userId }).select('-fingerprintHash -meta');
    res.json({ devices });
  } catch (err) {
    next(err);
  }
}
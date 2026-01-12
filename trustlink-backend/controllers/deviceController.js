import Device from "../models/deviceModel.js";
import Session from "../models/sessionModel.js";
import User from "../models/user.js";
import {
  hashFingerprint,
  buildDeviceName,
  deviceTypeFromMeta
} from "../utils/deviceFingerprint.js";
import { recalcSessionTrust } from "../utils/recalculateTrust.js";

export const bindDeviceAfterVerification = async (req, res, next) => {
  try {
    const { sessionId, entropy } = req.body;

    
const session = await Session.findById(sessionId);
if (!session) return res.status(404).json({ message: "Invalid session" });

const derivedFingerprint = {
  entropy,
  userAgent: req.headers['user-agent'],
  ip: req.ip
};
    const fingerprintHash = hashFingerprint(meta);
    const deviceCount = await Device.countDocuments({ userId });

    if (deviceCount >= 2) {
      return res.status(403).json({ message: "Device limit reached" });
    }
    await Session.findByIdAndUpdate(sessionId, {
      primaryDeviceId: device._id,
      deviceVerifiedAt: new Date()
    });

    await recalcSessionTrust(sessionId);

    res.json({ message: "Device verified and bound" });
  } catch (err) {
    next(err);
  }
};

export const listDevices = async (req, res) => {
  const devices = await Device.find({ userId: req.user.userId });
  res.json(devices);
};

export const removeDevice = async (req, res) => {
  const { deviceId } = req.params;

  const device = await Device.findById(deviceId);
  if (!device) {
    return res.status(404).json({ message: "Device not found" });
  }

  if (device.userId.toString() !== req.user.userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await device.deleteOne();
  res.json({ message: "Device removed" });
};


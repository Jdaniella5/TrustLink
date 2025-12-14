import mongoose from 'mongoose';
const deviceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
  fingerprintHash: { type: String, required: true, index: true },
  deviceName: { type: String },
  deviceType: { type: String },
  meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  ipAddresses: { type: [String], default: [] },
  isBound: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastSeenAt: { type: Date, default: Date.now },
  lastSeenIp: { type: String },
});
export default mongoose.model('Device', deviceSchema);

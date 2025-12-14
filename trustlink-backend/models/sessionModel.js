import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', default: null },
  locationPings: [{ lat: Number, lon: Number, accuracy: Number, ts: Date }],
  movementScore: { type: Number, default: 0 },
  emailVerifiedAt: Date,
  deviceVerifiedAt: Date,
  communityVouches: { type: Number, default: 0 },
  trustPassportJwt: String,
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });
export default mongoose.model('Session', sessionSchema);

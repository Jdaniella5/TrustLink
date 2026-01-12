import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  primaryDeviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
  locationPings: [{ lat: Number, lon: Number, accuracy: Number, ts: Date }],
  movementScore: { type: Number, default: 0 },
  emailVerifiedAt: Date,
  deviceVerifiedAt: Date,
  face: { type: String, },
  communityVouches: { type: Number, default: 0 },
  trustScore: { type: Number, default: 0 },
  trustLabel: { type: String },
  scoredAt: Date,
  trustPassportJwt: String,
  addressVerifiedAt: Date,
  addressScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => Date.now() + 24*60*60*1000 }
}, { timestamps: true });
const Session = mongoose.model('Session', sessionSchema);

export default Session;
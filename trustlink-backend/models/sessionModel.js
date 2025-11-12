import mongoose from 'mongoose';
const pingSchema = new mongoose.Schema({
  lat: Number,
  lon: Number,
  accuracy: Number,
  ts: Date
}, { _id: false });

const faceSubSchema = new mongoose.Schema({
  livenessScore: Number,
  actionsDetected: [String],
  faceEmbeddingEncrypted: { type: Object }, // {iv,authTag,encrypted}
  matched: Boolean,
  timestamp: Date
}, { _id: false });

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', default: null },
  face: faceSubSchema,
  locationPings: [pingSchema],
  movementScore: { type: Number, default: 0 },
  emailVerifiedAt: Date,
  communityVouches: { type: Number, default: 0 },
  trustPassportJwt: String,
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Session', sessionSchema);

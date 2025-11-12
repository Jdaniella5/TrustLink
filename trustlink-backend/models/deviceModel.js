import mongoose from 'mongoose';
const deviceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fingerprintHash: { type: String, required: true },
  meta: { type: Object, default: {} },
  lastSeenAt: { type: Date, default: Date.now },
  isBound: { type: Boolean, default: false },
  ipAddresses: [String],
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Device', deviceSchema);

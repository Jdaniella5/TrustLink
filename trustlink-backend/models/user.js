import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  emailVerified: { type: Boolean, default: false },
  primaryDeviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', default: null },
  trustScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);

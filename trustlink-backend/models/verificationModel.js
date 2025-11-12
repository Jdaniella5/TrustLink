import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  otpHash: String,
  purpose: { type: String, enum: ['email','device','phone'], default: 'email' },
  expiresAt: Date,
  attempts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
verificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL so docs auto-delete if expiresAt set
export default mongoose.model('Verification', verificationSchema);

import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  token: String,
  type: String, // 'email' | 'device'
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('VerificationToken', tokenSchema);

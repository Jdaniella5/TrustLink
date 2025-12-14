import mongoose from 'mongoose';
const communitySchema = new mongoose.Schema({
  refereeUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  referrerUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  relationship: { type: String },
  knownFor: { type: String },
  notes: { type: String },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  approvedAt: { type: Date }
});
export default mongoose.model('CommunityVouch', communitySchema);

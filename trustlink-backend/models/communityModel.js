import mongoose from 'mongoose';
const communitySchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  refereeUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('CommunityVouch', communitySchema);

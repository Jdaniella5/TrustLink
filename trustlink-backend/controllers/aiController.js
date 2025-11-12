import Session from '../models/sessionModel.js';
import { verifyLiveness } from '../ai/liveness.js';

export const verifyFace = async (req, res, next) => {
  try {
    const { sessionId, actionsDetected = [], embedding } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'sessionId required' });

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'session not found' });

    // Use enhanced AI workflow: computes liveness, compares embeddings, updates trust score
    const result = await verifyLiveness(session, actionsDetected, embedding);

    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

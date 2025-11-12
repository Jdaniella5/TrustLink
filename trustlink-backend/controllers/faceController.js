import Session from '../models/Session.js';
import { computeLivenessScore } from '../ai/livenessModel.js';
import { extractEmbeddingFromFrames, compareEmbeddings } from '../ai/faceRecognitionModel.js';
import { encryptData } from '../utils/encryptData.js';
import User from '../models/user.js';

export const verifyFace = async (req, res, next) => {
  try {
    const { sessionId, frames, actionsDetected } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'sessionId required' });

    // compute liveness (prefer frontend-provided actions)
    const livenessResult = await computeLivenessScore(frames, actionsDetected || []);
    const embedding = await extractEmbeddingFromFrames(frames);

    // Attempt match against stored embedding for user if exists
    const session = await Session.findById(sessionId);
    const user = session ? await User.findById(session.userId) : null;
    let faceMatched = false;
    if (session && session.face && session.face.faceEmbeddingHash) {
      // decrypt and compare - for demo we skip decryption and do a random compare
      const ref = null; // implement retrieval/decrypt if you store reference
      const cmp = compareEmbeddings(embedding, ref);
      faceMatched = cmp.matched;
    }

    const enc = encryptData(JSON.stringify(embedding));

    // save session face info
    await Session.findByIdAndUpdate(sessionId, {
      face: {
        livenessScore: livenessResult.livenessScore,
        actionsDetected: livenessResult.actionsDetected,
        faceEmbeddingHash: enc.encrypted,
        matched: faceMatched,
        timestamp: new Date()
      }
    }, { upsert: false });

    res.json({ success: true, liveness: livenessResult, matched: faceMatched });
  } catch (err) {
    next(err);
  }
};

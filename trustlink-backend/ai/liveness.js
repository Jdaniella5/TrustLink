// ai/liveness.js

import { calculateTrustScore } from '../utils/trustCalc.js';

/**
 * Required actions for liveness check
 */
export const requiredActions = ['blink', 'smile', 'turnLeft', 'turnRight', 'nod'];

/**
 * Compute liveness score based on frontend-sent actions
 * Returns per-action confidence, overall score, and verified flag
 */
export const computeLivenessFromActions = (providedActions = []) => {
  const actionConfidence = {};
  requiredActions.forEach(action => {
    actionConfidence[action] = providedActions.includes(action)
      ? 0.9 + Math.random() * 0.1  // 90-100% confidence if action detected
      : 0.1 + Math.random() * 0.2; // 10-30% if missed
  });

  const matchedCount = requiredActions.filter(a => providedActions.includes(a)).length;
  const livenessScore = matchedCount / requiredActions.length;

  return {
    actionsDetected: providedActions,
    actionConfidence,
    livenessScore: Number(livenessScore.toFixed(2)),
    verified: livenessScore >= 0.8
  };
};

/**
 * Compare two face embeddings using cosine similarity
 */
export const cosineSimilarity = (a, b) => {
  if (!a || !b || a.length !== b.length) return 0;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-9);
};

export const compareEmbeddings = (a, b, threshold = 0.6) => {
  const sim = cosineSimilarity(a, b);
  return { matched: sim >= threshold, similarity: Number(sim.toFixed(2)) };
};

/**
 * High-level liveness verification workflow
 * Updates trust score automatically
 */
export const verifyLiveness = async (user, actionsDetected = [], embedding = null) => {
  // Step 1: Compute liveness from actions
  const liveness = computeLivenessFromActions(actionsDetected);

  // Step 2: Compare embeddings if provided
  let faceMatched = false;
  if (embedding && user.face && user.face.faceEmbeddingEncrypted) {
    const { decrypt } = await import('../config/encryption.js');
    const stored = JSON.parse(decrypt(user.face.faceEmbeddingEncrypted));
    const cmp = compareEmbeddings(embedding, stored);
    faceMatched = cmp.matched;
  }

  // Step 3: Encrypt and store embedding if provided
  if (embedding) {
    const { encrypt } = await import('../config/encryption.js');
    const enc = encrypt(JSON.stringify(embedding));
    user.face = {
      livenessScore: liveness.livenessScore,
      actionsDetected: liveness.actionsDetected,
      actionConfidence: liveness.actionConfidence,
      faceEmbeddingEncrypted: enc,
      matched: faceMatched,
      timestamp: new Date()
    };
  } else {
    user.face = {
      livenessScore: liveness.livenessScore,
      actionsDetected: liveness.actionsDetected,
      actionConfidence: liveness.actionConfidence,
      matched: faceMatched,
      timestamp: new Date()
    };
  }

  await user.save();

  // Step 4: Update trust score automatically
  const trustScore = calculateTrustScore({
    livenessVerified: liveness.verified,
    addressVerified: user.addressVerified || false,
    deviceVerified: user.deviceVerified || false,
    emailVerified: user.emailVerified || false,
    communityVouches: user.communityVouches || 0
  });

  user.trustScore = trustScore;
  await user.save();

  return { liveness, faceMatched, trustScore };
};

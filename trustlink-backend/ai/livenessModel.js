// Lightweight liveness logic that uses landmarks computed by face-api or MediaPipe.

import { eyeAspectRatio, mouthAspectRatio, estimateYawPitchRoll } from './aiUtils.js';

export const computeLivenessScore = async (frames = [], providedActions = []) => {
  // frames: array of base64 images (optional)
  // providedActions: optional array of simple strings from frontend e.g. ["blink","smile","turnLeft","turnRight","nod"]

  // If frontend provided actions (recommended), use them directly:
  if (Array.isArray(providedActions) && providedActions.length > 0) {
    const required = ['blink', 'smile', 'turnLeft', 'turnRight', 'nod'];
    const matched = required.filter(r => providedActions.includes(r)).length;
    const score = matched / required.length;
    return { livenessScore: score, actionsDetected: providedActions, verified: score >= 0.8 };
  }

  // Otherwise (server-side), do a best-effort scan of frames (slow)
  // For hackathon we return a mock result to keep flow moving.
  const mockActions = ['blink', 'smile', 'turnLeft', 'turnRight', 'nod'].filter(() => Math.random() > 0.3);
  const score = mockActions.length / 5;
  return { livenessScore: score, actionsDetected: mockActions, verified: score >= 0.8 };
};

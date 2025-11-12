// Lightweight face embedding/matching stub. In prod you would use face-api or a precomputed reference.

export const extractEmbeddingFromFrames = async (frames = []) => {
  // frames: base64 images. Return a fake 128-d array (or hex)
  const vec = Array.from({ length: 128 }, () => Math.random());
  return vec;
};

export const compareEmbeddings = (a, b) => {
  // cosine similarity stub
  if (!a || !b) return { matched: false, similarity: 0 };
  // cheap dot product / magnitude
  const dot = a.reduce((s, v, i) => s + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  const sim = dot / (magA * magB + 1e-9);
  return { matched: sim > 0.6, similarity: sim };
};

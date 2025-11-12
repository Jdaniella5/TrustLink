export const WEIGHTS = {
  liveness: 30,
  faceMatch: 15,
  movement: 25,
  device: 10,
  email: 10,
  community: 5 // community points added separately
};

export const SCORE_RANGES = [
  { min: 0, max: 30, label: 'Critical' },
  { min: 31, max: 50, label: 'Bad' },
  { min: 51, max: 70, label: 'Good' },
  { min: 71, max: 100, label: 'Excellent' }
];

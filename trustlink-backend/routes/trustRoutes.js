import express from 'express';
import { getTrustScore } from '../controllers/trustScoreController.js';
const r = express.Router();
r.get('/score/:sessionId', getTrustScore);
export default r;

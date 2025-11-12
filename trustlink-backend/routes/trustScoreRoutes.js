import express from 'express';
import { getTrustForSession } from '../controllers/trustScoreController.js';
const router = express.Router();

router.get('/score/:sessionId', getTrustForSession);

export default router;

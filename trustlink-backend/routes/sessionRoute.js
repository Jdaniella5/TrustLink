import express from 'express';
import { calculateSessionTrust, markAddressVerified } from '../controllers/sessionController.js';
import auth from '../middleware/authMiddleware.js';
const router = express.Router();

router.post("/session/:sessionId/calculate", auth, calculateSessionTrust);

export default router;

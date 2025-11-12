import express from 'express';
import { verifyFace } from '../controllers/aiController.js';

const router = express.Router();

// Liveness/face verification endpoint
router.post('/verify', verifyFace);

export default router;


import express from 'express';
import { ping, completeMotion } from '../controllers/motionController.js';
const router = express.Router();

router.post('/ping', ping);
router.post('/complete', completeMotion);

export default router;

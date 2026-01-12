import express from 'express';
import { submitVouch, approveVouch } from '../controllers/commnityVouch.js';
const router = express.Router();

router.post("/vouch", submitVouch);
router.post("/approve", approveVouch);

export default router;

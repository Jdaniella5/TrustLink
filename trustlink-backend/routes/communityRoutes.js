import express from 'express';
import { vouch } from '../controllers/communityController.js';
const router = express.Router();

router.post('/vouch', vouch);

export default router;

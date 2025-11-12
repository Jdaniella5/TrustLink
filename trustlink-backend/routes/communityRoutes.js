import express from 'express';
import { vouch } from '../controllers/communityController.js';
const r = express.Router();
r.post('/vouch', vouch);
export default r;

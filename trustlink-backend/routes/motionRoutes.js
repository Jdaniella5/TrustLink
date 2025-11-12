import express from 'express';
import { ping, complete } from '../controllers/motionController.js';
const r = express.Router();
r.post('/ping', ping);
r.post('/complete', complete);
export default r;

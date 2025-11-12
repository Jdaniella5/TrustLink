import express from 'express';
import { registerDevice, confirmDevice } from '../controllers/deviceController.js';
const router = express.Router();

router.post('/register', registerDevice);
router.get('/confirm', confirmDevice);

export default router;

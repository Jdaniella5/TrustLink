import express from 'express';
import { registerDevice, verifyDeviceOtp } from '../controllers/deviceController.js';
const r = express.Router();
r.post('/register', registerDevice);
r.post('/verify-otp', verifyDeviceOtp);
export default r;

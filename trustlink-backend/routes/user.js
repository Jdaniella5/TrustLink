import express from 'express';
import { register, login, verifyOtp } from '../controllers/userController.js';
const r = express.Router();
r.post('/register', register);
r.post('/login', login);
r.post('/verify-otp', verifyOtp);
export default r;

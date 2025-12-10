import express from 'express';
import { register, login, sendVerificationOtp, verifyOtp, resendOtp } from '../controllers/userController.js';
import rateLimiter from "../middleware/rateLimiter.js"
const r = express.Router();
r.post('/register', register);
r.post('/login', login);
r.post("/send-otp", rateLimiter, sendVerificationOtp)
r.post('/verify-otp', verifyOtp);
r.post("/resend-otp", rateLimiter, resendOtp);
export default r;

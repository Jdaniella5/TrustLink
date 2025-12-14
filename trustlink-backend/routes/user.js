import express from 'express';
import { register, login, sendVerificationOtp, verifyOtp, resendOtp, logout } from '../controllers/userController.js';
import rateLimiter from "../middleware/rateLimiter.js";
import auth from '../middleware/authMiddleware.js';
import User from '../models/user.js';

const r = express.Router();

r.post('/register', register);
r.post('/login', login);
r.post("/send-otp", rateLimiter, sendVerificationOtp);
r.post('/verify-otp', verifyOtp);
r.post("/resend-otp", rateLimiter, resendOtp);
r.get('/check', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        trustScore: user.trustScore,
        DOB: user.DOB,
        Address: user.Address,
        phoneNumber: user.phoneNumber,
        verificationStatus: user.isVerified ? 'completed' : 'pending'
      }
    });
  } catch (err) {
    next(err);
  }
});
r.post("/logout", auth, logout);

export default r;
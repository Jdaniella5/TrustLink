import User from '../models/user.js';
import Session from '../models/sessionModel.js';
import bcrypt from 'bcryptjs';
import Verification from '../models/verificationModel.js';
import { createAndHashOtp } from '../utils/generateOtp.js';
import { sendVerificationEmail } from '../utils/sendVerificationEmail.js';
import { randomBytes } from 'crypto';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email & password required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'email exists' });
    const user = await User.create({ name, email, password });
    const session = await Session.create({ userId: user._id });

    // create OTP
    const { otp, otpHash } = await createAndHashOtp();
    const expiresAt = new Date(Date.now() + 5*60*1000); // 5 min
    await Verification.create({ userId: user._id, otpHash, purpose:'email', expiresAt });

    await sendVerificationEmail(email, otp);
    res.json({ userId: user._id, sessionId: session._id, message: 'Registered. Check email for OTP (5 min).' });
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email });
    if (!u) return res.status(400).json({ message: 'Invalid' });
    const ok = await bcrypt.compare(password, u.password || '');
    if (!ok) return res.status(400).json({ message: 'Invalid' });
    // create JWT
    const jwt = (await import('jsonwebtoken')).default;
    const token = jwt.sign({ userId: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, userId: u._id });
  } catch (err) { next(err); }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;
    const rec = await Verification.findOne({ userId, purpose:'email' }).sort({ createdAt:-1 });
    if (!rec) return res.status(400).json({ message: 'No OTP found' });
    if (new Date() > rec.expiresAt) return res.status(400).json({ message: 'OTP expired' });
    const bcrypt = (await import('bcryptjs')).default;
    const ok = await bcrypt.compare(otp, rec.otpHash);
    rec.attempts = (rec.attempts || 0) + 1;
    await rec.save();
    if (!ok) return res.status(400).json({ message: 'Invalid OTP' });
    // mark user verified
    const user = await User.findById(userId);
    user.isVerified = true;
    await user.save();
    await rec.deleteOne();
    // update session
    const session = await Session.findOne({ userId }).sort({ createdAt: -1 });
    if (session) { session.emailVerifiedAt = new Date(); await session.save(); }
    res.json({ message: 'Email verified' });
  } catch (err) { next(err); }
};

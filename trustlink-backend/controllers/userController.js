import User from '../models/user.js';
import Session from '../models/sessionModel.js';
import bcrypt from 'bcryptjs';
import Verification from '../models/verificationModel.js';
import { createAndHashOtp } from '../utils/generateOtp.js';
import { sendVerificationEmail } from '../utils/sendVerificationEmail.js';
import { randomBytes } from 'crypto';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, DOB, Address, phoneNumber } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email & password required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'email exists' });
    const user = await User.create({ name, email, password, DOB, Address, phoneNumber });
    const session = await Session.create({ userId: user._id });

    res.json({ userId: user._id, sessionId: session._id, message: 'Registered.' });
  } catch (err) { next(err); } 
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email });
    if (!u) return res.status(400).json({ message: 'Invalid' });

    //check for lockout
    if (u.lockUntil && u.lockUntil > Date.now()) {
      return res.status(403).json({
        message: "Account locked. Try again later."
      });
    }
    const ok = await bcrypt.compare(password, u.password || '');
    if (!ok) {
      u.loginAttempts = (u.loginAttempts || 0) +1; 
      //lockout after 5 attempts for 10 minuites
      if (u.loginAttempts >= 5) {
        u.lockUntil = new Date(Date.now() + 10 * 60 * 1000);
      }
      await u.save();

      return res.status(400).json({ message: 'Invalid' });
    }
    //reset attempts when login is successful
    u.loginAttempts = 0;
    u.lockUntil = null;
    await u.save();
   const session = await Session.findOne({ userId: u._id }).sort({ createdAt: -1 });
    // create JWT
    const jwt = (await import('jsonwebtoken')).default;
    const token = jwt.sign({ userId: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

// Send minimal info in JSON
return res.json({ userId: u._id, sessionId: session?._id, message: 'Logged in' });
  } catch (err) { next(err); }
};

export const sendVerificationOtp = async (req, res, next) => {
  try {
    const { userId, email } = req.body;
    const { otp, otpHash } = await createAndHashOtp();
    const expiresAt = new Date(Date.now() + 0.5 * 60 * 1000); // 30 seconds

    //sendOtp
    await Verification.create({
      userId,
      otpHash,
      purpose: "email",
      expiresAt
    });
    await sendVerificationEmail(email, otp);
    res.json({ message: "OTP sent. Check your email."});
  } catch (err) {
    next(err);
  }
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
    if (!ok) {
      if (rec.attempts >= 5) await rec.deleteOne(); //lockout
      return res.status(400).json({ message: 'Invalid OTP' });
    } 
    // mark user verified
    const user = await User.findById(userId);
    user.isVerified = true;
    await user.save();
    await rec.deleteOne();
    // update session
    const session = await Session.findOne({ userId }).sort({ createdAt: -1 });
    if (session) { session.emailVerifiedAt = new Date(); await session.save(); }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
    res.json({ message: 'Email verified' });
  } catch (err) { next(err); }
};

export const resendOtp = async (req, res, next) => {
  try {
    const { userId, email } = req.body;

    //validate 
    if (!userId || !email) 
      return res.status(400).json({ message: "userId and email required" });
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    //if user is verified no resend
    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

     // cooldown
    const lastOtp = await Verification.findOne({ userId, purpose: "email" }).sort({ createdAt: -1 });
    if (lastOtp && Date.now() - lastOtp.createdAt.getTime() < 60 * 1000) {
      return res.status(429).json({
        message: "Please wait 1 minute before requesting another OTP."
      });
    }
    //delete previous otp
    await Verification.deleteMany({ userId, purpose: "email" });
    //generate new otp
    const { otp, otpHash } = await createAndHashOtp();
    const expiresAt = new Date(Date.now() + 0.5 * 60 * 1000); //30 seconds
    await Verification.create({
      userId, otpHash, purpose: "email", expiresAt,
    });

    await sendVerificationEmail(email, otp);
    res.json({ message: "A new Otp has been sent to your mail." });
  } catch (err) {
    next(err);
  }
};
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import VerificationToken from '../models/verificationToken.js';
import { sendVerificationEmail } from '../utils/sendEmail.js';
import { randomToken } from '../utils/generateToken.js';
import Session from '../models/Session.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash: hash });

    // create session
    const session = await Session.create({ userId: user._id });

    // token
    const token = randomToken(20);
    const v = await VerificationToken.create({ userId: user._id, token, type: 'email', expiresAt: new Date(Date.now() + 1000 * 60 * 60) });
    await sendVerificationEmail(email, token);

    res.json({ userId: user._id, sessionId: session._id, message: 'Registered. Check email for verification link.' });
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: 'No token' });
    const v = await VerificationToken.findOne({ token, type: 'email' });
    if (!v) return res.status(400).json({ message: 'Invalid or expired token' });
    const user = await User.findById(v.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.emailVerified = true;
    await user.save();

    // update session
    const session = await Session.findOne({ userId: user._id }).sort({ createdAt: -1 });
    if (session) { session.emailVerifiedAt = new Date(); await session.save(); }

    await v.deleteOne();

    res.json({ message: 'Email verified' });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash || '');
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, userId: user._id });
  } catch (err) {
    next(err);
  }
};

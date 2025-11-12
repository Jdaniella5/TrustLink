import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import deviceRoutes from './routes/deviceRoutes.js';
import faceRoutes from './routes/faceRoutes.js';
import motionRoutes from './routes/motionRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import trustRoutes from './routes/trustScoreRoutes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();
await connectDB();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/face', faceRoutes);
app.use('/api/motion', motionRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/trust', trustRoutes);

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ TrustLink backend listening on ${PORT}`));

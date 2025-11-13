import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import userRoutes from './routes/user.js';
import deviceRoutes from './routes/deviceRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import motionRoutes from './routes/motionRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import trustRoutes from './routes/trustRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();
await connectDB();

const app = express();

app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(express.json({ limit: '20mb' }));
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/face', aiRoutes);
app.use('/api/motion', motionRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/trust', trustRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 1550;
app.listen(PORT, () => console.log(`TrustLink backend listening on ${PORT}`));
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import userRoutes from './routes/user.js';
import communityRoutes from "./routes/communityRoutes.js";
import deviceRoute from "./routes/deviceRoute.js";
import sessionRoute from "./routes/sessionRoute.js";
import trustPassRoutes from "./routes/trustPassRoutes.js";
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
app.use('/api/community', communityRoutes);
app.use('/api/device', deviceRoute);
app.use('/api/session', sessionRoute);
app.use('/api/trustpass', trustPassRoutes);

app.get('/health', (_, res) => {
      res.status(200).json({
        status: 'ok',
        service: 'TrustLink API',
        timestamp: new Date().toISOString()
      });
    });
    
app.use(errorHandler);

const PORT = process.env.PORT || 1550;
app.listen(PORT, () => console.log(`TrustLink backend listening on ${PORT}`));
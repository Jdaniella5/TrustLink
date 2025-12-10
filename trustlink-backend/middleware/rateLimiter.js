import rateLimit from 'express-rate-limit';

const rateLimiter = rateLimit({
  windowMs: 60 * 1000,            // 1 minute
  max: 3,                         // max 3 OTP requests per minute
  message: { message: 'Too many requests, try again shortly.' },
  standardHeaders: true,
  legacyHeaders: false
});

export default rateLimiter;

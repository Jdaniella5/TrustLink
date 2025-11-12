import { genOTP } from '../config/otpGenerator.js';
import bcrypt from 'bcryptjs';
export const createAndHashOtp = async () => {
  const otp = genOTP();
  const otpHash = await bcrypt.hash(otp, 10);
  return { otp, otpHash };
};

import crypto from 'crypto';
export const randomToken = (len = 32) => crypto.randomBytes(len).toString('hex');

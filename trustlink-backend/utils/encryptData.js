import crypto from 'crypto';

const ALGO = 'aes-256-gcm';
const KEY = crypto.createHash('sha256').update(process.env.JWT_SECRET || 'devsecret').digest();

export const encryptData = (plainBuffer) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(Buffer.from(plainBuffer)), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    encrypted: encrypted.toString('hex')
  };
};

export const decryptData = ({ iv, authTag, encryptedHex }) => {
  const decipher = crypto.createDecipheriv(ALGO, KEY, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedHex, 'hex')), decipher.final()]);
  return decrypted;
};

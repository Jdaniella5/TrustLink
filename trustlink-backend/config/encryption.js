import crypto from 'crypto';
const ALGO = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');
if (!KEY || KEY.length !== 32) {
  console.warn('ENCRYPTION_KEY is missing or invalid (must be 32 bytes hex).');
}

export const encrypt = (plain) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(Buffer.from(plain)), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString('hex'),
    authTag: tag.toString('hex'),
    encrypted: encrypted.toString('hex')
  };
};

export const decrypt = ({ iv, authTag, encrypted }) => {
  const decipher = crypto.createDecipheriv(ALGO, KEY, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  const dec = Buffer.concat([decipher.update(Buffer.from(encrypted, 'hex')), decipher.final()]);
  return dec.toString();
};

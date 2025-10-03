import { randomBytes } from 'crypto';

export const generateNonce = () => randomBytes(16).toString('hex');

export const buildAuthMessage = nonce => `EdgeCity login verification: ${nonce}`;

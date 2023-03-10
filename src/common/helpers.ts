import * as crypto from 'crypto';

export const generateTrx = () => {
  return crypto.randomBytes(8).toString('hex');
};

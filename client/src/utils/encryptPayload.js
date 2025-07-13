// src/utils/encryptPayload.js
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'MySuperSecureKey123!';

export const encryptPayload = (payload) => {
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(payload), SECRET_KEY).toString();
  return { data: ciphertext }; // send as { data: '...' }
};


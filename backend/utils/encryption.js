// utils/encryption.js
const CryptoJS = require('crypto-js');
const SECRET_KEY = process.env.SECRET_KEY || 'MySuperSecureKey123!';

// Encrypt backend response
function encryptResponse(data) {
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  return { data: encrypted };
}

// Decrypt frontend's encrypted payload
function decryptPayloadMiddleware(req, res, next) {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ error: 'Missing encrypted payload' });
    }

    const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
    const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    req.body = decrypted;
    next();
  } catch (err) {
    console.error('❌ Payload decryption failed:', err);
    return res.status(400).json({ error: 'Invalid encrypted payload' });
  }
}


module.exports = {
  encryptResponse,
  decryptPayloadMiddleware,
};

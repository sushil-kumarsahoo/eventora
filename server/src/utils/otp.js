const crypto = require('crypto')

/**
 * Generates a secure 6-digit OTP and its expiration time
 * @returns {Object} { code, expires }
 */

exports.generateOTP = () => {
  const code = crypto.randomInt(100000, 999999).toString();
  
  return code;
};

// src/utils/passwordGenerator.js
import crypto from "crypto";

/**
 * Generate a secure random password
 * @param {number} length - Length of the password (default: 16)
 * @returns {string} Secure password
 */
export function generatePassword(length = 16) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()+_";

  let password = "";
  const bytes = crypto.randomBytes(length);

  for (let i = 0; i < bytes.length; i++) {
    password += chars[bytes[i] % chars.length];
  }

  return password;
}

/**
 * Generate OTP Codes (numeric only)
 * @param {number} digits - number of digits (default: 6)
 */
export function generateOTP(digits = 6) {
  const max = Math.pow(10, digits);
  const code = crypto.randomInt(0, max).toString().padStart(digits, "0");
  return code;
}

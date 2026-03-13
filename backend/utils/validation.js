/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Indian phone number (10 digits, optional +91)
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  // Remove spaces, dashes, and country code
  const cleaned = phone.replace(/[\s\-+]/g, "").replace(/^91/, "");
  // Should be exactly 10 digits
  return /^\d{10}$/.test(cleaned);
}

/**
 * Normalize phone number (remove spaces, dashes, country code)
 * @param {string} phone
 * @returns {string}
 */
export function normalizePhone(phone) {
  return phone.replace(/[\s\-+]/g, "").replace(/^91/, "");
}

/**
 * Validate password (min 6 characters)
 * @param {string} password
 * @returns {boolean}
 */
export function isValidPassword(password) {
  return password && password.length >= 6;
}

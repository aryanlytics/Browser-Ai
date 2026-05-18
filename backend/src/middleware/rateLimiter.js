const rateLimit = require("express-rate-limit");

// Login Rate Limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Allow maximum 10 attempts per 15 minutes
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  keyGenerator: rateLimit.ipKeyGenerator,
});

module.exports = { loginLimiter };

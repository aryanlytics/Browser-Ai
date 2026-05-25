const express = require("express");
const { register, login, verifyOTP, resendOTP, refresh, logout } = require("../controllers/authController");
const { loginLimiter } = require("../middleware/rateLimiter");
const validate = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../models/validators/authValidation");

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/refresh", refresh);

router.post("/login", validate(loginSchema), loginLimiter, login); // ← Rate limiter applied here
router.post("/logout", logout); // ← Rate limiter applied here


module.exports = router;

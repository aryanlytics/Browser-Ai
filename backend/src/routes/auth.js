const express = require("express");
const { register, login, verifyOTP, resendOTP } = require("../controllers/authController");
const { loginLimiter } = require("../middleware/rateLimiter");
const validate = require("../middleware/validate");
const { registerSchema } = require("../models/validators/authValidation");

const router = express.Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", loginLimiter, login); // ← Rate limiter applied here

router.post("/verify-otp", verifyOTP);

router.post("/resend-otp", resendOTP);

module.exports = router;

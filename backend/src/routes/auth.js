const express = require("express");
const { register, login } = require("../controllers/authController");
const { loginLimiter } = require("../middleware/rateLimiter");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { registerSchema } = require("../validators/authValidation");

const router = express.Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", loginLimiter, login); // ← Rate limiter applied here

module.exports = router;

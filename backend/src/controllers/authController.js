const registerModel = require("../models/UserRegister");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { redisClient } = require("../config/redis");
const resend = require("resend");
const crypto = require("crypto");

// ─────────────────────────────────────────────
// Register Controller
// ─────────────────────────────────────────────

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // ─────────────────────────────────────────
    // Check if user already exists
    // ─────────────────────────────────────────

    const isAlreadyRegister = await registerModel.findOne({
      email,
    });

    if (isAlreadyRegister) {
      return res.status(409).json({
        success: false,
        message: "User account already exists",
      });
    }

    // ─────────────────────────────────────────
    // Check resend cooldown
    // Prevent OTP spam
    // ─────────────────────────────────────────

    const cooldown = await redisClient.get(`otp_cooldown:${email}`);

    if (cooldown) {
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting another OTP",
      });
    }

    // ─────────────────────────────────────────
    // Hash password
    // ─────────────────────────────────────────

    const hashedPassword = await bcrypt.hash(password, 12);

    // ─────────────────────────────────────────
    // Generate secure OTP
    // ─────────────────────────────────────────

    const otp = crypto.randomInt(100000, 999999).toString();

    // ─────────────────────────────────────────
    // Store temporary registration data
    // in Redis for 2 minutes
    // ─────────────────────────────────────────

    await redisClient.set(
      `register:${email}`,

      JSON.stringify({
        name,
        email,
        password: hashedPassword,
        otp,
      }),

      {
        EX: 120,
      },
    );

    // ─────────────────────────────────────────
    // Set resend cooldown
    // Example: user can request OTP
    // again after 60 seconds
    // ─────────────────────────────────────────

    await redisClient.set(`otp_cooldown:${email}`, "true", {
      EX: 60,
    });

    // ─────────────────────────────────────────
    // Send OTP Email
    // ─────────────────────────────────────────

    await resend.emails.send({
      from: "onboarding@resend.dev",

      to: email,

      subject: "Verify your email",

      html: `
        <div style="font-family:sans-serif;">
          <h2>Email Verification</h2>

          <p>
            Your OTP code is:
          </p>

          <h1>
            ${otp}
          </h1>

          <p>
            This OTP will expire in 2 minutes.
          </p>
        </div>
      `,
    });

    // ─────────────────────────────────────────
    // Success Response
    // ─────────────────────────────────────────

    res.status(200).json({
      success: true,

      message: "OTP sent successfully to your email",

      email,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Server error during registration",
    });
  }
}

module.exports = {
  register,
};

async function regiter(req, res) {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const isAlreadyRegister = await registerModel.findOne({ email });

    if (isAlreadyRegister) {
      return res.status(409).json({
        success: false,
        message: "User account already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await registerModel.create({
      name,
      email,
      password: hashedPassword,
      lastLogin: null, // explicitly set
    });

    // Generate JWT
    const accessToken = jwt.sign({ id: newUser._id }, config.JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ id: newUser._id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Get user with password (important)
    const user = await registerModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email",
      });
    }

    // Compare password (Directly using bcrypt)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Update last login (optional)
    user.lastLogin = Date.now();
    await user.save();

    const accessToken = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        lastLogin: user.lastLogin,
      },
      accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
}

module.exports = { register, login };

const registerModel = require("../models/UserRegister");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { redisClient } = require("../config/redis");
const { Resend } = require("resend");
const resendInstance = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
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

    if (resendInstance) {
      try {
        await resendInstance.emails.send({
          from: "onboarding@resend.dev",
          to: email,
          subject: "Verify Your Email - BrowserAI",
          html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f4f4f4; font-family: 'Segoe UI', Arial, sans-serif;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f4; padding: 40px 0;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" max-width="600px" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #6b46c1, #805ad5); padding: 40px 30px; text-align:center;">
                      <h1 style="color:white; margin:0; font-size:28px;">BrowserAI</h1>
                      <p style="color:#e0d4ff; margin:8px 0 0 0; font-size:16px;">Voice-Powered Browser Agent</p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 50px 40px 40px; text-align:center;">
                      <h2 style="color:#1f2937; margin:0 0 16px 0; font-size:24px;">Verify Your Email Address</h2>
                      
                      <p style="color:#4b5563; font-size:16px; line-height:1.6; margin-bottom:30px;">
                        Thank you for signing up! Please use the OTP below to verify your email address.
                      </p>

                      <!-- OTP Box -->
                      <div style="background-color:#f8fafc; border:2px dashed #7c3aed; border-radius:12px; padding:20px; margin:30px 0;">
                        <p style="color:#6b7280; font-size:14px; margin:0 0 8px 0;">Your Verification Code</p>
                        <h1 style="font-size:42px; letter-spacing:8px; color:#4f46e5; margin:0; font-weight:700;">
                          ${otp}
                        </h1>
                      </div>

                      <p style="color:#ef4444; font-size:15px; margin:20px 0;">
                        This code will expire in <strong>2 minutes</strong>.
                      </p>

                      <p style="color:#6b7280; font-size:14px;">
                        If you didn't request this code, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color:#f8fafc; padding:30px; text-align:center; border-top:1px solid #e5e7eb;">
                      <p style="color:#9ca3af; font-size:13px; margin:0;">
                        © 2026 BrowserAI. All rights reserved.
                      </p>
                      <p style="color:#9ca3af; font-size:13px; margin:8px 0 0 0;">
                        Need help? Contact us at support@browserai.com
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
        });
      } catch (emailError) {
        console.error("Resend Email Sending Error:", emailError);
        if (process.env.NODE_ENV === "development") {
          console.log(`[DEV ONLY BACKUP] Resend failed. OTP for ${email} is: ${otp}`);
        } else {
          throw emailError;
        }
      }
    } else {
      console.log("-----------------------------------------");
      console.log(`[MOCK EMAIL] OTP generated for ${email}: ${otp}`);
      console.log("-----------------------------------------");
    }

    // ─────────────────────────────────────────
    // Success Response
    // ─────────────────────────────────────────

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Server error during registration",
    });
  }
}









// ─────────────────────────────────────────────
// Verify OTP Controller
// ─────────────────────────────────────────────
async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP code are required",
      });
    }

    // Get the stored registration details from Redis
    const storedData = await redisClient.get(`register:${email}`);
    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: "Verification session expired or email not found",
      });
    }

    const userData = JSON.parse(storedData);

    // Validate the OTP
    if (userData.otp !== otp) {
      const attemptsKey = `otp_attempts:${email}`;
      const attempts = await redisClient.incr(attemptsKey);
      if (attempts === 1) await redisClient.expire(attemptsKey, 120);

      if (attempts >= 5) {
        await redisClient.del(`register:${email}`);
        await redisClient.del(`otp_cooldown:${email}`);
        await redisClient.del(attemptsKey);
        return res.status(429).json({
          success: false,
          message: "Too many invalid attempts. Please sign up again.",
        });
      }

      return res.status(400).json({
        success: false,
        message: `Invalid verification code. Attempts left: ${5 - attempts}`,
      });
    }

    await redisClient.del(`otp_attempts:${email}`);

 

    

    // Create the new user in MongoDB
    const newUser = await registerModel.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      lastLogin: Date.now(),
    });

    // Clean up temporary data in Redis
    await redisClient.del(`register:${email}`);
    await redisClient.del(`otp_cooldown:${email}`);

    // Generate JWT token
    const accessToken = jwt.sign({ id: newUser._id }, config.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ id: newUser._id }, config.JWT_REFRESH_SECRET, {
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
      message: "Email verified successfully",
      accessToken,
      user: {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
  }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error during OTP verification",
    });
  }
}



// ─────────────────────────────────────────────
// Resend OTP Controller
// ─────────────────────────────────────────────
async function resendOTP(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if registration data exists in Redis
    const storedData = await redisClient.get(`register:${email}`);
    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: "Registration session has expired. Please sign up again.",
      });
    }

    // Check resend cooldown to prevent OTP spam
    const cooldown = await redisClient.get(`otp_cooldown:${email}`);
    if (cooldown) {
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting another OTP",
      });
    }

    const userData = JSON.parse(storedData);

    // Generate a new secure OTP
    const newOtp = crypto.randomInt(100000, 999999).toString();

    // Update registration data in Redis with the new OTP (and refresh expiration to 2 minutes)
    userData.otp = newOtp;
    await redisClient.set(
      `register:${email}`,
      JSON.stringify(userData),
      {
        EX: 120,
      }
    );

    // Set resend cooldown for another 60 seconds
    await redisClient.set(`otp_cooldown:${email}`, "true", {
      EX: 60,
    });

    // ─────────────────────────────────────────
    // Resend the OTP email
    // ─────────────────────────────────────────

    if (resendInstance) {
      try {
        await resendInstance.emails.send({
          from: "onboarding@resend.dev",
          to: email,
          subject: "Verify Your Email - BrowserAI",
          html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f4f4f4; font-family: 'Segoe UI', Arial, sans-serif;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f4; padding: 40px 0;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" max-width="600px" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.1);">
                  
                  <!-- OTP Box -->
                  <div style="background-color:#f8fafc; border:2px dashed #7c3aed; border-radius:12px; padding:20px; margin:30px 0;">
                    <p style="color:#6b7280; font-size:14px; margin:0 0 8px 0;">Your New Verification Code</p>
                    <h1 style="font-size:42px; letter-spacing:8px; color:#4f46e5; margin:0; font-weight:700;">
                      ${newOtp}
                    </h1>
                  </div>

                  <p style="color:#ef4444; font-size:15px; margin:20px 0;">
                    This code will expire in <strong>2 minutes</strong>.
                  </p>

                  <p style="color:#6b7280; font-size:14px;">
                    If you didn't request this code, you can safely ignore this email.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color:#f8fafc; padding:30px; text-align:center; border-top:1px solid #e5e7eb;">
                  <p style="color:#9ca3af; font-size:13px; margin:0;">
                    © 2026 BrowserAI. All rights reserved.
                  </p>
                  <p style="color:#9ca3af; font-size:13px; margin:8px 0 0 0;">
                    Need help? Contact us at support@browserai.com
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
        });
      } catch (emailError) {
        console.error("Resend Email Resending Error:", emailError);
        if (process.env.NODE_ENV === "development") {
          console.log(`[DEV ONLY BACKUP] Resend failed. New OTP for ${email} is: ${newOtp}`);
        } else {
          throw emailError;
        }
      }
    } else {
      console.log("-----------------------------------------");
      console.log(`[MOCK EMAIL] New OTP generated for ${email}: ${newOtp}`);
      console.log("-----------------------------------------");
    }

    res.status(200).json({
      success: true,
      message: "New OTP sent successfully to your email",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error during OTP resend",
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

    const accessToken = jwt.sign({ id: user._id }, config.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ id: user._id }, config.JWT_REFRESH_SECRET, {
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





async function logout(req, res) {
  res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });
  res.status(200).json({ success: true, message: "Logged out" });
}

async function refresh(req, res) {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ success: false, message: "No refresh token" });
  
  try {
    const decoded = jwt.verify(token, config.JWT_REFRESH_SECRET);
    const user = await registerModel.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: "User not found" });
    
    const accessToken = jwt.sign({ id: user._id }, config.JWT_ACCESS_SECRET, { expiresIn: "15m" });
    
    res.status(200).json({
      success: true,
      accessToken,
    });
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
  }
}


module.exports = { register, login, verifyOTP, resendOTP, refresh, logout };





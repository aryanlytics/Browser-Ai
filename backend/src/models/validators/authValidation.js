const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().trim().min(3).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
  }),

  email: Joi.string().trim().email().required().messages({
    "string.email": "Please provide a valid email",
    "string.empty": "Email is required",
  }),

  password: Joi.string().min(8).required().trim().messages({
    "string.min": "Password must be at least 8 characters",
    "string.empty": "Password is required",
  }),
});
const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.email": "Please provide a valid email",
    "string.empty": "Email is required",
  }),

  password: Joi.string().min(8).required().trim().messages({
    "string.min": "Password must be at least 8 characters",
    "string.empty": "Password is required",
  }),
});
const otpSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.email": "Please provide a valid email",
    "string.empty": "Email is required",
  }),
  otp: Joi.string().length(6).required().messages({
    "string.length": "OTP must be 6 digits",
    "string.empty": "OTP is required",
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  otpSchema,
};

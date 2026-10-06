const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { generateOTP } = require("../utils/otp");
const { sendOtpEmail } = require("../utils/email");
const otpModel = require("../models/otp.model");

async function registerUser(req, res) {
  try {
    const { name, email, password, } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      isVerified: false,
    });

    const otp = generateOTP();

    console.log(`OTP for ${email}: ${otp}`);

    await otpModel.create({
      email,
      otp,
      action: "account-verification",
    });

    await sendOtpEmail(email, otp, "account-verification");

    return res.status(201).json({
      message: "User registered successfully! Please check your email for OTP to verify your account",
      email
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

module.exports = { registerUser };

const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { generateOTP } = require("../utils/otp");
const { sendOtpEmail } = require("../utils/email");
const otpModel = require("../models/otp.model");
const { generateToken } = require("../utils/jwt");

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;
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
      message:
        "User registered successfully! Please check your email for OTP to verify your account",
      email,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function loginUser(req, res) {
  try {
      const { email, password } = req.body;

      let existingUser = await userModel.findOne({ email });
      if (!existingUser) {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }

      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }

      if (!existingUser.isVerified && existingUser.role === "user") {
        const otp = generateOTP();

        await otpModel.deleteMany({ email, action: "account-verification" });
        await otpModel.create({ email, otp, action: "account-verification" });

        await sendOtpEmail(email, otp, "account-verification");
        return res.status(400).json({
          message:
            "Account not verified. A new OTP has been sent to your mail ",
        });
      }

      res.status(200).json({
        message: "Login successfully",
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        token: generateToken(existingUser),
      });
  } catch (error) {
    res.status(500).json({
      message: "Login failed. Internal server error",
    });
  }
}

async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    const otpRecord = await otpModel.findOne({
      email,
      otp,
      action: "account-verification",
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await userModel.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true },
    );
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await otpModel.deleteMany({ email, action: "account-verification" });

    return res.status(200).json({
      message: "Account verified successfully. You can now log in.",
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    console.error("verifyOtp error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { registerUser, loginUser, verifyOtp };

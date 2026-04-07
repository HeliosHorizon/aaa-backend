import User from "../models/User.js";
import Otp from "../models/Otp.js";
import  sendOTPEmail  from "../services/email.js";
import  generateToken  from "../utils/jwt.js";

// SEND OTP
export async function sendOTP(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    await sendOTPEmail(email, otp);

    res.json({ message: "OTP sent" });

  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
}


// VERIFY OTP
export async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email });
    }

    const token = generateToken(user);

    await Otp.deleteMany({ email });

    res.json({
      message: "Login successful",
      token,
      user
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
}
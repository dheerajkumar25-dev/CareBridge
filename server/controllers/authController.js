// authController.js
// Handles registration, login, and password reset for all three roles.
// A patient/doctor registers with role="patient"/"doctor"; the matching
// Patient/Doctor profile document is created right after, linked by userId.

const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

// POST /api/auth/register
async function register(req, res) {
  try {
    const { name, email, password, role, specialization, fee } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });

    if (role === "doctor") {
      // specialization and fee are required to create a doctor profile
      await Doctor.create({ userId: user._id, specialization, fee });
    } else if (role === "patient") {
      await Patient.create({ userId: user._id });
    }
    // role "admin" has no extra profile document

    const token = generateToken(user._id, user.role);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "This account has been blocked. Contact support." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id, user.role);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
}

// POST /api/auth/forgot-password
// Generates a reset token, emails it to the user. Kept intentionally
// simple (token stored in-memory-less way isn't shown here) - a fuller
// version would store a hashed token + expiry on the User document.
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal whether the email exists - standard security practice
      return res.json({ message: "If that email exists, a reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendEmail(user.email, "CareBridge Password Reset", `Reset your password: ${resetLink}`);

    res.json({ message: "If that email exists, a reset link has been sent." });
  } catch (error) {
    res.status(500).json({ message: "Could not process request", error: error.message });
  }
}

// POST /api/auth/reset-password/:token
async function resetPassword(req, res) {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Reset link is invalid or has expired" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Could not reset password", error: error.message });
  }
}

module.exports = { register, login, forgotPassword, resetPassword };

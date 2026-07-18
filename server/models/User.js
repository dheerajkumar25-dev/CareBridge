// User.js
// Base account used for all three roles (patient, doctor, admin).
// Role-specific details (qualification, address, etc.) live in separate
// Doctor/Patient collections linked by userId - this keeps the auth
// logic identical for every role instead of duplicating login code.

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["patient", "doctor", "admin"], default: "patient" },
    profileImage: { type: String, default: "" },
    isActive: { type: Boolean, default: true }, // used by admin to block a user
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

// Review.js
// A patient can review a doctor after a completed appointment.

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, default: "" },
  },
  { timestamps: true }
);

// A patient can only review the same completed appointment once
reviewSchema.index({ appointmentId: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);

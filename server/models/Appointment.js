// Appointment.js
// The core booking record connecting a patient and a doctor.

const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    date: { type: String, required: true }, // stored as "YYYY-MM-DD" for simple filtering/sorting
    time: { type: String, required: true }, // e.g. "10:30 AM"
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
    notes: { type: String, default: "" }, // reason for visit, given by patient at booking time
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);

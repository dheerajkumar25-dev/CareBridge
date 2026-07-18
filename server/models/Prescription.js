// Prescription.js
// Written by a doctor after (or during) an appointment.

const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dosage: { type: String, default: "" },      // e.g. "1 tablet"
    morning: { type: Boolean, default: false },
    night: { type: Boolean, default: false },
    duration: { type: String, default: "" },     // e.g. "5 days"
  },
  { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
  {
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true, unique: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    medicines: [medicineSchema],
    advice: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);

// MedicalReport.js
// A file (PDF or image) a patient uploads, e.g. an old lab report,
// so the doctor can review it before/during the appointment.

const mongoose = require("mongoose");

const medicalReportSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    reportURL: { type: String, required: true }, // Cloudinary URL
    fileName: { type: String, default: "" },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicalReport", medicalReportSchema);

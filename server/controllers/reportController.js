// reportController.js
// Patients upload medical reports (PDF/image); their doctor can view them.

const MedicalReport = require("../models/MedicalReport");
const Patient = require("../models/Patient");
const cloudinary = require("../config/cloudinary");

// POST /api/reports  (protected - patient only, multipart upload)
async function uploadReport(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const patient = await Patient.findOne({ userId: req.user.id });
    if (!patient) return res.status(404).json({ message: "Patient profile not found" });

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "carebridge/medical-reports", resource_type: "auto" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(req.file.buffer);
    });

    const report = await MedicalReport.create({
      patientId: patient._id,
      reportURL: uploadResult.secure_url,
      fileName: req.file.originalname,
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
}

// GET /api/reports  (protected - patient sees their own reports)
async function getMyReports(req, res) {
  try {
    const patient = await Patient.findOne({ userId: req.user.id });
    const reports = await MedicalReport.find({ patientId: patient._id }).sort({ uploadedAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch reports", error: error.message });
  }
}

// GET /api/reports/patient/:patientId  (protected - doctor viewing a specific patient's reports)
async function getPatientReports(req, res) {
  try {
    const reports = await MedicalReport.find({ patientId: req.params.patientId }).sort({ uploadedAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch reports", error: error.message });
  }
}

module.exports = { uploadReport, getMyReports, getPatientReports };

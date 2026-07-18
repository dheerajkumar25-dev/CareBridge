// prescriptionController.js
// Doctor writes a prescription after an appointment; patient can view it
// and download it as a PDF.

const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const generatePrescriptionPDF = require("../utils/generatePrescriptionPDF");

// POST /api/prescriptions  (protected - doctor only)
async function createPrescription(req, res) {
  try {
    const { appointmentId, medicines, advice } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (String(appointment.doctorId) !== String(doctor._id)) {
      return res.status(403).json({ message: "This appointment does not belong to you" });
    }

    const prescription = await Prescription.create({
      appointmentId,
      doctorId: doctor._id,
      patientId: appointment.patientId,
      medicines,
      advice,
    });

    res.status(201).json(prescription);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "A prescription already exists for this appointment" });
    }
    res.status(500).json({ message: "Could not create prescription", error: error.message });
  }
}

// GET /api/prescriptions/:appointmentId  (protected - doctor or patient involved)
async function getPrescription(req, res) {
  try {
    const prescription = await Prescription.findOne({ appointmentId: req.params.appointmentId })
      .populate({ path: "doctorId", populate: { path: "userId", select: "name" } })
      .populate({ path: "patientId", populate: { path: "userId", select: "name" } });

    if (!prescription) return res.status(404).json({ message: "No prescription found for this appointment" });
    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch prescription", error: error.message });
  }
}

// GET /api/prescriptions/:appointmentId/pdf  (protected - doctor or patient involved)
async function downloadPrescriptionPDF(req, res) {
  try {
    const prescription = await Prescription.findOne({ appointmentId: req.params.appointmentId })
      .populate({ path: "doctorId", populate: { path: "userId", select: "name" } })
      .populate({ path: "patientId", populate: { path: "userId", select: "name" } });

    if (!prescription) return res.status(404).json({ message: "No prescription found for this appointment" });

    generatePrescriptionPDF(res, {
      doctorName: prescription.doctorId.userId.name,
      patientName: prescription.patientId.userId.name,
      date: prescription.createdAt.toDateString(),
      medicines: prescription.medicines,
      advice: prescription.advice,
    });
  } catch (error) {
    res.status(500).json({ message: "Could not generate PDF", error: error.message });
  }
}

module.exports = { createPrescription, getPrescription, downloadPrescriptionPDF };

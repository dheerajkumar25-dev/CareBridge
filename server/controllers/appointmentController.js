// appointmentController.js
// Booking, listing, and status updates (accept/reject/complete/cancel).

const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// POST /api/appointments  (protected - patient only)
async function bookAppointment(req, res) {
  try {
    const { doctorId, date, time, notes } = req.body;

    const patient = await Patient.findOne({ userId: req.user.id });
    if (!patient) return res.status(404).json({ message: "Patient profile not found" });

    // Prevent double-booking the same doctor/date/time slot
    const alreadyBooked = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: { $in: ["pending", "accepted"] },
    });
    if (alreadyBooked) {
      return res.status(400).json({ message: "This slot has just been booked by someone else. Please pick another." });
    }

    const appointment = await Appointment.create({
      doctorId,
      patientId: patient._id,
      date,
      time,
      notes,
    });

    // Best-effort confirmation email - booking should still succeed even
    // if the email fails to send (e.g. bad SMTP credentials in .env), so
    // this is wrapped in its own try/catch rather than the outer one.
    try {
      const patientUser = await User.findById(req.user.id);
      await sendEmail(
        patientUser.email,
        "CareBridge - Appointment Booked",
        `Your appointment on ${date} at ${time} has been requested. You'll be notified once the doctor responds.`
      );
    } catch (emailError) {
      console.error("Booking confirmation email failed:", emailError.message);
    }

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Could not book appointment", error: error.message });
  }
}

// GET /api/appointments/booked-slots/:doctorId?month=YYYY-MM  (public)
// Used by the booking calendar to mark dates/times as already taken.
async function getBookedSlots(req, res) {
  try {
    const { doctorId } = req.params;
    const { month } = req.query; // "YYYY-MM"

    const filter = {
      doctorId,
      status: { $in: ["pending", "accepted"] },
    };
    if (month) {
      filter.date = new RegExp(`^${month}`); // date is stored as "YYYY-MM-DD"
    }

    const booked = await Appointment.find(filter).select("date time -_id");
    res.json(booked);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch booked slots", error: error.message });
  }
}

// GET /api/appointments  (protected - returns appointments for the logged-in user's role)
// Supports pagination via ?page=1&limit=10
async function getAppointments(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    let baseFilter = {};

    if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({ userId: req.user.id });
      baseFilter = { doctorId: doctor._id };
    } else if (req.user.role === "patient") {
      const patient = await Patient.findOne({ userId: req.user.id });
      baseFilter = { patientId: patient._id };
    }
    // admin - no filter, sees everything

    const totalCount = await Appointment.countDocuments(baseFilter);
    const appointments = await Appointment.find(baseFilter)
      .populate({ path: "doctorId", populate: { path: "userId", select: "name profileImage" } })
      .populate({ path: "patientId", populate: { path: "userId", select: "name profileImage" } })
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      appointments,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Could not fetch appointments", error: error.message });
  }
}

// PUT /api/appointments/:id  (protected - doctor updates status, patient can cancel)
async function updateAppointmentStatus(req, res) {
  try {
    const { status } = req.body; // "accepted" | "rejected" | "completed" | "cancelled"
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    const doctorStatuses = ["accepted", "rejected", "completed"];
    const patientStatuses = ["cancelled"];

    if (req.user.role === "doctor" && !doctorStatuses.includes(status)) {
      return res.status(403).json({ message: "Doctors can only accept, reject, or complete appointments" });
    }
    if (req.user.role === "patient" && !patientStatuses.includes(status)) {
      return res.status(403).json({ message: "Patients can only cancel appointments" });
    }

    appointment.status = status;
    await appointment.save();
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Could not update appointment", error: error.message });
  }
}

module.exports = { bookAppointment, getAppointments, updateAppointmentStatus, getBookedSlots };

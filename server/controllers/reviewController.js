// reviewController.js
// A patient can review a doctor only after a completed appointment.
// After saving, the doctor's average rating is recalculated - done here
// with a simple aggregate query rather than maintaining a running total,
// which keeps the logic easy to reason about for a project this size.

const Review = require("../models/Review");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

// POST /api/reviews  (protected - patient only)
async function addReview(req, res) {
  try {
    const { appointmentId, rating, review } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    if (appointment.status !== "completed") {
      return res.status(400).json({ message: "You can only review a completed appointment" });
    }

    const patient = await Patient.findOne({ userId: req.user.id });
    if (String(appointment.patientId) !== String(patient._id)) {
      return res.status(403).json({ message: "This appointment does not belong to you" });
    }

    const newReview = await Review.create({
      doctorId: appointment.doctorId,
      patientId: patient._id,
      appointmentId,
      rating,
      review,
    });

    // Recalculate the doctor's average rating
    const stats = await Review.aggregate([
      { $match: { doctorId: appointment.doctorId } },
      { $group: { _id: "$doctorId", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    if (stats.length > 0) {
      await Doctor.findByIdAndUpdate(appointment.doctorId, {
        rating: Math.round(stats[0].avgRating * 10) / 10,
        numReviews: stats[0].count,
      });
    }

    res.status(201).json(newReview);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already reviewed this appointment" });
    }
    res.status(500).json({ message: "Could not add review", error: error.message });
  }
}

// GET /api/reviews/:doctorId  (public)
async function getDoctorReviews(req, res) {
  try {
    const reviews = await Review.find({ doctorId: req.params.doctorId })
      .populate({ path: "patientId", populate: { path: "userId", select: "name" } })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch reviews", error: error.message });
  }
}

module.exports = { addReview, getDoctorReviews };

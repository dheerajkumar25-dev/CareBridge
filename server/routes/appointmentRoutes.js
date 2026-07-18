// appointmentRoutes.js
const express = require("express");
const protect = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const { bookAppointment, getAppointments, updateAppointmentStatus, getBookedSlots } = require("../controllers/appointmentController");

const router = express.Router();

router.post("/", protect, allowRoles("patient"), bookAppointment);
router.get("/booked-slots/:doctorId", getBookedSlots); // public - used by the booking calendar
router.get("/", protect, getAppointments); // works for patient, doctor, and admin
router.put("/:id", protect, allowRoles("doctor", "patient"), updateAppointmentStatus);

module.exports = router;

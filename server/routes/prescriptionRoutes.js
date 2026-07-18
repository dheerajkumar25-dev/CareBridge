// prescriptionRoutes.js
const express = require("express");
const protect = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const {
  createPrescription,
  getPrescription,
  downloadPrescriptionPDF,
} = require("../controllers/prescriptionController");

const router = express.Router();

router.post("/", protect, allowRoles("doctor"), createPrescription);
router.get("/:appointmentId", protect, allowRoles("doctor", "patient"), getPrescription);
router.get("/:appointmentId/pdf", protect, allowRoles("doctor", "patient"), downloadPrescriptionPDF);

module.exports = router;

// reportRoutes.js
const express = require("express");
const protect = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const upload = require("../middleware/upload");
const { uploadReport, getMyReports, getPatientReports } = require("../controllers/reportController");

const router = express.Router();

router.post("/", protect, allowRoles("patient"), upload.single("report"), uploadReport);
router.get("/", protect, allowRoles("patient"), getMyReports);
router.get("/patient/:patientId", protect, allowRoles("doctor"), getPatientReports);

module.exports = router;

// reviewRoutes.js
const express = require("express");
const protect = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const { addReview, getDoctorReviews } = require("../controllers/reviewController");

const router = express.Router();

router.post("/", protect, allowRoles("patient"), addReview);
router.get("/:doctorId", getDoctorReviews); // public

module.exports = router;

// doctorRoutes.js
const express = require("express");
const protect = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const {
  getDoctors,
  getDoctorById,
  getMyProfile,
  updateProfile,
  addSlots,
  deleteSlot,
} = require("../controllers/doctorController");

const router = express.Router();

// Public
router.get("/", getDoctors);

// Protected - doctor only. IMPORTANT: this must be registered BEFORE
// "/:id" below, otherwise Express would match "/me" as if "me" were an
// :id value and call getDoctorById instead of getMyProfile.
// (Profile photo upload lives at PUT /api/users/profile/photo instead -
// shared with patients, see routes/userRoutes.js)
router.get("/me", protect, allowRoles("doctor"), getMyProfile);
router.put("/profile", protect, allowRoles("doctor"), updateProfile);
router.post("/slots", protect, allowRoles("doctor"), addSlots);
router.delete("/slots/:day/:time", protect, allowRoles("doctor"), deleteSlot);

// Public - must come after "/me" for the reason above
router.get("/:id", getDoctorById);

module.exports = router;

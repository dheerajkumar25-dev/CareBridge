// adminRoutes.js
const express = require("express");
const protect = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const {
  getDashboardStats,
  getAllDoctors,
  getAllPatients,
  getGrowthStats,
  verifyDoctor,
  toggleBlockUser,
  deleteUser,
  getSpecializations,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/dashboard", protect, allowRoles("admin"), getDashboardStats);
router.get("/growth", protect, allowRoles("admin"), getGrowthStats);
router.get("/doctors", protect, allowRoles("admin"), getAllDoctors);
router.get("/patients", protect, allowRoles("admin"), getAllPatients);
router.put("/verify-doctor/:id", protect, allowRoles("admin"), verifyDoctor);
router.put("/user/:id/block", protect, allowRoles("admin"), toggleBlockUser);
router.delete("/user/:id", protect, allowRoles("admin"), deleteUser);
router.get("/specializations", getSpecializations); // public, used by search filters

module.exports = router;

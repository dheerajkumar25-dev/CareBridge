// authRoutes.js
const express = require("express");
const { body } = require("express-validator");
const { register, login, forgotPassword, resetPassword } = require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").isIn(["patient", "doctor"]).withMessage("Role must be patient or doctor"),
  ],
  register
);

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;

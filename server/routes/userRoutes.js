// userRoutes.js
const express = require("express");
const protect = require("../middleware/auth");
const upload = require("../middleware/upload");
const { updateProfilePhoto } = require("../controllers/userController");

const router = express.Router();

router.put("/profile/photo", protect, upload.single("photo"), updateProfilePhoto);

module.exports = router;

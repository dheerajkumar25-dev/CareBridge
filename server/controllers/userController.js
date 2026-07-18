// userController.js
// Profile photo upload, shared by both patients and doctors since
// profileImage lives on the base User model, not on Doctor/Patient.
// (Previously this logic lived only inside doctorController.js -
// moved here so patients can reuse it instead of duplicating the code.)

const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

// PUT /api/users/profile/photo  (protected - any logged-in role)
async function updateProfilePhoto(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "carebridge/profile-photos" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(req.file.buffer);
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: uploadResult.secure_url },
      { new: true }
    );

    res.json({ profileImage: user.profileImage });
  } catch (error) {
    res.status(500).json({ message: "Photo upload failed", error: error.message });
  }
}

module.exports = { updateProfilePhoto };

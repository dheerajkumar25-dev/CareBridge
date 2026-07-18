// upload.js
// Multer handles the multipart/form-data file upload from the browser
// and gives us the file as a buffer in memory (memoryStorage) - we then
// pass that buffer straight to Cloudinary in the controller, instead of
// saving it to disk first. This avoids leftover temp files and works
// fine on free hosting where local disk storage isn't persistent.

const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, and PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = upload;

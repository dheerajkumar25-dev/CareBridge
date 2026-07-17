// cloudinary.js
// Cloudinary is used for storing profile photos and uploaded medical
// reports in the cloud (free tier) instead of on the server's disk -
// this matters because most free hosting (e.g. Render's free plan)
// wipes local files on every restart/redeploy.

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;

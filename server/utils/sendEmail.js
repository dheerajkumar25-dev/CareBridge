// sendEmail.js
// Sends emails (used for "forgot password" and appointment confirmations)
// via Nodemailer. Uses Gmail by default - for local testing without a
// real inbox, Ethereal (https://ethereal.email) or Mailtrap work well too,
// just swap the transporter config below.

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(to, subject, text) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
}

module.exports = sendEmail;

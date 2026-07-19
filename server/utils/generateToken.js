// generateToken.js
// Creates a signed JWT containing the user's id and role.
// The role is included in the token so middleware/role.js can check
// permissions without a second database lookup on every request.

const jwt = require("jsonwebtoken");

function generateToken(userId, role) {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

module.exports = generateToken;

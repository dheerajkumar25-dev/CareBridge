// auth.js
// Verifies the JWT sent in the Authorization header and attaches the
// decoded user info (id, role) to req.user so later middleware/
// controllers know who's making the request.

const jwt = require("jsonwebtoken");

function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid or expired token" });
  }
}

module.exports = protect;

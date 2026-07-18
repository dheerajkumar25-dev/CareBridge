// role.js
// Restricts a route to specific roles. Used after auth.js, e.g.:
//   router.get("/admin/dashboard", protect, allowRoles("admin"), getDashboard)

function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied for this role" });
    }
    next();
  };
}

module.exports = allowRoles;

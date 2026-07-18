// adminController.js
// Platform-wide dashboard stats and moderation actions (verify doctors,
// block/delete users). Specializations aren't a separate collection -
// they're just the distinct `specialization` values already stored on
// Doctor documents, which is simpler than maintaining a second table
// that has to stay in sync.

const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");

// GET /api/admin/dashboard  (protected - admin only)
async function getDashboardStats(req, res) {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const verifiedDoctors = await Doctor.countDocuments({ verified: true });
    const totalPatients = await Patient.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const completedAppointments = await Appointment.countDocuments({ status: "completed" });

    // Revenue = sum of doctor fees for completed & paid appointments
    const revenueResult = await Appointment.aggregate([
      { $match: { status: "completed", paymentStatus: "paid" } },
      { $lookup: { from: "doctors", localField: "doctorId", foreignField: "_id", as: "doctor" } },
      { $unwind: "$doctor" },
      { $group: { _id: null, total: { $sum: "$doctor.fee" } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.json({
      totalDoctors,
      verifiedDoctors,
      pendingDoctors: totalDoctors - verifiedDoctors,
      totalPatients,
      totalUsers,
      totalAppointments,
      completedAppointments,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: "Could not fetch dashboard stats", error: error.message });
  }
}

// GET /api/admin/doctors  (protected - admin only) - list all, including unverified, paginated
async function getAllDoctors(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const totalCount = await Doctor.countDocuments();
    const doctors = await Doctor.find()
      .populate("userId", "name email isActive")
      .skip(skip)
      .limit(Number(limit));

    res.json({
      doctors,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Could not fetch doctors", error: error.message });
  }
}

// PUT /api/admin/verify-doctor/:id  (protected - admin only)
async function verifyDoctor(req, res) {
  try {
    const { verified } = req.body; // true to approve, false to reject/un-verify
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, { verified }, { new: true });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Could not update doctor", error: error.message });
  }
}

// PUT /api/admin/user/:id/block  (protected - admin only) - toggles isActive
async function toggleBlockUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();
    res.json({ id: user._id, isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ message: "Could not update user", error: error.message });
  }
}

// DELETE /api/admin/user/:id  (protected - admin only)
async function deleteUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "doctor") await Doctor.findOneAndDelete({ userId: user._id });
    if (user.role === "patient") await Patient.findOneAndDelete({ userId: user._id });
    await user.deleteOne();

    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete user", error: error.message });
  }
}

// GET /api/admin/patients  (protected - admin only) - paginated
async function getAllPatients(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const totalCount = await Patient.countDocuments();
    const patients = await Patient.find()
      .populate("userId", "name email isActive")
      .skip(skip)
      .limit(Number(limit));

    res.json({
      patients,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Could not fetch patients", error: error.message });
  }
}

// GET /api/admin/growth  (protected - admin only)
// Returns new user sign-ups per month (last 6 months) for the admin
// dashboard growth chart. Grouped in JS rather than a Mongo aggregation
// pipeline, since with a student-project-scale user base this is simpler
// to read and debug than an equivalent $group/$dateToString pipeline.
async function getGrowthStats(req, res) {
  try {
    const users = await User.find().select("role createdAt");

    const monthlyMap = {};
    users.forEach((u) => {
      const month = u.createdAt.toISOString().slice(0, 7); // "YYYY-MM"
      if (!monthlyMap[month]) monthlyMap[month] = { month, doctors: 0, patients: 0 };
      if (u.role === "doctor") monthlyMap[month].doctors += 1;
      if (u.role === "patient") monthlyMap[month].patients += 1;
    });

    const growth = Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month));
    res.json(growth);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch growth stats", error: error.message });
  }
}

// GET /api/admin/specializations  (public) - distinct list for search filters
async function getSpecializations(req, res) {
  try {
    const specializations = await Doctor.distinct("specialization", { verified: true });
    res.json(specializations);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch specializations", error: error.message });
  }
}

module.exports = {
  getDashboardStats,
  getAllDoctors,
  getAllPatients,
  getGrowthStats,
  verifyDoctor,
  toggleBlockUser,
  deleteUser,
  getSpecializations,
};

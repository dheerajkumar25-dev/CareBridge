// doctorController.js
// Doctor search/listing (public) and doctor's own profile/availability
// management (protected, doctor-only).

const Doctor = require("../models/Doctor");

// GET /api/doctors  (public - search, filter, paginate)
// Query params: search, specialization, city, minFee, maxFee, minExperience,
// minRating, availableDay, page, limit
async function getDoctors(req, res) {
  try {
    const {
      search, specialization, city, minFee, maxFee,
      minExperience, minRating, availableDay,
      page = 1, limit = 9,
    } = req.query;

    const filter = { verified: true };
    if (specialization) filter.specialization = specialization;
    if (city) filter.city = new RegExp(city, "i");
    if (minFee || maxFee) {
      filter.fee = {};
      if (minFee) filter.fee.$gte = Number(minFee);
      if (maxFee) filter.fee.$lte = Number(maxFee);
    }
    if (minExperience) filter.experience = { $gte: Number(minExperience) };
    if (minRating) filter.rating = { $gte: Number(minRating) };
    if (availableDay) filter["availability.day"] = availableDay;

    let query = Doctor.find(filter).populate("userId", "name profileImage");
    let doctors = await query;

    // Search by doctor name OR hospital - name lives on the linked User
    // document (post-populate), hospital lives on Doctor itself, so this
    // is done in JS after the DB query rather than as a single Mongo query.
    if (search) {
      const term = search.toLowerCase();
      doctors = doctors.filter(
        (doc) =>
          doc.userId.name.toLowerCase().includes(term) ||
          doc.hospital.toLowerCase().includes(term)
      );
    }

    const totalCount = doctors.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));
    const start = (Number(page) - 1) * Number(limit);
    const paginated = doctors.slice(start, start + Number(limit));

    res.json({ doctors: paginated, totalCount, totalPages, currentPage: Number(page) });
  } catch (error) {
    res.status(500).json({ message: "Could not fetch doctors", error: error.message });
  }
}

// GET /api/doctors/:id  (public)
async function getDoctorById(req, res) {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("userId", "name profileImage email");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch doctor", error: error.message });
  }
}

// GET /api/doctors/me  (protected - doctor only, fetch own profile)
async function getMyProfile(req, res) {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id }).populate("userId", "name profileImage email");
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch profile", error: error.message });
  }
}

// PUT /api/doctors/profile  (protected - doctor only)
async function updateProfile(req, res) {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

    const allowedFields = ["qualification", "specialization", "experience", "hospital", "city", "fee", "bio"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) doctor[field] = req.body[field];
    });

    await doctor.save();
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Could not update profile", error: error.message });
  }
}

// POST /api/doctors/slots  (protected - doctor only)
async function addSlots(req, res) {
  try {
    const { day, times } = req.body; // times: array of strings, e.g. ["10:00 AM", "10:30 AM"]
    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

    const existingDay = doctor.availability.find((slot) => slot.day === day);
    if (existingDay) {
      existingDay.times = [...new Set([...existingDay.times, ...times])];
    } else {
      doctor.availability.push({ day, times });
    }

    await doctor.save();
    res.json(doctor.availability);
  } catch (error) {
    res.status(500).json({ message: "Could not add slots", error: error.message });
  }
}

// DELETE /api/doctors/slots/:day/:time  (protected - doctor only)
async function deleteSlot(req, res) {
  try {
    const { day, time } = req.params;
    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

    const daySlot = doctor.availability.find((slot) => slot.day === day);
    if (daySlot) {
      daySlot.times = daySlot.times.filter((t) => t !== decodeURIComponent(time));
    }

    await doctor.save();
    res.json(doctor.availability);
  } catch (error) {
    res.status(500).json({ message: "Could not delete slot", error: error.message });
  }
}

module.exports = {
  getDoctors,
  getDoctorById,
  getMyProfile,
  updateProfile,
  addSlots,
  deleteSlot,
};

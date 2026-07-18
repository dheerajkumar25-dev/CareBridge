// Doctor.js
// Doctor-specific profile. Linked to a User document via userId.
// Availability is stored as a simple array of { day, slots[] } - good
// enough for a placement project; a booking-heavy production app would
// likely generate slots per calendar date instead of per weekday, but
// that adds real complexity for little extra learning value here.

const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      required: true,
    },
    times: [{ type: String, required: true }], // e.g. ["10:00 AM", "10:30 AM"]
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    qualification: { type: String, default: "" },
    specialization: { type: String, required: true },
    experience: { type: Number, default: 0 }, // years
    hospital: { type: String, default: "" },
    city: { type: String, default: "" },
    fee: { type: Number, required: true },
    bio: { type: String, default: "" },
    availability: [slotSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    verified: { type: Boolean, default: false }, // admin approves before doctor appears in search
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);

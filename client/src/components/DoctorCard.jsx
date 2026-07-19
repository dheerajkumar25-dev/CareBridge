// DoctorCard.jsx
// Shown in the doctor search/listing grid. Uses a translucent,
// blurred-background ("glassmorphism") card style.

import React from "react";
import { Link } from "react-router-dom";

export default function DoctorCard({ doctor }) {
  return (
    <Link
      to={`/doctors/${doctor._id}`}
      className="block bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all p-5 border border-gray-100 dark:border-gray-700"
    >
      <img
        src={doctor.userId?.profileImage || "/default-doctor.png"}
        alt={doctor.userId?.name}
        className="w-20 h-20 rounded-full object-cover mx-auto mb-3 bg-gray-100"
      />
      <h3 className="text-lg font-semibold text-center">{doctor.userId?.name}</h3>
      <p className="text-primary text-center text-sm">{doctor.specialization}</p>
      <p className="text-gray-500 dark:text-gray-400 text-center text-sm">{doctor.experience} yrs experience</p>
      <div className="flex justify-between mt-3 text-sm">
        <span>⭐ {doctor.rating || "New"} ({doctor.numReviews} reviews)</span>
        <span className="font-semibold">₹{doctor.fee}</span>
      </div>
    </Link>
  );
}

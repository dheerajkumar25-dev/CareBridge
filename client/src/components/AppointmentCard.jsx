// AppointmentCard.jsx
// Shown in both the patient's and doctor's appointment lists.
// `viewAs` decides whether we show the doctor's name (to a patient) or
// the patient's name (to a doctor).

import React from "react";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-gray-100 text-gray-600",
};

export default function AppointmentCard({ appointment, viewAs, onAction }) {
  const otherPerson = viewAs === "patient" ? appointment.doctorId : appointment.patientId;
  const name = otherPerson?.userId?.name || "Unknown";

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center border border-gray-100">
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
        {appointment.notes && <p className="text-sm text-gray-400">Note: {appointment.notes}</p>}
      </div>

      <div className="flex items-center gap-3">
        <span className={`text-xs px-3 py-1 rounded-full ${statusColors[appointment.status]}`}>
          {appointment.status}
        </span>
        {onAction && appointment.status === "pending" && viewAs === "doctor" && (
          <>
            <button onClick={() => onAction(appointment._id, "accepted")} className="text-green-600 text-sm hover:underline">
              Accept
            </button>
            <button onClick={() => onAction(appointment._id, "rejected")} className="text-red-600 text-sm hover:underline">
              Reject
            </button>
          </>
        )}
        {onAction && appointment.status === "accepted" && viewAs === "doctor" && (
          <button onClick={() => onAction(appointment._id, "completed")} className="text-blue-600 text-sm hover:underline">
            Mark Completed
          </button>
        )}
        {onAction && ["pending", "accepted"].includes(appointment.status) && viewAs === "patient" && (
          <button onClick={() => onAction(appointment._id, "cancelled")} className="text-red-600 text-sm hover:underline">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

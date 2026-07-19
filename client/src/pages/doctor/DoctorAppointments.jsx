// DoctorAppointments.jsx
// Doctor's appointment management: accept/reject/complete, paginated,
// plus a link to write a prescription once an appointment is completed.

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import AppointmentCard from "../../components/AppointmentCard";
import Pagination from "../../components/Pagination";
import { SkeletonRowList } from "../../components/Skeleton";
import { useToast } from "../../context/ToastContext";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showToast } = useToast();

  function loadAppointments() {
    setLoading(true);
    api
      .get("/appointments", { params: { page, limit: 8 } })
      .then((res) => {
        setAppointments(res.data.appointments);
        setTotalPages(res.data.totalPages);
      })
      .finally(() => setLoading(false));
  }

  useEffect(loadAppointments, [page]);

  async function handleAction(id, status) {
    await api.put(`/appointments/${id}`, { status });
    showToast(`Appointment marked as ${status}.`, "success");
    loadAppointments();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">My Appointments</h1>

      {loading ? (
        <SkeletonRowList count={5} />
      ) : appointments.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No appointments yet.</p>
      ) : (
        <>
          <div className="space-y-3">
            {appointments.map((appt) => (
              <div key={appt._id}>
                <AppointmentCard appointment={appt} viewAs="doctor" onAction={handleAction} />
                {appt.status === "completed" && (
                  <Link
                    to={`/doctor/prescription/${appt._id}`}
                    className="text-primary text-sm inline-block mt-1 ml-1 hover:underline"
                  >
                    Write / View Prescription →
                  </Link>
                )}
              </div>
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

// PatientDashboard.jsx
// Shows the patient's appointments grouped into Upcoming / Completed / Cancelled,
// with pagination and skeleton loading.
//
// Simplification worth knowing: pagination applies to the raw appointment
// list from the API, and the Upcoming/Completed/Cancelled tabs then filter
// client-side within that page. That means the count shown next to each
// tab is "count on this page", not the total across all pages. Good enough
// for a student project; a fuller version would pass the tab as a status
// filter to the backend so each tab is paginated independently.

import React, { useEffect, useState } from "react";
import api from "../../services/api";
import AppointmentCard from "../../components/AppointmentCard";
import Pagination from "../../components/Pagination";
import { SkeletonRowList } from "../../components/Skeleton";
import { useToast } from "../../context/ToastContext";

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("upcoming");
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
    showToast("Appointment cancelled.", "success");
    loadAppointments();
  }

  const grouped = {
    upcoming: appointments.filter((a) => ["pending", "accepted"].includes(a.status)),
    completed: appointments.filter((a) => a.status === "completed"),
    cancelled: appointments.filter((a) => ["cancelled", "rejected"].includes(a.status)),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">My Appointments</h1>

      <div className="flex gap-4 mb-6 border-b dark:border-gray-700">
        {["upcoming", "completed", "cancelled"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 px-1 capitalize text-sm ${tab === t ? "border-b-2 border-primary text-primary font-medium" : "text-gray-500 dark:text-gray-400"}`}
          >
            {t} ({grouped[t].length})
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonRowList count={5} />
      ) : grouped[tab].length === 0 ? (
        <p className="text-gray-500 text-center py-10">No {tab} appointments.</p>
      ) : (
        <>
          <div className="space-y-3">
            {grouped[tab].map((appt) => (
              <AppointmentCard key={appt._id} appointment={appt} viewAs="patient" onAction={handleAction} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

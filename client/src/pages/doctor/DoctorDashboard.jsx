// DoctorDashboard.jsx
// Summary cards + charts: appointments per month, revenue per month,
// and unique patients per month - all computed client-side from the
// doctor's own appointment list. Fine at student-project scale; a
// higher-traffic app would aggregate these on the backend instead.
//
// Note: requests a high limit (1000) instead of paging through results,
// since dashboard charts need the full picture, not one page at a time.

import React, { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [fee, setFee] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/appointments", { params: { limit: 1000 } }),
      api.get("/doctors/me"),
    ])
      .then(([apptRes, doctorRes]) => {
        setAppointments(apptRes.data.appointments);
        setFee(doctorRes.data.fee);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const today = new Date().toISOString().split("T")[0];
  const counts = {
    today: appointments.filter((a) => a.date === today).length,
    upcoming: appointments.filter((a) => ["pending", "accepted"].includes(a.status)).length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => ["cancelled", "rejected"].includes(a.status)).length,
  };

  // Group by month for all three charts
  const monthlyMap = {};
  appointments.forEach((a) => {
    const month = a.date?.slice(0, 7) || "unknown"; // "YYYY-MM"
    if (!monthlyMap[month]) monthlyMap[month] = { month, appointments: 0, revenue: 0, patients: new Set() };
    monthlyMap[month].appointments += 1;
    if (a.status === "completed") monthlyMap[month].revenue += fee;
    monthlyMap[month].patients.add(a.patientId?._id);
  });

  const chartData = Object.values(monthlyMap)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((m) => ({ month: m.month, appointments: m.appointments, revenue: m.revenue, patients: m.patients.size }));

  const cards = [
    { label: "Today's Appointments", value: counts.today },
    { label: "Upcoming", value: counts.upcoming },
    { label: "Completed", value: counts.completed },
    { label: "Cancelled", value: counts.cancelled },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 text-center">
            <p className="text-3xl font-bold text-primary">{c.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {chartData.length === 0 ? (
        <p className="text-gray-500 text-sm">Not enough data yet for charts.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold mb-4">Appointments Per Month</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="appointments" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold mb-4">Revenue Per Month (₹)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 md:col-span-2">
            <h2 className="font-semibold mb-4">Unique Patients Per Month</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="patients" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

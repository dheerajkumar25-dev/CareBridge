// AdminDashboard.jsx
// Platform-wide stats cards + a growth chart (new doctor/patient
// sign-ups per month, last 6 months).

import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [growth, setGrowth] = useState([]);

  useEffect(() => {
    api.get("/admin/dashboard").then((res) => setStats(res.data));
    api.get("/admin/growth").then((res) => setGrowth(res.data));
  }, []);

  if (!stats) return <LoadingSpinner />;

  const cards = [
    { label: "Total Users", value: stats.totalUsers },
    { label: "Total Doctors", value: stats.totalDoctors },
    { label: "Verified Doctors", value: stats.verifiedDoctors },
    { label: "Pending Verification", value: stats.pendingDoctors },
    { label: "Total Patients", value: stats.totalPatients },
    { label: "Total Appointments", value: stats.totalAppointments },
    { label: "Completed Appointments", value: stats.completedAppointments },
    { label: "Total Revenue", value: `₹${stats.totalRevenue}` },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 text-center">
            <p className="text-2xl font-bold text-primary">{c.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="font-semibold mb-4">Platform Growth (Sign-ups per Month)</h2>
        {growth.length === 0 ? (
          <p className="text-gray-500 text-sm">Not enough data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={growth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="doctors" stroke="#2563eb" strokeWidth={2} name="New Doctors" />
              <Line type="monotone" dataKey="patients" stroke="#16a34a" strokeWidth={2} name="New Patients" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

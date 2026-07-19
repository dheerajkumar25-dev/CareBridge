// ManageDoctors.jsx
// Admin approves/rejects doctor sign-ups before they appear in patient search.

import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Pagination from "../../components/Pagination";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useToast } from "../../context/ToastContext";

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showToast } = useToast();

  function loadDoctors() {
    setLoading(true);
    api
      .get("/admin/doctors", { params: { page, limit: 8 } })
      .then((res) => {
        setDoctors(res.data.doctors);
        setTotalPages(res.data.totalPages);
      })
      .finally(() => setLoading(false));
  }

  useEffect(loadDoctors, [page]);

  async function handleVerify(id, verified) {
    await api.put(`/admin/verify-doctor/${id}`, { verified });
    showToast(verified ? "Doctor approved." : "Doctor un-verified.", "success");
    loadDoctors();
  }

  async function handleBlock(userId) {
    await api.put(`/admin/user/${userId}/block`);
    showToast("User status updated.", "success");
    loadDoctors();
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Manage Doctors</h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Specialization</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc._id} className="border-t dark:border-gray-700">
                <td className="p-3">{doc.userId?.name}</td>
                <td className="p-3">{doc.specialization}</td>
                <td className="p-3">
                  {doc.verified ? (
                    <span className="text-green-600">Verified</span>
                  ) : (
                    <span className="text-yellow-600">Pending</span>
                  )}
                  {!doc.userId?.isActive && <span className="text-red-500 ml-2">(Blocked)</span>}
                </td>
                <td className="p-3 space-x-3">
                  {!doc.verified ? (
                    <button onClick={() => handleVerify(doc._id, true)} className="text-green-600 hover:underline">Approve</button>
                  ) : (
                    <button onClick={() => handleVerify(doc._id, false)} className="text-yellow-600 hover:underline">Un-verify</button>
                  )}
                  <button onClick={() => handleBlock(doc.userId?._id)} className="text-red-600 hover:underline">
                    {doc.userId?.isActive ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {doctors.length === 0 && <p className="text-center text-gray-500 py-6">No doctors registered yet.</p>}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

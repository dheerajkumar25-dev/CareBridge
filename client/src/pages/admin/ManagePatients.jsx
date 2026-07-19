// ManagePatients.jsx
// Admin can block/unblock or delete patient accounts.

import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Pagination from "../../components/Pagination";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useToast } from "../../context/ToastContext";

export default function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showToast } = useToast();

  function loadPatients() {
    setLoading(true);
    api
      .get("/admin/patients", { params: { page, limit: 8 } })
      .then((res) => {
        setPatients(res.data.patients);
        setTotalPages(res.data.totalPages);
      })
      .finally(() => setLoading(false));
  }

  useEffect(loadPatients, [page]);

  async function handleBlock(userId) {
    await api.put(`/admin/user/${userId}/block`);
    showToast("User status updated.", "success");
    loadPatients();
  }

  async function handleDelete(userId) {
    if (!window.confirm("Delete this patient account permanently?")) return;
    await api.delete(`/admin/user/${userId}`);
    showToast("Patient deleted.", "success");
    loadPatients();
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Manage Patients</h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p._id} className="border-t dark:border-gray-700">
                <td className="p-3">{p.userId?.name}</td>
                <td className="p-3">{p.userId?.email}</td>
                <td className="p-3">
                  {p.userId?.isActive ? (
                    <span className="text-green-600">Active</span>
                  ) : (
                    <span className="text-red-500">Blocked</span>
                  )}
                </td>
                <td className="p-3 space-x-3">
                  <button onClick={() => handleBlock(p.userId?._id)} className="text-yellow-600 hover:underline">
                    {p.userId?.isActive ? "Block" : "Unblock"}
                  </button>
                  <button onClick={() => handleDelete(p.userId?._id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {patients.length === 0 && <p className="text-center text-gray-500 py-6">No patients registered yet.</p>}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

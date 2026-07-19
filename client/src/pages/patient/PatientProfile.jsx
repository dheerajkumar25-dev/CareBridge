// PatientProfile.jsx
// Lets the patient view/update basic info and upload medical reports.

import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function PatientProfile() {
  const [reports, setReports] = useState([]);
  const [file, setFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const { user } = useAuth();
  const { showToast } = useToast();

  function loadReports() {
    api.get("/reports").then((res) => setReports(res.data)).catch(() => {});
  }

  useEffect(loadReports, []);

  async function handlePhotoUpload() {
    // Note: after a successful upload, `user.profileImage` in AuthContext
    // is NOT automatically refreshed (it's only set at login/register).
    // The photo will show correctly after the next login. A more complete
    // version would add a refreshUser() function to AuthContext - listed
    // as a follow-up in the README rather than built here.
    if (!photoFile) return;
    const formData = new FormData();
    formData.append("photo", photoFile);
    try {
      await api.put("/users/profile/photo", formData, { headers: { "Content-Type": "multipart/form-data" } });
      showToast("Profile photo updated.", "success");
      setPhotoFile(null);
    } catch (error) {
      showToast("Photo upload failed.", "error");
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("report", file);

    try {
      await api.post("/reports", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setUploadMessage("Report uploaded successfully.");
      setFile(null);
      loadReports();
    } catch (error) {
      setUploadMessage(error.response?.data?.message || "Upload failed.");
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">My Profile & Reports</h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 mb-8 flex items-center gap-4">
        <img
          src={user?.profileImage || "/default-patient.png"}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover bg-gray-100"
        />
        <div>
          <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} className="text-sm" />
          <button onClick={handlePhotoUpload} className="ml-2 text-primary text-sm hover:underline">Upload</button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 mb-8">
        <h2 className="font-semibold mb-3">Upload a Medical Report</h2>
        <form onSubmit={handleUpload} className="flex gap-3 items-center">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm"
          />
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:opacity-90">
            Upload
          </button>
        </form>
        {uploadMessage && <p className="text-sm text-gray-500 mt-2">{uploadMessage}</p>}
      </div>

      <div>
        <h2 className="font-semibold mb-3">My Uploaded Reports</h2>
        {reports.length === 0 ? (
          <p className="text-gray-500 text-sm">No reports uploaded yet.</p>
        ) : (
          <ul className="space-y-2">
            {reports.map((r) => (
              <li key={r._id} className="bg-white p-3 rounded-md shadow-sm border border-gray-100 flex justify-between">
                <span className="text-sm">{r.fileName}</span>
                <a href={r.reportURL} target="_blank" rel="noreferrer" className="text-primary text-sm">View</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

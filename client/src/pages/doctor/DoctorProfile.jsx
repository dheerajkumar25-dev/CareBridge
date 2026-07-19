// DoctorProfile.jsx
// Lets the doctor edit their profile details and upload a profile photo.

import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";

export default function DoctorProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const { showToast } = useToast();

  function loadProfile() {
    api.get("/doctors/me").then((res) => {
      setProfile(res.data);
      setForm({
        qualification: res.data.qualification || "",
        specialization: res.data.specialization || "",
        experience: res.data.experience || 0,
        hospital: res.data.hospital || "",
        city: res.data.city || "",
        fee: res.data.fee || 0,
        bio: res.data.bio || "",
      });
    });
  }

  useEffect(loadProfile, []);

  async function handleSave(e) {
    e.preventDefault();
    try {
      await api.put("/doctors/profile", form);
      showToast("Profile updated.", "success");
      loadProfile();
    } catch (error) {
      showToast(error.response?.data?.message || "Could not update profile.", "error");
    }
  }

  async function handlePhotoUpload() {
    // Same note as PatientProfile.jsx: user.profileImage in AuthContext
    // won't refresh until next login - see that file for details.
    if (!photoFile) return;
    const formData = new FormData();
    formData.append("photo", photoFile);
    try {
      await api.put("/users/profile/photo", formData, { headers: { "Content-Type": "multipart/form-data" } });
      showToast("Profile photo updated.", "success");
      setPhotoFile(null);
      loadProfile();
    } catch (error) {
      showToast("Photo upload failed.", "error");
    }
  }

  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 mb-6 flex items-center gap-4">
        <img
          src={profile.userId?.profileImage || "/default-doctor.png"}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover bg-gray-100"
        />
        <div>
          <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} className="text-sm" />
          <button onClick={handlePhotoUpload} className="ml-2 text-primary text-sm hover:underline">Upload</button>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 space-y-4">
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">Qualification</label>
          <input className="w-full border dark:border-gray-600 dark:bg-gray-700 rounded-md px-3 py-2 mt-1" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">Specialization</label>
          <input className="w-full border dark:border-gray-600 dark:bg-gray-700 rounded-md px-3 py-2 mt-1" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">Experience (years)</label>
          <input type="number" className="w-full border dark:border-gray-600 dark:bg-gray-700 rounded-md px-3 py-2 mt-1" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">Hospital</label>
          <input className="w-full border dark:border-gray-600 dark:bg-gray-700 rounded-md px-3 py-2 mt-1" value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">City</label>
          <input className="w-full border dark:border-gray-600 dark:bg-gray-700 rounded-md px-3 py-2 mt-1" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">Consultation Fee (₹)</label>
          <input type="number" className="w-full border dark:border-gray-600 dark:bg-gray-700 rounded-md px-3 py-2 mt-1" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">Biography</label>
          <textarea className="w-full border dark:border-gray-600 dark:bg-gray-700 rounded-md px-3 py-2 mt-1" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </div>
        <button type="submit" className="bg-primary text-white px-5 py-2 rounded-md hover:opacity-90">Save Changes</button>
      </form>
    </div>
  );
}

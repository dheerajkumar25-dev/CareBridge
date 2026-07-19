// Doctors.jsx
// Public doctor search/listing page. The single search box matches
// against both doctor name and hospital (handled server-side), plus
// dedicated filters for specialization, city, fee, experience, rating,
// and day of availability. Results are paginated.

import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import DoctorCard from "../components/DoctorCard";
import Pagination from "../components/Pagination";
import { SkeletonCardGrid } from "../components/Skeleton";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function Doctors() {
  const [urlParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specializations, setSpecializations] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    search: urlParams.get("search") || "",
    specialization: "",
    city: "",
    minExperience: "",
    minRating: "",
    availableDay: "",
  });

  useEffect(() => {
    api.get("/admin/specializations").then((res) => setSpecializations(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 9 };
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });

    api
      .get("/doctors", { params })
      .then((res) => {
        setDoctors(res.data.doctors);
        setTotalPages(res.data.totalPages);
      })
      .catch(() => setDoctors([]))
      .finally(() => setLoading(false));
  }, [filters, page]);

  function updateFilter(key, value) {
    setPage(1); // reset to page 1 whenever filters change
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Find a Doctor</h1>

      <div className="flex flex-wrap gap-3 mb-8">
        <input
          placeholder="Search by name or hospital..."
          className="border dark:border-gray-600 dark:bg-gray-800 rounded-md px-3 py-2 text-sm flex-1 min-w-[220px]"
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
        />
        <select
          className="border dark:border-gray-600 dark:bg-gray-800 rounded-md px-3 py-2 text-sm"
          value={filters.specialization}
          onChange={(e) => updateFilter("specialization", e.target.value)}
        >
          <option value="">All Specializations</option>
          {specializations.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          placeholder="City"
          className="border dark:border-gray-600 dark:bg-gray-800 rounded-md px-3 py-2 text-sm w-32"
          value={filters.city}
          onChange={(e) => updateFilter("city", e.target.value)}
        />
        <select
          className="border dark:border-gray-600 dark:bg-gray-800 rounded-md px-3 py-2 text-sm"
          value={filters.minExperience}
          onChange={(e) => updateFilter("minExperience", e.target.value)}
        >
          <option value="">Any Experience</option>
          <option value="2">2+ years</option>
          <option value="5">5+ years</option>
          <option value="10">10+ years</option>
        </select>
        <select
          className="border dark:border-gray-600 dark:bg-gray-800 rounded-md px-3 py-2 text-sm"
          value={filters.minRating}
          onChange={(e) => updateFilter("minRating", e.target.value)}
        >
          <option value="">Any Rating</option>
          <option value="3">3+ ⭐</option>
          <option value="4">4+ ⭐</option>
        </select>
        <select
          className="border dark:border-gray-600 dark:bg-gray-800 rounded-md px-3 py-2 text-sm"
          value={filters.availableDay}
          onChange={(e) => updateFilter("availableDay", e.target.value)}
        >
          <option value="">Any Day</option>
          {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {loading ? (
        <SkeletonCardGrid count={9} />
      ) : doctors.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No doctors found matching your filters.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {doctors.map((doc) => (
              <DoctorCard key={doc._id} doctor={doc} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

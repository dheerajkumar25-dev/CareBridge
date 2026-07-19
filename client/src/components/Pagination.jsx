// Pagination.jsx
// Reusable page-number control. Used by the doctor list, appointment
// lists, and admin patient/doctor tables - all of which now return
// { data, currentPage, totalPages } from the backend instead of a plain array.

import React from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 rounded-md border text-sm disabled:opacity-40 dark:border-gray-600"
      >
        Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded-md text-sm border dark:border-gray-600 ${
            p === currentPage ? "bg-primary text-white border-primary" : ""
          }`}
        >
          {p}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 rounded-md border text-sm disabled:opacity-40 dark:border-gray-600"
      >
        Next
      </button>
    </div>
  );
}

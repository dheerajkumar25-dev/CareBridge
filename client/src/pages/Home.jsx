// Home.jsx
// Landing page: hero with a quick search bar, trust stats, how-it-works,
// and a closing call-to-action. The hero search bar just forwards the
// query to /doctors?search=... rather than duplicating filter logic here.

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    navigate(query ? `/doctors?search=${encodeURIComponent(query)}` : "/doctors");
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-24 overflow-hidden">
        <div className="max-w-3xl mx-auto text-center px-4 relative z-10">
          <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full mb-4">
            Trusted by patients across the city
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Find the right doctor,<br />book in minutes
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            CareBridge connects patients with verified doctors across specializations —
            search, compare, and book an appointment online.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto mb-6">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, hospital, or specialty..."
              className="flex-1 px-4 py-3 rounded-full border border-gray-200 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="bg-primary text-white px-6 rounded-full hover:opacity-90">
              Search
            </button>
          </form>

          <div className="flex gap-3 justify-center">
            <Link to="/doctors" className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:opacity-90">
              Find a Doctor
            </Link>
            <Link to="/register" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-6 py-3 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
              Book Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* Trust stats */}
      <section className="max-w-4xl mx-auto -mt-8 relative z-10 px-4">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-700 py-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">500+</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Trusted Specialists</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">10k+</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Appointments Booked</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">4.8 ⭐</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Average Patient Rating</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto py-20 px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-lg mb-2">Search & Compare</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Filter doctors by specialization, city, fee, and rating.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-lg mb-2">Book Instantly</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Pick an available date on the calendar and confirm your slot online.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-lg mb-2">Manage Everything</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Track appointments, prescriptions, and reports in one dashboard.</p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-primary/5 dark:bg-gray-800 py-16 text-center px-4">
        <h2 className="text-2xl font-bold mb-3">Ready to book your appointment?</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Join thousands of patients who trust CareBridge.</p>
        <Link to="/doctors" className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:opacity-90">
          Get Started
        </Link>
      </section>
    </div>
  );
}

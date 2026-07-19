// Navbar.jsx
// Top navigation bar. Shows different links depending on whether the
// user is logged out, or logged in as patient/doctor/admin, plus a
// light/dark mode toggle.

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary">CareBridge</Link>

        <div className="flex items-center gap-5 text-sm">
          <Link to="/doctors" className="hover:text-primary">Find Doctors</Link>

          {!user && (
            <>
              <Link to="/login" className="hover:text-primary">Login</Link>
              <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-full hover:opacity-90">
                Sign Up
              </Link>
            </>
          )}

          {user?.role === "patient" && (
            <>
              <Link to="/patient/dashboard" className="hover:text-primary">My Appointments</Link>
              <Link to="/patient/profile" className="hover:text-primary">Profile & Reports</Link>
            </>
          )}

          {user?.role === "doctor" && (
            <>
              <Link to="/doctor/dashboard" className="hover:text-primary">Dashboard</Link>
              <Link to="/doctor/appointments" className="hover:text-primary">Appointments</Link>
              <Link to="/doctor/availability" className="hover:text-primary">Availability</Link>
              <Link to="/doctor/profile" className="hover:text-primary">Profile</Link>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <Link to="/admin/dashboard" className="hover:text-primary">Dashboard</Link>
              <Link to="/admin/doctors" className="hover:text-primary">Doctors</Link>
              <Link to="/admin/patients" className="hover:text-primary">Patients</Link>
            </>
          )}

          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {user && (
            <>
              <span className="text-gray-500 dark:text-gray-400">Hi, {user.name.split(" ")[0]}</span>
              <button onClick={handleLogout} className="hover:text-red-600">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

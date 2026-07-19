// App.jsx
// All routes for the app, including role-protected ones.

import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Doctors from "./pages/Doctors";
import DoctorDetails from "./pages/DoctorDetails";

import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientProfile from "./pages/patient/PatientProfile";

import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAvailability from "./pages/doctor/DoctorAvailability";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorPrescription from "./pages/doctor/DoctorPrescription";
import DoctorProfile from "./pages/doctor/DoctorProfile";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageDoctors from "./pages/admin/ManageDoctors";
import ManagePatients from "./pages/admin/ManagePatients";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:id" element={<DoctorDetails />} />

          {/* Patient */}
          <Route path="/patient/dashboard" element={
            <ProtectedRoute allowedRoles={["patient"]}><PatientDashboard /></ProtectedRoute>
          } />
          <Route path="/patient/profile" element={
            <ProtectedRoute allowedRoles={["patient"]}><PatientProfile /></ProtectedRoute>
          } />

          {/* Doctor */}
          <Route path="/doctor/dashboard" element={
            <ProtectedRoute allowedRoles={["doctor"]}><DoctorDashboard /></ProtectedRoute>
          } />
          <Route path="/doctor/availability" element={
            <ProtectedRoute allowedRoles={["doctor"]}><DoctorAvailability /></ProtectedRoute>
          } />
          <Route path="/doctor/appointments" element={
            <ProtectedRoute allowedRoles={["doctor"]}><DoctorAppointments /></ProtectedRoute>
          } />
          <Route path="/doctor/prescription/:appointmentId" element={
            <ProtectedRoute allowedRoles={["doctor"]}><DoctorPrescription /></ProtectedRoute>
          } />
          <Route path="/doctor/profile" element={
            <ProtectedRoute allowedRoles={["doctor"]}><DoctorProfile /></ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/doctors" element={
            <ProtectedRoute allowedRoles={["admin"]}><ManageDoctors /></ProtectedRoute>
          } />
          <Route path="/admin/patients" element={
            <ProtectedRoute allowedRoles={["admin"]}><ManagePatients /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<p className="text-center py-20">Page not found.</p>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

// Register.jsx
// Handles both patient and doctor sign-up with one form - a role toggle
// shows the two extra fields (specialization, fee) only for doctors.

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { role: "patient" },
  });
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const selectedRole = watch("role");

  async function onSubmit(data) {
    setServerError("");
    try {
      const user = await registerUser(data);
      if (user.role === "doctor") navigate("/doctor/dashboard");
      else navigate("/patient/dashboard");
    } catch (error) {
      setServerError(error.response?.data?.message || "Registration failed. Please try again.");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center">Create your CareBridge account</h2>

      {serverError && <p className="text-red-600 text-sm mb-4 text-center">{serverError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4 justify-center text-sm">
          <label className="flex items-center gap-1">
            <input type="radio" value="patient" {...register("role")} /> I'm a Patient
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" value="doctor" {...register("role")} /> I'm a Doctor
          </label>
        </div>

        <div>
          <label className="text-sm text-gray-600">Full Name</label>
          <input className="w-full border rounded-md px-3 py-2 mt-1" {...register("name", { required: "Name is required" })} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input type="email" className="w-full border rounded-md px-3 py-2 mt-1" {...register("email", { required: "Email is required" })} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-600">Password</label>
          <input
            type="password"
            className="w-full border rounded-md px-3 py-2 mt-1"
            {...register("password", { required: "Password is required", minLength: { value: 6, message: "At least 6 characters" } })}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {selectedRole === "doctor" && (
          <>
            <div>
              <label className="text-sm text-gray-600">Specialization</label>
              <input className="w-full border rounded-md px-3 py-2 mt-1" {...register("specialization", { required: "Specialization is required" })} />
              {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization.message}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-600">Consultation Fee (₹)</label>
              <input type="number" className="w-full border rounded-md px-3 py-2 mt-1" {...register("fee", { required: "Fee is required" })} />
              {errors.fee && <p className="text-red-500 text-xs mt-1">{errors.fee.message}</p>}
            </div>
            <p className="text-xs text-gray-400">
              Your profile will be visible to patients only after admin verification.
            </p>
          </>
        )}

        <button type="submit" className="w-full bg-primary text-white py-2 rounded-md hover:opacity-90">
          Create Account
        </button>
      </form>

      <p className="text-sm text-center mt-4 text-gray-500">
        Already have an account? <Link to="/login" className="text-primary">Log in</Link>
      </p>
    </div>
  );
}

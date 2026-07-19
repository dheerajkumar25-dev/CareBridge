// Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  async function onSubmit(data) {
    setServerError("");
    try {
      const user = await login(data.email, data.password);
      if (user.role === "doctor") navigate("/doctor/dashboard");
      else if (user.role === "admin") navigate("/admin/dashboard");
      else navigate("/patient/dashboard");
    } catch (error) {
      setServerError(error.response?.data?.message || "Login failed. Please try again.");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center">Log in to CareBridge</h2>

      {serverError && <p className="text-red-600 text-sm mb-4 text-center">{serverError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            className="w-full border rounded-md px-3 py-2 mt-1"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-600">Password</label>
          <input
            type="password"
            className="w-full border rounded-md px-3 py-2 mt-1"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button type="submit" className="w-full bg-primary text-white py-2 rounded-md hover:opacity-90">
          Log In
        </button>
      </form>

      <p className="text-sm text-center mt-4 text-gray-500">
        Don't have an account? <Link to="/register" className="text-primary">Sign up</Link>
      </p>
    </div>
  );
}

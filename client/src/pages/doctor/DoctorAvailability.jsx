// DoctorAvailability.jsx
// Lets the doctor add time slots for a day of the week, and remove
// individual slots. Uses the same slot-generation idea as the backend's
// generateSlots.js, but here the doctor just types times manually for
// simplicity (typing "10:00 AM, 10:30 AM, 11:00 AM" and splitting on commas).

import React, { useEffect, useState } from "react";
import api from "../../services/api";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function DoctorAvailability() {
  const [availability, setAvailability] = useState([]);
  const [day, setDay] = useState("Monday");
  const [timesInput, setTimesInput] = useState("");
  const [message, setMessage] = useState("");

  function loadProfile() {
    api.get("/doctors/me").then((res) => setAvailability(res.data.availability)).catch(() => {});
  }

  useEffect(loadProfile, []);

  async function handleAddSlots(e) {
    e.preventDefault();
    const times = timesInput.split(",").map((t) => t.trim()).filter(Boolean);
    if (times.length === 0) return;

    try {
      const { data } = await api.post("/doctors/slots", { day, times });
      setAvailability(data);
      setTimesInput("");
      setMessage("Slots added.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not add slots.");
    }
  }

  async function handleDeleteSlot(slotDay, time) {
    try {
      const { data } = await api.delete(`/doctors/slots/${slotDay}/${encodeURIComponent(time)}`);
      setAvailability(data);
    } catch (error) {
      setMessage("Could not delete slot.");
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Manage Availability</h1>

      <form onSubmit={handleAddSlots} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
        <div className="mb-4">
          <label className="text-sm text-gray-600">Day</label>
          <select value={day} onChange={(e) => setDay(e.target.value)} className="w-full border rounded-md px-3 py-2 mt-1">
            {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="text-sm text-gray-600">Time slots (comma-separated, e.g. "10:00 AM, 10:30 AM, 11:00 AM")</label>
          <input
            className="w-full border rounded-md px-3 py-2 mt-1"
            value={timesInput}
            onChange={(e) => setTimesInput(e.target.value)}
            placeholder="10:00 AM, 10:30 AM, 11:00 AM"
          />
        </div>
        <button type="submit" className="bg-primary text-white px-5 py-2 rounded-md hover:opacity-90">
          Add Slots
        </button>
        {message && <p className="text-sm text-gray-500 mt-2">{message}</p>}
      </form>

      <div className="space-y-4">
        {availability.map((slot) => (
          <div key={slot.day} className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <p className="font-medium mb-2">{slot.day}</p>
            <div className="flex flex-wrap gap-2">
              {slot.times.map((t) => (
                <span key={t} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {t}
                  <button onClick={() => handleDeleteSlot(slot.day, t)} className="text-red-500">×</button>
                </span>
              ))}
            </div>
          </div>
        ))}
        {availability.length === 0 && (
          <p className="text-gray-500 text-sm">No slots added yet. Add your first slot above.</p>
        )}
      </div>
    </div>
  );
}

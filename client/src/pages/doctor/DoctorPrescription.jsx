// DoctorPrescription.jsx
// Lets a doctor write a prescription (dynamic list of medicines) for a
// completed appointment. If one already exists, it's shown read-only
// with a PDF download link instead of the form.

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const emptyMedicine = { name: "", dosage: "", morning: false, night: false, duration: "" };

export default function DoctorPrescription() {
  const { appointmentId } = useParams();
  const [existing, setExisting] = useState(null);
  const [medicines, setMedicines] = useState([{ ...emptyMedicine }]);
  const [advice, setAdvice] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get(`/prescriptions/${appointmentId}`)
      .then((res) => setExisting(res.data))
      .catch(() => setExisting(null)); // 404 just means none written yet
  }, [appointmentId]);

  function updateMedicine(index, field, value) {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  }

  function addMedicineRow() {
    setMedicines([...medicines, { ...emptyMedicine }]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data } = await api.post("/prescriptions", { appointmentId, medicines, advice });
      setExisting(data);
      setMessage("Prescription saved.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not save prescription.");
    }
  }

  if (existing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Prescription</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          {existing.medicines.map((m, i) => (
            <p key={i} className="text-sm mb-1">
              {i + 1}. {m.name} - {m.dosage} ({[m.morning && "Morning", m.night && "Night"].filter(Boolean).join(" & ")}) for {m.duration}
            </p>
          ))}
          {existing.advice && <p className="text-sm mt-3 text-gray-600">Advice: {existing.advice}</p>}
          <a
            href={`/api/prescriptions/${appointmentId}/pdf`}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-4 bg-primary text-white px-4 py-2 rounded-md text-sm hover:opacity-90"
          >
            Download PDF
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Write Prescription</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
        {medicines.map((med, i) => (
          <div key={i} className="border rounded-md p-3 space-y-2">
            <input
              placeholder="Medicine name"
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={med.name}
              onChange={(e) => updateMedicine(i, "name", e.target.value)}
            />
            <input
              placeholder="Dosage (e.g. 1 tablet)"
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={med.dosage}
              onChange={(e) => updateMedicine(i, "dosage", e.target.value)}
            />
            <div className="flex gap-4 text-sm">
              <label><input type="checkbox" checked={med.morning} onChange={(e) => updateMedicine(i, "morning", e.target.checked)} /> Morning</label>
              <label><input type="checkbox" checked={med.night} onChange={(e) => updateMedicine(i, "night", e.target.checked)} /> Night</label>
            </div>
            <input
              placeholder="Duration (e.g. 5 days)"
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={med.duration}
              onChange={(e) => updateMedicine(i, "duration", e.target.value)}
            />
          </div>
        ))}

        <button type="button" onClick={addMedicineRow} className="text-primary text-sm hover:underline">
          + Add another medicine
        </button>

        <textarea
          placeholder="General advice for the patient"
          className="w-full border rounded-md px-3 py-2 text-sm"
          value={advice}
          onChange={(e) => setAdvice(e.target.value)}
        />

        <button type="submit" className="bg-primary text-white px-5 py-2 rounded-md hover:opacity-90">
          Save Prescription
        </button>
        {message && <p className="text-sm text-gray-500">{message}</p>}
      </form>
    </div>
  );
}

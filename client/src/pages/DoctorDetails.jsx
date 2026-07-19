// DoctorDetails.jsx
// Shows one doctor's full profile, a real month calendar for booking
// (green = available, gray = unavailable, red = fully booked), and
// lists reviews.

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import Calendar from "../components/Calendar";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function DoctorDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");

  useEffect(() => {
    Promise.all([
      api.get(`/doctors/${id}`),
      api.get(`/reviews/${id}`),
      api.get(`/appointments/booked-slots/${id}`),
    ])
      .then(([docRes, reviewRes, bookedRes]) => {
        setDoctor(docRes.data);
        setReviews(reviewRes.data);
        setBookedSlots(bookedRes.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  function handleSelectDate(dateStr, dayOfWeek) {
    setSelectedDate(dateStr);
    setSelectedDay(dayOfWeek);
    setSelectedTime("");
  }

  async function handleBook() {
    if (!user) return navigate("/login");
    if (!selectedDate || !selectedTime) {
      setBookingMessage("Please select a date and time slot.");
      return;
    }
    try {
      await api.post("/appointments", { doctorId: id, date: selectedDate, time: selectedTime, notes: "" });
      showToast("Appointment booked successfully. Confirmation email sent.", "success");
      setBookingMessage("");
      setSelectedTime("");
      // refresh booked slots so the calendar reflects the new booking
      const { data } = await api.get(`/appointments/booked-slots/${id}`);
      setBookedSlots(data);
    } catch (error) {
      const msg = error.response?.data?.message || "Booking failed.";
      setBookingMessage(msg);
      showToast(msg, "error");
    }
  }

  if (loading) return <LoadingSpinner />;
  if (!doctor) return <p className="text-center py-10">Doctor not found.</p>;

  const availableTimesForSelectedDay = selectedDay
    ? doctor.availability.find((s) => s.day === selectedDay)?.times || []
    : [];
  const bookedTimesForSelectedDate = bookedSlots
    .filter((b) => b.date === selectedDate)
    .map((b) => b.time);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-sm p-6 flex gap-6 border border-gray-100 dark:border-gray-700">
        <img
          src={doctor.userId?.profileImage || "/default-doctor.png"}
          alt={doctor.userId?.name}
          className="w-28 h-28 rounded-full object-cover bg-gray-100"
        />
        <div>
          <h1 className="text-2xl font-bold">{doctor.userId?.name}</h1>
          <p className="text-primary">{doctor.specialization}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{doctor.qualification}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{doctor.experience} years experience · {doctor.hospital}</p>
          <p className="mt-2 text-sm">⭐ {doctor.rating || "New"} ({doctor.numReviews} reviews)</p>
          <p className="font-semibold mt-1">Consultation Fee: ₹{doctor.fee}</p>
        </div>
      </div>

      {doctor.bio && <p className="mt-6 text-gray-600 dark:text-gray-300">{doctor.bio}</p>}

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Pick a Date</h2>
          <Calendar
            availability={doctor.availability}
            bookedSlots={bookedSlots}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Pick a Time</h2>
          {!selectedDate ? (
            <p className="text-gray-500 text-sm">Select an available (green) date first.</p>
          ) : (
            <div className="flex flex-wrap gap-2 mb-4">
              {availableTimesForSelectedDay.map((time) => {
                const isBooked = bookedTimesForSelectedDate.includes(time);
                return (
                  <button
                    key={time}
                    disabled={isBooked}
                    onClick={() => setSelectedTime(time)}
                    className={`px-3 py-1 rounded-md text-sm border dark:border-gray-600 ${
                      isBooked
                        ? "line-through text-gray-300 cursor-not-allowed"
                        : selectedTime === time
                        ? "bg-primary text-white"
                        : "bg-gray-50 dark:bg-gray-700"
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          )}

          <button
            onClick={handleBook}
            disabled={!selectedDate || !selectedTime}
            className="bg-primary text-white px-5 py-2 rounded-md hover:opacity-90 disabled:opacity-40"
          >
            Confirm Booking
          </button>
          {bookingMessage && <p className="text-sm mt-3 text-gray-600 dark:text-gray-300">{bookingMessage}</p>}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Patient Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">No reviews yet.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r._id} className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="font-medium text-sm">{r.patientId?.userId?.name} · ⭐ {r.rating}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{r.review}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

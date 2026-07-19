// Calendar.jsx
// Month-view calendar for picking an appointment date, instead of just
// choosing a weekday name. Each day is colored:
//   - green  = doctor has slots that weekday, at least one still free
//   - gray   = doctor has no availability that weekday at all
//   - red    = doctor has slots that weekday, but every one is booked
//
// The actual grid math (which weekday the 1st falls on, etc.) lives in
// dateUtils.js and is unit tested separately from this component.

import React, { useState, useMemo } from "react";
import { getMonthGrid, DAY_NAMES } from "../utils/dateUtils";

const WEEKDAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function Calendar({ availability, bookedSlots, selectedDate, onSelectDate }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const grid = useMemo(() => getMonthGrid(viewYear, viewMonth), [viewYear, viewMonth]);

  function getDayStatus(cell) {
    const daySlots = availability.find((a) => a.day === cell.dayOfWeek);
    if (!daySlots || daySlots.times.length === 0) return "unavailable";

    const bookedTimesForDate = bookedSlots
      .filter((b) => b.date === cell.dateStr)
      .map((b) => b.time);

    const allBooked = daySlots.times.every((t) => bookedTimesForDate.includes(t));
    return allBooked ? "booked" : "available";
  }

  function goToPrevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  }

  function goToNextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  }

  const statusStyles = {
    available: "bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer dark:bg-green-900/30 dark:text-green-300",
    unavailable: "bg-gray-50 text-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600",
    booked: "bg-red-50 text-red-400 cursor-not-allowed line-through dark:bg-red-900/20 dark:text-red-400",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={goToPrevMonth} className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700">‹</button>
        <p className="font-semibold">{MONTH_NAMES[viewMonth]} {viewYear}</p>
        <button onClick={goToNextMonth} className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700">›</button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs text-center text-gray-400 mb-1">
        {WEEKDAY_HEADERS.map((d) => <div key={d}>{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {grid.map((cell, i) => {
          if (!cell) return <div key={`blank-${i}`} />;

          const status = cell.isPast ? "unavailable" : getDayStatus(cell);
          const isSelected = selectedDate === cell.dateStr;
          const clickable = status === "available" && !cell.isPast;

          return (
            <button
              key={cell.dateStr}
              disabled={!clickable}
              onClick={() => clickable && onSelectDate(cell.dateStr, cell.dayOfWeek)}
              className={`aspect-square rounded-md text-sm ${statusStyles[status]} ${
                isSelected ? "ring-2 ring-primary" : ""
              }`}
            >
              {cell.date.getDate()}
            </button>
          );
        })}
      </div>

      <div className="flex gap-4 mt-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-100 inline-block" /> Available</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-gray-100 inline-block" /> Unavailable</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-100 inline-block" /> Booked</span>
      </div>
    </div>
  );
}

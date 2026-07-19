// generateSlots.js
// Pure helper function: given a start time, end time, and interval in
// minutes, returns a list of appointment slot times.
// e.g. generateSlots("10:00 AM", "12:00 PM", 30) ->
//   ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"]
//
// Kept as a plain function with no dependencies so it's easy to unit
// test on its own (see the test block at the bottom).

function to24Hour(timeStr) {
  const [time, period] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes; // total minutes since midnight
}

function to12Hour(totalMinutes) {
  let hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const minuteStr = minutes.toString().padStart(2, "0");
  return `${hours}:${minuteStr} ${period}`;
}

function generateSlots(startTime, endTime, intervalMinutes = 30) {
  const start = to24Hour(startTime);
  const end = to24Hour(endTime);
  const slots = [];
  for (let t = start; t < end; t += intervalMinutes) {
    slots.push(to12Hour(t));
  }
  return slots;
}

module.exports = { generateSlots, to24Hour, to12Hour };

// ---- quick manual test (run: node server/utils/generateSlots.js) ----
if (require.main === module) {
  const result = generateSlots("10:00 AM", "12:00 PM", 30);
  console.log(result);
  console.assert(result.length === 4, "Expected 4 slots");
  console.assert(result[0] === "10:00 AM", "First slot should be 10:00 AM");
  console.assert(result[3] === "11:30 AM", "Last slot should be 11:30 AM");
  console.log("All assertions passed.");
}

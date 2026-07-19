// dateUtils.js
// Pure date-math helpers for the booking calendar - kept dependency-free
// (no date-fns/moment) and separate from the Calendar component so this
// logic can be unit tested on its own (see the test block at the bottom).

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function formatDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Returns a flat array of day cells for a calendar grid of the given
// month, including the leading blank days needed to align the 1st onto
// the correct weekday column (like a real calendar UI).
function getMonthGrid(year, month) {
  // month is 0-indexed (0 = January), matching JS Date's convention
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = firstDay.getDay(); // 0 = Sunday

  const cells = [];
  for (let i = 0; i < startWeekday; i++) {
    cells.push(null); // blank leading cell
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    cells.push({
      date,
      dateStr: formatDateStr(date),
      dayOfWeek: DAY_NAMES[date.getDay()],
      isPast: formatDateStr(date) < formatDateStr(new Date()),
    });
  }
  return cells;
}

export { formatDateStr, getMonthGrid, DAY_NAMES };

// ---- quick manual test (run: node client/src/utils/dateUtils.js) ----
// import.meta.url check below lets this run standalone for testing,
// the same way `if (require.main === module)` works in CommonJS.
if (import.meta.url === `file://${process.argv[1]}`) {
  // July 2026: July 1, 2026 is a Wednesday
  const grid = getMonthGrid(2026, 6); // month 6 = July (0-indexed)

  console.assert(grid.length === 3 + 31, `Expected 34 cells (3 blank + 31 days), got ${grid.length}`);
  console.assert(grid[0] === null, "First 3 cells should be blank (Sun, Mon, Tue)");
  console.assert(grid[3].dateStr === "2026-07-01", `Expected first real day to be 2026-07-01, got ${grid[3].dateStr}`);
  console.assert(grid[3].dayOfWeek === "Wednesday", `July 1 2026 should be a Wednesday, got ${grid[3].dayOfWeek}`);

  const lastCell = grid[grid.length - 1];
  console.assert(lastCell.dateStr === "2026-07-31", `Expected last day to be 2026-07-31, got ${lastCell.dateStr}`);

  console.log("All dateUtils assertions passed.");
  console.log(`July 2026 grid: ${grid.length} cells, starts on ${grid[3].dayOfWeek}, ends ${lastCell.dateStr}`);
}

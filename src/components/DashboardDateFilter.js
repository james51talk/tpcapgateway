import { useState } from "react";
import { getWeeksInMonth } from "@/lib/metrics";
import { CalendarIcon } from "@/components/Icons";

export default function DashboardDateFilter({ onFilterChange, initialFilterType = "week" }) {
  const [filterType, setFilterType] = useState(initialFilterType);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();
  const weeks = getWeeksInMonth(currentYear, currentMonth);
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handleMonthChange = (e) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(parseInt(e.target.value));
    setSelectedDate(newDate);
    setSelectedWeek(null);
  };

  const handleYearChange = (e) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(parseInt(e.target.value));
    setSelectedDate(newDate);
    setSelectedWeek(null);
  };

  const handleFilterTypeChange = (type) => {
    setFilterType(type);
    setSelectedWeek(null);
  };

  const applyFilter = () => {
    if (filterType === "month") {
      onFilterChange({ filterType: "month", filterDate: selectedDate });
    } else if (selectedWeek !== null) {
      onFilterChange({ filterType: "week", filterDate: weeks[selectedWeek].start });
    }
    setIsOpen(false);
  };

  const currentWeekLabel = selectedWeek !== null ? weeks[selectedWeek].label : "Select week";
  const currentMonthLabel = `${monthNames[currentMonth]} ${currentYear}`;

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-blue-50 to-yellow-50/40 border border-blue-200/60 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-50 transition-all"
      >
        <CalendarIcon className="h-4 w-4" />
        <span>{filterType === "month" ? currentMonthLabel : currentWeekLabel}</span>
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl border border-blue-200/60 shadow-lg backdrop-blur-sm p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Filter Type Buttons */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => handleFilterTypeChange("week")}
              className={`flex-1 px-2 py-1.5 rounded-lg font-medium text-xs transition-all ${
                filterType === "week"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => handleFilterTypeChange("month")}
              className={`flex-1 px-2 py-1.5 rounded-lg font-medium text-xs transition-all ${
                filterType === "month"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
              }`}
            >
              Monthly
            </button>
          </div>

          {/* Month and Year Selectors */}
          <div className="flex gap-2 mb-3">
            <select
              value={currentMonth}
              onChange={handleMonthChange}
              className="flex-1 px-2 py-1.5 rounded-lg border border-blue-200 bg-white text-slate-700 font-medium text-xs focus:outline-none focus:border-blue-400"
            >
              {monthNames.map((month, idx) => (
                <option key={idx} value={idx}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={currentYear}
              onChange={handleYearChange}
              className="w-20 px-2 py-1.5 rounded-lg border border-blue-200 bg-white text-slate-700 font-medium text-xs focus:outline-none focus:border-blue-400"
            >
              {[2024, 2025, 2026, 2027].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Week Selector */}
          {filterType === "week" && (
            <div className="mb-3">
              <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto">
                {weeks.map((week, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedWeek(idx)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium text-left transition-all ${
                      selectedWeek === idx
                        ? "bg-blue-600 text-white"
                        : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                    }`}
                  >
                    {week.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Apply Button */}
          <button
            onClick={applyFilter}
            disabled={filterType === "week" && selectedWeek === null}
            className="w-full px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-xs rounded-lg hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import {
  DateRange,
  DatePresetKey,
  getDateRangeForPreset,
  formatRangeLabel,
} from "@/lib/date-filter";

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const MONTH_NAMES_FR = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const WEEKDAY_NAMES_FR = ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"];

const pad = (n: number) => String(n).padStart(2, "0");
const toYMD = (year: number, month: number, day: number) =>
  `${year}-${pad(month + 1)}-${pad(day)}`;

function getCalendarDays(year: number, month: number) {
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days: { day: number; isCurrentMonth: boolean; dateStr: string }[] = [];

  // Previous month padding
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const prevM = month === 0 ? 11 : month - 1;
    const prevY = month === 0 ? year - 1 : year;
    days.push({
      day: d,
      isCurrentMonth: false,
      dateStr: toYMD(prevY, prevM, d),
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({
      day: d,
      isCurrentMonth: true,
      dateStr: toYMD(year, month, d),
    });
  }

  // Next month padding to fill grid (up to 35 or 42 cells)
  const totalCells = days.length > 35 ? 42 : 35;
  const remaining = totalCells - days.length;
  for (let d = 1; d <= remaining; d++) {
    const nextM = month === 11 ? 0 : month + 1;
    const nextY = month === 11 ? year + 1 : year;
    days.push({
      day: d,
      isCurrentMonth: false,
      dateStr: toYMD(nextY, nextM, d),
    });
  }

  return days;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize calendar view month/year based on value or current date
  const initialDate = useMemo(() => {
    if (value.startDate) {
      const d = new Date(value.startDate);
      if (!isNaN(d.getTime())) return d;
    }
    return new Date();
  }, [value.startDate]);

  // Calendar month navigation state: Left month (Right month is leftMonth + 1)
  const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth());

  // Interactive selection state
  const [tempStart, setTempStart] = useState<string | null>(value.startDate || null);
  const [tempEnd, setTempEnd] = useState<string | null>(value.endDate || null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [activePresetKey, setActivePresetKey] = useState<DatePresetKey | "custom">(value.key);

  // Synchronize internal selection whenever popover opens or prop changes
  useEffect(() => {
    if (isOpen) {
      setTempStart(value.startDate || null);
      setTempEnd(value.endDate || null);
      setActivePresetKey(value.key);
      if (value.startDate) {
        const d = new Date(value.startDate);
        if (!isNaN(d.getTime())) {
          setViewYear(d.getFullYear());
          setViewMonth(d.getMonth());
        }
      }
    }
  }, [isOpen, value]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Right calendar month calculation
  const rightMonth = (viewMonth + 1) % 12;
  const rightYear = viewMonth === 11 ? viewYear + 1 : viewYear;

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Helper to format date into YYYY-MM-DD

  const leftMonthDays = useMemo(() => getCalendarDays(viewYear, viewMonth), [viewYear, viewMonth]);
  const rightMonthDays = useMemo(() => getCalendarDays(rightYear, rightMonth), [rightYear, rightMonth]);

  // Click on a date cell
  const handleDateClick = (dateStr: string) => {
    setActivePresetKey("custom");

    // Case 1: No start date or both start & end already chosen -> pick new start
    if (!tempStart || (tempStart && tempEnd)) {
      setTempStart(dateStr);
      setTempEnd(null);
      return;
    }

    // Case 2: Start exists, choosing end date
    if (tempStart && !tempEnd) {
      if (dateStr < tempStart) {
        setTempEnd(tempStart);
        setTempStart(dateStr);
      } else {
        setTempEnd(dateStr);
      }
    }
  };

  // Presets list
  const presets: { key: DatePresetKey; label: string }[] = [
    { key: "this_month", label: "Ce mois-ci" },
    { key: "last_30_days", label: "30 derniers jours" },
    { key: "last_month", label: "Mois dernier" },
    { key: "this_quarter", label: "Ce trimestre" },
    { key: "this_year", label: "Cette année" },
    { key: "last_year", label: "Année dernière" },
    { key: "last_12_months", label: "12 derniers mois" },
    { key: "today", label: "Aujourd'hui" },
    { key: "all", label: "Toutes les dates" },
  ];

  const handleSelectPreset = (key: DatePresetKey) => {
    const range = getDateRangeForPreset(key);
    setActivePresetKey(key);
    setTempStart(range.startDate || null);
    setTempEnd(range.endDate || null);

    if (range.startDate) {
      const d = new Date(range.startDate);
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  };

  // Apply button handler
  const handleApply = () => {
    if (activePresetKey !== "custom" && activePresetKey !== "all") {
      const range = getDateRangeForPreset(activePresetKey as DatePresetKey);
      onChange(range);
      setIsOpen(false);
      return;
    }

    if (activePresetKey === "all" || (!tempStart && !tempEnd)) {
      onChange(getDateRangeForPreset("all"));
      setIsOpen(false);
      return;
    }

    const s = tempStart || tempEnd!;
    const e = tempEnd || tempStart!;
    const startYMD = s <= e ? s : e;
    const endYMD = s <= e ? e : s;

    onChange({
      key: "custom",
      label: formatRangeLabel(startYMD, endYMD),
      startDate: startYMD,
      endDate: endYMD,
    });
    setIsOpen(false);
  };

  const handleReset = () => {
    onChange(getDateRangeForPreset("all"));
    setIsOpen(false);
  };

  // Determine selection range status for any given date cell
  const getCellStatus = (dateStr: string) => {
    const start = tempStart;
    const end = tempEnd || (tempStart && !tempEnd && hoveredDate ? hoveredDate : null);

    const actualStart = start && end && start > end ? end : start;
    const actualEnd = start && end && start > end ? start : end;

    const isStart = actualStart === dateStr;
    const isEnd = actualEnd === dateStr;
    const isOnly = isStart && isEnd;
    const isInRange = actualStart && actualEnd && dateStr > actualStart && dateStr < actualEnd;

    const todayStr = new Date().toISOString().slice(0, 10);
    const isToday = dateStr === todayStr;

    return { isStart, isEnd, isOnly, isInRange, isToday };
  };

  // Days count preview
  const daysDiffText = useMemo(() => {
    if (!tempStart) return "";
    const s = tempStart;
    const e = tempEnd || hoveredDate;
    if (!e) return "1 jour";
    const d1 = new Date(s).getTime();
    const d2 = new Date(e).getTime();
    const diff = Math.abs(Math.round((d2 - d1) / (1000 * 60 * 60 * 24))) + 1;
    return `${diff} jour${diff > 1 ? "s" : ""}`;
  }, [tempStart, tempEnd, hoveredDate]);

  // Render a month calendar table
  const renderMonthCalendar = (
    year: number,
    month: number,
    days: { day: number; isCurrentMonth: boolean; dateStr: string }[],
    showPrevArrow: boolean,
    showNextArrow: boolean
  ) => {
    return (
      <div className="w-full sm:w-[270px]">
        {/* Month Header with optional Prev / Next Chevrons */}
        <div className="flex items-center justify-between h-9 px-1 mb-2">
          {showPrevArrow ? (
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Mois précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-7 h-7" />
          )}

          <div className="text-xs font-bold text-slate-900 dark:text-white font-sans">
            {MONTH_NAMES_FR[month]} {year}
          </div>

          {showNextArrow ? (
            <button
              type="button"
              onClick={handleNextMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Mois suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-7 h-7" />
          )}
        </div>

        {/* Weekdays Row */}
        <div className="grid grid-cols-7 mb-1 text-center">
          {WEEKDAY_NAMES_FR.map((wd) => (
            <div
              key={wd}
              className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 py-1"
            >
              {wd}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div
          className="grid grid-cols-7 gap-y-1 text-center"
          onMouseLeave={() => setHoveredDate(null)}
        >
          {days.map((item, idx) => {
            const { isStart, isEnd, isOnly, isInRange, isToday } = getCellStatus(item.dateStr);

            let cellClass =
              "h-8 text-xs font-semibold flex items-center justify-center transition-colors relative cursor-pointer select-none";

            // Out-of-month styling
            if (!item.isCurrentMonth) {
              cellClass += " text-slate-300 dark:text-slate-600";
            } else {
              cellClass += " text-slate-700 dark:text-slate-200";
            }

            // In-range background
            if (isInRange) {
              cellClass += " bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-white rounded-none";
            } else if (isStart && !isOnly) {
              cellClass +=
                " bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold rounded-l-xl shadow-2xs z-10";
            } else if (isEnd && !isOnly) {
              cellClass +=
                " bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold rounded-r-xl shadow-2xs z-10";
            } else if (isOnly || (isStart && !tempEnd)) {
              cellClass +=
                " bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold rounded-xl shadow-2xs z-10";
            } else {
              cellClass += " hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg";
            }

            return (
              <button
                key={`${item.dateStr}-${idx}`}
                type="button"
                onClick={() => handleDateClick(item.dateStr)}
                onMouseEnter={() => {
                  if (tempStart && !tempEnd) {
                    setHoveredDate(item.dateStr);
                  }
                }}
                className={cellClass}
              >
                <span>{item.day}</span>
                {isToday && !isStart && !isEnd && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-slate-900 dark:bg-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* Trigger Button on Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 px-3.5 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xs flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
      >
        <CalendarIcon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
        <span className="truncate max-w-[200px]">{value.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-slate-900 dark:text-white" : ""
          }`}
        />
      </button>

      {/* Floating Dual-Month Calendar Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-4 sm:p-5 w-[95vw] max-w-[760px] animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="flex flex-col md:flex-row gap-5">
            {/* Left Sidebar: Quick Presets */}
            <div className="w-full md:w-44 shrink-0 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-3 md:pb-0 md:pr-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                Périodes Prédéfinies
              </div>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-1">
                {presets.map((preset) => {
                  const isSelected = activePresetKey === preset.key;
                  return (
                    <button
                      key={preset.key}
                      type="button"
                      onClick={() => handleSelectPreset(preset.key)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        isSelected
                          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold shadow-2xs"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <span className="truncate">{preset.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Dual-Month Calendar View */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
                {/* Month 1: Left */}
                {renderMonthCalendar(viewYear, viewMonth, leftMonthDays, true, false)}

                {/* Vertical separator on desktop */}
                <div className="hidden sm:block w-px self-stretch bg-slate-100 dark:bg-slate-800 my-1" />

                {/* Month 2: Right */}
                {renderMonthCalendar(rightYear, rightMonth, rightMonthDays, false, true)}
              </div>
            </div>
          </div>

          {/* Footer Bar: Range status + Actions */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-900 dark:text-white">
                {tempStart ? (
                  <>
                    Du {formatRangeLabel(tempStart, tempEnd || tempStart)}
                    {daysDiffText && (
                      <span className="ml-1.5 font-normal text-[11px] text-slate-400">
                        ({daysDiffText})
                      </span>
                    )}
                  </>
                ) : (
                  "Sélectionnez une date de début et de fin sur le calendrier"
                )}
              </span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors flex items-center gap-1.5 text-xs"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Tout réinitialiser</span>
              </button>

              <button
                type="button"
                onClick={handleApply}
                className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold shadow-xs hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-1.5 text-xs cursor-pointer"
              >
                <span>Appliquer</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

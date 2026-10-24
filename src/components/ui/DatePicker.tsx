"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
} from "lucide-react";

interface DatePickerProps {
  value: string; // Format: YYYY-MM-DD
  onChange: (date: string) => void;
  label?: string;
  placeholder?: string;
  minDate?: string;
  className?: string;
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

const DAY_NAMES_FR = ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"];

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = "Sélectionner une date",
  className = "",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current value or fallback to today
  const parsedDate = value ? new Date(value + "T00:00:00") : new Date();
  const validParsed = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

  // View state for navigating months inside the calendar
  const [viewYear, setViewYear] = useState<number>(validParsed.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(validParsed.getMonth());

  // Keep view year/month in sync when value changes externally
  useEffect(() => {
    if (value) {
      const d = new Date(value + "T00:00:00");
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [value]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
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

  // Format display text
  const formatDisplay = (dateStr: string) => {
    if (!dateStr) return placeholder;
    const d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate();
    const month = MONTH_NAMES_FR[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Month navigation
  const prevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Generate days grid (Sunday to Saturday)
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  interface DayCell {
    dayNumber: number;
    monthOffset: number; // -1 = prev month, 0 = current, 1 = next
    dateString: string;
    isCurrentMonth: boolean;
    isSelected: boolean;
    isToday: boolean;
  }

  const cells: DayCell[] = [];

  // 1. Days from previous month
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const m = viewMonth === 0 ? 12 : viewMonth;
    const y = viewMonth === 0 ? viewYear - 1 : viewYear;
    const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({
      dayNumber: d,
      monthOffset: -1,
      dateString: dateStr,
      isCurrentMonth: false,
      isSelected: dateStr === value,
      isToday: dateStr === todayStr,
    });
  }

  // 2. Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({
      dayNumber: d,
      monthOffset: 0,
      dateString: dateStr,
      isCurrentMonth: true,
      isSelected: dateStr === value,
      isToday: dateStr === todayStr,
    });
  }

  // 3. Days from next month to fill complete grid (multiples of 7, up to 35 or 42)
  const remaining = (7 - (cells.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const m = viewMonth === 11 ? 1 : viewMonth + 2;
    const y = viewMonth === 11 ? viewYear + 1 : viewYear;
    const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({
      dayNumber: d,
      monthOffset: 1,
      dateString: dateStr,
      isCurrentMonth: false,
      isSelected: dateStr === value,
      isToday: dateStr === todayStr,
    });
  }

  const handleSelect = (dateStr: string) => {
    onChange(dateStr);
    setIsOpen(false);
  };

  const handleSelectToday = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(todayStr);
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}

      {/* Trigger Button - Designed directly after Image 1 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`w-full h-10 px-3.5 flex items-center justify-between text-xs bg-white dark:bg-slate-800 border rounded-xl transition-all duration-200 outline-none ${
          isOpen
            ? "border-slate-900 ring-2 ring-slate-900/15 dark:border-white dark:ring-white/20"
            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <CalendarIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
          <span
            className={`truncate font-medium ${
              value
                ? "text-slate-900 dark:text-white font-semibold"
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {formatDisplay(value)}
          </span>
        </div>
        <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 ml-2" />
      </button>

      {/* Floating Calendar Card - Exact Replica of Image 1 */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 z-50 w-72 bg-white dark:bg-[#12141A] rounded-2xl border border-slate-900/80 dark:border-slate-700 shadow-2xl p-4 animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Calendar Header with Navigation */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={prevMonth}
              aria-label="Mois précédent"
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              {MONTH_NAMES_FR[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              onClick={nextMonth}
              aria-label="Mois suivant"
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week Row */}
          <div className="grid grid-cols-7 gap-1 pt-3 pb-1 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {DAY_NAMES_FR.map((name) => (
              <div key={name} className="py-1">
                {name}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {cells.map((cell) => {
              return (
                <button
                  key={cell.dateString}
                  type="button"
                  onClick={() => handleSelect(cell.dateString)}
                  className={`h-8 w-8 mx-auto text-xs font-semibold rounded-xl flex flex-col items-center justify-center relative transition-all duration-150 active:scale-90 ${
                    cell.isSelected
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md font-bold"
                      : cell.isCurrentMonth
                      ? "text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                      : "text-slate-300 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <span>{cell.dayNumber}</span>
                  {/* Today dot indicator */}
                  {cell.isToday && !cell.isSelected && (
                    <span className="w-1 h-1 rounded-full bg-slate-900 dark:bg-white absolute bottom-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Shortcuts Footer */}
          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={handleSelectToday}
              className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Aujourd&apos;hui
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

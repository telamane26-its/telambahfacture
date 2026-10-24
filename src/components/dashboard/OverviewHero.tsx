"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Download,
  Calendar,
  ChevronDown,
  Building2,
} from "lucide-react";
import { useData } from "@/lib/data-context";
import { DateRangePicker } from "./DateRangePicker";
import { DateRange } from "@/lib/date-filter";

interface OverviewHeroProps {
  onNewInvoice: () => void;
  onExportCsv: () => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function OverviewHero({
  onNewInvoice,
  onExportCsv,
  dateRange,
  onDateRangeChange,
}: OverviewHeroProps) {
  const { currentUser } = useData();

  const firstName = currentUser.name ? currentUser.name.split(" ")[0] : "Entrepreneur";

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-700/60">
      {/* Left: Greeting and Enterprise Context */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
            Bonjour, {firstName} 👋
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 hover:scale-105 transition-transform duration-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Exercice 2026
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold group cursor-pointer hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-brand-500 transition-colors" />
            <span>{currentUser.companyName}</span>
          </div>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span>{currentUser.city}, {currentUser.country}</span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span className="text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-1.5 py-0.5 rounded font-mono text-[10px] transition-colors">
            {currentUser.currency} (FCFA)
          </span>
        </div>
      </div>

      {/* Right: Period selector + Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Rich Date Range Picker */}
        <DateRangePicker value={dateRange} onChange={onDateRangeChange} />

        {/* CSV Export Button */}
        <button
          type="button"
          onClick={onExportCsv}
          className="group h-10 px-3.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 border border-slate-200/90 dark:border-slate-700 rounded-xl shadow-2xs flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 active:scale-95"
          title="Exporter la liste des factures en CSV pour Excel"
        >
          <Download className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-y-0.5 transition-all duration-200" />
          <span className="hidden sm:inline">Exporter</span>
        </button>

        {/* Primary CTA: + Nouvelle facture */}
        <Link
          href="/invoices/new"
          onClick={() => {
            window.location.href = "/invoices/new";
          }}
          className="group h-10 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 rounded-xl shadow-sm flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
          <span>Nouvelle facture</span>
        </Link>
      </div>
    </div>
  );
}

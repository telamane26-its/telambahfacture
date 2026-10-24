"use client";

import React, { useState, useMemo } from "react";
import { formatFCFA } from "@/lib/utils";
import { useData } from "@/lib/data-context";

export function CashflowChart() {
  const { invoices } = useData();
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  // Generate 6 recent months dynamically based on real invoices
  const monthlyData = useMemo(() => {
    const list = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yearMonth = d.toISOString().slice(0, 7); // "YYYY-MM"
      const monthLabel = d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });

      const monthInvoices = invoices.filter((inv) => (inv.issueDate || "").startsWith(yearMonth));
      const invoiced = monthInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
      const collected = monthInvoices
        .filter((inv) => inv.status === "paid")
        .reduce((sum, inv) => sum + (inv.total || 0), 0);

      list.push({
        month: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
        invoiced,
        collected,
      });
    }

    return list;
  }, [invoices]);

  const maxAmount = useMemo(() => {
    const maxVal = Math.max(
      ...monthlyData.map((m) => Math.max(m.invoiced, m.collected)),
      0
    );
    return maxVal > 0 ? maxVal : 1000000; // sensible scale
  }, [monthlyData]);

  const totalInvoicedAll = invoices.reduce((s, i) => s + (i.total || 0), 0);
  const totalCollectedAll = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + (i.total || 0), 0);
  const recoveryRate =
    totalInvoicedAll > 0 ? Math.round((totalCollectedAll / totalInvoicedAll) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/60 p-5 shadow-card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-sans">
              Facturé vs Encaissé
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
              6 derniers mois
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Comparatif de votre chiffre d&apos;affaires facturé et des règlements perçus
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-white" />
            <span className="text-slate-600 dark:text-slate-300">Facturé</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300">Encaissé</span>
          </div>
        </div>
      </div>

      {/* Visual Chart Bars */}
      <div className="pt-6 pb-2">
        <div className="h-44 flex items-end gap-2 sm:gap-6 justify-between border-b border-slate-100 dark:border-slate-700/60 px-2 sm:px-6 relative">
          {monthlyData.map((item, index) => {
            const hasData = item.invoiced > 0 || item.collected > 0;
            const invoicedHeight = hasData
              ? Math.max(Math.round((item.invoiced / maxAmount) * 100), 4)
              : 2;
            const collectedHeight = hasData
              ? Math.max(Math.round((item.collected / maxAmount) * 100), 4)
              : 2;
            const isHovered = hoveredMonth === index;

            return (
              <div
                key={item.month}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                onMouseEnter={() => setHoveredMonth(index)}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-16 z-20 bg-slate-900 dark:bg-slate-700 text-white text-[10px] py-1.5 px-2.5 rounded-xl shadow-xl pointer-events-none whitespace-nowrap animate-in fade-in-50 zoom-in-95 duration-150">
                    <p className="font-bold border-b border-slate-700 dark:border-slate-600 pb-1 mb-1">
                      {item.month}
                    </p>
                    <p className="text-slate-300">
                      Facturé: {formatFCFA(item.invoiced)}
                    </p>
                    <p className="text-emerald-300">
                      Encaissé: {formatFCFA(item.collected)}
                    </p>
                  </div>
                )}

                {/* Bars container */}
                <div className="w-full flex items-end justify-center gap-1.5 h-full pb-1">
                  {/* Invoiced Bar */}
                  <div
                    className={`w-3 sm:w-4 rounded-t-md transition-all duration-300 ${
                      isHovered
                        ? "bg-slate-800 dark:bg-white scale-y-105"
                        : "bg-slate-700/80 dark:bg-slate-300/80"
                    }`}
                    style={{ height: `${invoicedHeight}%` }}
                  />
                  {/* Collected Bar */}
                  <div
                    className={`w-3 sm:w-4 rounded-t-md transition-all duration-300 ${
                      isHovered
                        ? "bg-emerald-600 scale-y-105"
                        : "bg-emerald-500/80"
                    }`}
                    style={{ height: `${collectedHeight}%` }}
                  />
                </div>

                {/* X-axis label */}
                <span
                  className={`text-[10px] mt-2 font-medium truncate ${
                    isHovered
                      ? "text-slate-900 dark:text-white font-bold"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Footer breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/60">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total facturé</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 tabular-nums">
            {formatFCFA(totalInvoicedAll)}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/60">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Taux de recouvrement</p>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {recoveryRate}% ({formatFCFA(totalCollectedAll)})
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/60">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Règlement direct</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            TMoney, Flooz & Wave
          </p>
        </div>
      </div>
    </div>
  );
}

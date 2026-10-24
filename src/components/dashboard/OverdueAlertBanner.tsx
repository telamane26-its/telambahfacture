"use client";

import React from "react";
import { AlertCircle, MessageSquare } from "lucide-react";
import { formatFCFA } from "@/lib/utils";
import { Invoice } from "@/types";

interface OverdueAlertBannerProps {
  overdueInvoices: Invoice[];
  onRelance: (invoice: Invoice) => void;
}

export function OverdueAlertBanner({
  overdueInvoices,
  onRelance,
}: OverdueAlertBannerProps) {
  if (overdueInvoices.length === 0) return null;

  const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="bg-gradient-to-r from-rose-50 via-rose-50/70 to-amber-50/40 dark:from-rose-950/40 dark:via-rose-900/20 dark:to-amber-950/10 border border-rose-200/90 dark:border-rose-800/50 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-card transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-rose-500/25 hover:rotate-6 hover:scale-110 transition-transform duration-200">
            <AlertCircle className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-rose-950 dark:text-rose-300 font-sans">
                {overdueInvoices.length} factures en retard de paiement
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50 hover:scale-105 transition-transform">
                Action immédiate
              </span>
            </div>

            <p className="text-xs text-rose-800/80 dark:text-rose-400/80 mt-0.5">
              Montant total en souffrance :{" "}
              <strong className="text-rose-900 dark:text-rose-300 font-extrabold tabular-nums">
                {formatFCFA(totalOverdue)}
              </strong>
              . Relancez vos clients en 1 clic via WhatsApp.
            </p>
          </div>
        </div>

        {/* Action pills */}
        <div className="flex flex-wrap items-center gap-2">
          {overdueInvoices.slice(0, 2).map((inv) => (
            <button
              key={inv.id}
              onClick={() => onRelance(inv)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-rose-100/60 dark:hover:bg-rose-900/30 border border-rose-200 dark:border-rose-800/60 hover:border-rose-300 dark:hover:border-rose-700 text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5 shadow-2xs hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 active:scale-95 transition-all duration-200"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 hover:scale-110 transition-transform" />
              <span>Relancer {inv.client.name.split(" ")[0]}</span>
              <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400">
                ({formatFCFA(inv.total)})
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

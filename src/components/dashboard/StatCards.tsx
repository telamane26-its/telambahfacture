"use client";

import React from "react";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { formatFCFA } from "@/lib/utils";
import { KpiSummary } from "@/types";

interface StatCardsProps {
  stats: KpiSummary;
  onFilterStatus?: (status: string) => void;
}

export function StatCards({ stats, onFilterStatus }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Facturé */}
      <div
        onClick={() => onFilterStatus?.("all")}
        className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/60 p-5 shadow-card hover:shadow-dropdown hover:-translate-y-1.5 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
              Total Facturé
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-200 group-hover:scale-115 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-all duration-300 shadow-2xs">
              <FileText className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight tabular-nums transition-colors">
              {formatFCFA(stats.totalInvoiced)}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {stats.invoicesCount} factures émises ce mois
            </p>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
          <div className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md text-[11px] group-hover:scale-105 transition-transform">
            <TrendingUp className="w-3 h-3" />
            <span>+{stats.growthPercent}%</span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">vs mois dernier</span>
        </div>
      </div>

      {/* 2. Montant Encaissé */}
      <div
        onClick={() => onFilterStatus?.("paid")}
        className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/60 p-5 shadow-card hover:shadow-dropdown hover:-translate-y-1.5 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
              Montant Encaissé
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-115 group-hover:rotate-6 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-all duration-300 shadow-2xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 tracking-tight tabular-nums group-hover:scale-[1.01] transition-transform origin-left">
              {formatFCFA(stats.totalCollected)}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full group-hover:bg-emerald-600 transition-colors"
                  style={{ width: `${stats.collectedPercent}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                {stats.collectedPercent}%
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Wave (60%) · Orange Money (40%)
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFilterStatus?.("paid");
            }}
            className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-0.5 hover:translate-x-1 transition-transform"
          >
            <span>Voir</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 3. En Attente de Paiement */}
      <div
        onClick={() => onFilterStatus?.("sent")}
        className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/60 p-5 shadow-card hover:shadow-dropdown hover:-translate-y-1.5 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
              En Attente
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-115 group-hover:rotate-6 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/40 transition-all duration-300 shadow-2xs">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight tabular-nums group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
              {formatFCFA(stats.pendingAmount)}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {stats.pendingCount} factures envoyées en cours
            </p>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Échéances dans les 30 jours
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFilterStatus?.("sent");
            }}
            className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 flex items-center gap-0.5 hover:translate-x-1 transition-transform"
          >
            <span>Détails</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 4. En Retard (Factures échues) */}
      <div
        onClick={() => onFilterStatus?.("overdue")}
        className="bg-gradient-to-br from-white via-white to-rose-50/50 dark:from-slate-800 dark:via-slate-800 dark:to-rose-900/10 rounded-2xl border border-rose-200/90 dark:border-rose-800/50 p-5 shadow-card hover:shadow-dropdown hover:-translate-y-1.5 hover:border-rose-400 dark:hover:border-rose-700 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              En Retard
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-100/90 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800/50 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-115 group-hover:rotate-6 group-hover:bg-rose-200 dark:group-hover:bg-rose-900/50 transition-all duration-300 shadow-2xs">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-rose-700 dark:text-rose-400 tracking-tight tabular-nums group-hover:scale-[1.01] transition-transform origin-left">
              {formatFCFA(stats.overdueAmount)}
            </div>
            <p className="text-[11px] text-rose-600/90 dark:text-rose-400/80 font-semibold">
              {stats.overdueCount} factures échues à relancer
            </p>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-rose-100 dark:border-rose-900/50 flex items-center justify-between text-xs">
          <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-400">
            Action requise
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFilterStatus?.("overdue");
            }}
            className="text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 hover:shadow-md hover:scale-105 active:scale-95 px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1 transition-all duration-200"
          >
            <span>Relancer</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

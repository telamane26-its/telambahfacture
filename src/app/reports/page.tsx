"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useData } from "@/lib/data-context";
import { formatFCFA } from "@/lib/utils";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { ReportsSkeleton } from "@/components/reports/ReportsSkeleton";

export default function ReportsPage() {
  const { invoices, isLoading } = useData();

  // Calculations
  const metrics = useMemo(() => {
    let totalInvoiced = 0;
    let totalPaid = 0;
    let totalPending = 0;
    let totalOverdue = 0;
    let totalVat = 0;

    invoices.forEach((inv) => {
      totalInvoiced += inv.total;
      totalVat += inv.taxAmount || Math.round((inv.subtotal - (inv.discountAmount || 0)) * 0.18);
      if (inv.status === "paid") {
        totalPaid += inv.total;
      } else if (inv.status === "overdue") {
        totalOverdue += inv.balanceDue || inv.total;
        totalPending += inv.balanceDue || inv.total;
      } else {
        totalPending += inv.balanceDue || inv.total;
      }
    });

    const recoveryRate = totalInvoiced > 0 ? Math.round((totalPaid / totalInvoiced) * 100) : 0;

    return {
      totalInvoiced,
      totalPaid,
      totalPending,
      totalOverdue,
      totalVat,
      recoveryRate,
    };
  }, [invoices]);

  const monthlyRevenue = useMemo(() => {
    const list = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

    for (let m = 0; m < 12; m++) {
      const monthPrefix = `${currentYear}-${String(m + 1).padStart(2, "0")}`;
      const monthInvoices = invoices.filter((inv) => (inv.issueDate || "").startsWith(monthPrefix));
      const invoiced = monthInvoices.reduce((s, i) => s + (i.total || 0), 0);
      const collected = monthInvoices
        .filter((i) => i.status === "paid")
        .reduce((s, i) => s + (i.total || 0), 0);
      list.push({
        month: monthNames[m],
        invoiced,
        collected,
      });
    }
    return list;
  }, [invoices]);

  const handleExportAccounting = () => {
    const headers = [
      "Journal",
      "Date",
      "Compte",
      "Libelle",
      "Debit_FCFA",
      "Credit_FCFA",
      "Piece_Ref",
    ];

    const rows: string[] = [];
    invoices.forEach((inv) => {
      // Client receivable: 411000
      rows.push(
        [
          "VT",
          inv.issueDate,
          "411000",
          `Client ${inv.client.name}`,
          inv.total,
          0,
          inv.number,
        ].join(";")
      );
      // Revenue: 706000
      rows.push(
        [
          "VT",
          inv.issueDate,
          "706000",
          `Prestation ${inv.number}`,
          0,
          inv.subtotal,
          inv.number,
        ].join(";")
      );
      // TVA Collectée 18%: 443100
      rows.push(
        [
          "VT",
          inv.issueDate,
          "443100",
          `TVA UEMOA 18% sur ${inv.number}`,
          0,
          inv.taxAmount,
          inv.number,
        ].join(";")
      );
    });

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(";"), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Grand_Livre_OHADA_Telambah_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0F1117] text-slate-900 dark:text-slate-100 flex">
        {/* 1. Desktop Sidebar */}
      <Sidebar currentPath="/reports" />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 pb-20 lg:pb-12">
        {/* Mobile Header */}
        <MobileHeader />

        {/* Workspace */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Breadcrumb */}
          <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Link
              href="/dashboard"
              className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              Accueil
            </Link>
            <span>›</span>
            <span className="text-slate-700 dark:text-slate-200 font-semibold">
              Trésorerie & Rapports
            </span>
          </div>

          {isLoading ? (
            <ReportsSkeleton />
          ) : (
            <>
              {/* Hero Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-700/60">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                  Rapports Financiers & Trésorerie
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                  Système OHADA
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Suivi du chiffre d&apos;affaires net, de la TVA 18% collectée et du taux de recouvrement client.
              </p>
            </div>

            {/* Export CTA */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportAccounting}
                className="group h-10 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-xl shadow-xs flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
              >
                <FileSpreadsheet className="w-4 h-4 stroke-[2.5]" />
                <span>Exporter Grand Livre OHADA</span>
              </button>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Total Encaissé
                </p>
                <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
                  {formatFCFA(metrics.totalPaid)}
                </p>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {metrics.recoveryRate}% de recouvrement
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  En Attente / Relances
                </p>
                <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
                  {formatFCFA(metrics.totalPending)}
                </p>
                <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 mt-0.5">
                  Reste à percevoir
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  TVA 18% Collectée
                </p>
                <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
                  {formatFCFA(metrics.totalVat)}
                </p>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  Déclaration DGI UEMOA
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Retards Critiques
                </p>
                <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
                  {formatFCFA(metrics.totalOverdue)}
                </p>
                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                  Nécessite relance WhatsApp
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Cashflow Monthly Overview Chart Card */}
          <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/60 shadow-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/60">
              <div>
                <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white">
                  Évolution de la Trésorerie (Exercice 2026)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Comparaison des montants facturés vs encaissements effectifs
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-slate-700 dark:bg-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300">Facturé (TTC)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-300">Encaissé</span>
                </div>
              </div>
            </div>

            {/* Visual Bars for 12 months */}
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 pt-4 items-end h-48">
              {monthlyRevenue.map((m) => {
                const max = Math.max(...monthlyRevenue.map((r) => Math.max(r.invoiced, r.collected)), 1000000);
                const invoicedHeight = Math.min(100, Math.round((m.invoiced / max) * 100));
                const paidHeight = Math.min(100, Math.round((m.collected / max) * 100));

                return (
                  <div key={m.month} className="flex flex-col items-center h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1 h-36">
                      <div
                        style={{ height: `${invoicedHeight}%` }}
                        className="w-2.5 sm:w-3.5 bg-slate-700 dark:bg-slate-400 rounded-t-md group-hover:bg-slate-900 dark:group-hover:bg-slate-200 transition-all"
                        title={`Facturé: ${formatFCFA(m.invoiced)}`}
                      />
                      <div
                        style={{ height: `${paidHeight}%` }}
                        className="w-2.5 sm:w-3.5 bg-emerald-500/80 dark:bg-emerald-500 rounded-t-md group-hover:bg-emerald-600 transition-all"
                        title={`Encaissé: ${formatFCFA(m.collected)}`}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-2">
                      {m.month.slice(0, 3)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Channels Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/60 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white">Wave Mobile Money</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                  58% des flux
                </span>
              </div>
              <p className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {formatFCFA(Math.round(metrics.totalPaid * 0.58))}
              </p>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: "58%" }} />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/60 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white">Orange Money</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
                  27% des flux
                </span>
              </div>
              <p className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {formatFCFA(Math.round(metrics.totalPaid * 0.27))}
              </p>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: "27%" }} />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/60 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white">Virements Bancaires</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  15% des flux
                </span>
              </div>
              <p className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {formatFCFA(Math.round(metrics.totalPaid * 0.15))}
              </p>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "15%" }} />
              </div>
            </div>
          </div>
          </>
          )}
        </main>
      </div>

      {/* 3. Mobile Navigation */}
      <MobileBottomNav currentPath="/reports" />
    </div>
    </AuthGuard>
  );
}

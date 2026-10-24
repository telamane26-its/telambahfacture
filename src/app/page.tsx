"use client";

import React, { useState, useMemo } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { OverviewHero } from "@/components/dashboard/OverviewHero";
import { StatCards } from "@/components/dashboard/StatCards";
import { OverdueAlertBanner } from "@/components/dashboard/OverdueAlertBanner";
import { CashflowChart } from "@/components/dashboard/CashflowChart";
import { RecentInvoicesTable } from "@/components/dashboard/RecentInvoicesTable";
import { NewInvoiceModal } from "@/components/dashboard/NewInvoiceModal";
import { InvoiceDetailsModal } from "@/components/dashboard/InvoiceDetailsModal";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Invoice, KpiSummary } from "@/types";
import { formatFCFA } from "@/lib/utils";
import { useData } from "@/lib/data-context";
import {
  DateRange,
  getDateRangeForPreset,
  isInvoiceInDateRange,
} from "@/lib/date-filter";
import { DashboardFullSkeleton } from "@/components/dashboard/DashboardSkeleton";

export default function DashboardPage() {
  const { invoices, addInvoice, changeInvoiceStatus, currentUser, isLoading } = useData();
  const [dateRange, setDateRange] = useState<DateRange>(() =>
    getDateRangeForPreset("this_month")
  );
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Filter invoices strictly according to the user-selected date range
  const periodInvoices = useMemo(
    () => invoices.filter((inv) => isInvoiceInDateRange(inv.issueDate, dateRange)),
    [invoices, dateRange]
  );

  // Compute live KPIs dynamically from filtered period invoices
  const dynamicKpiSummary = useMemo<KpiSummary>(() => {
    const totalInvoiced = periodInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const paidInvoices = periodInvoices.filter((inv) => inv.status === "paid");
    const totalCollected = paidInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const pendingInvoices = periodInvoices.filter((inv) => inv.status === "sent");
    const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const overdueInvoices = periodInvoices.filter((inv) => inv.status === "overdue");
    const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const collectedPercent =
      totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0;

    return {
      periodLabel: dateRange.label,
      totalInvoiced,
      invoicesCount: periodInvoices.length,
      growthPercent: 0,
      totalCollected,
      collectedPercent,
      pendingAmount,
      pendingCount: pendingInvoices.length,
      overdueAmount,
      overdueCount: overdueInvoices.length,
      currency: (currentUser.currency as "XOF" | "XAF") || "XOF",
    };
  }, [periodInvoices, dateRange.label, currentUser.currency]);

  // Overdue invoices for alert banner scoped to period
  const overdueInvoices = useMemo(
    () => periodInvoices.filter((inv) => inv.status === "overdue"),
    [periodInvoices]
  );

  // Filter callback from stat cards
  const handleFilterFromStats = (status: string) => {
    setActiveFilter(status);
    const tableEl = document.getElementById("factures-table");
    if (tableEl) {
      tableEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  // WhatsApp relance handler using actual user's info
  const handleRelance = (inv: Invoice) => {
    const paymentPhone =
      currentUser.paymentMethods?.wave?.phone ||
      currentUser.paymentMethods?.tmoney?.phone ||
      currentUser.phone ||
      "";

    const text = encodeURIComponent(
      `Bonjour ${inv.client.contactPerson || inv.client.name},\n\nNous vous informons que la facture ${inv.number} d'un montant de ${formatFCFA(
        inv.total
      )} est arrivée à échéance le ${inv.dueDate}.\n\nMerci de bien vouloir effectuer le règlement par TMoney, Flooz ou Wave${
        paymentPhone ? ` au numéro ${paymentPhone}` : ""
      }.\n\nCordialement,\n${currentUser.name} (${currentUser.companyName})`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  // CSV export handler
  const handleExportCsv = () => {
    const targetInvoices = periodInvoices.length > 0 ? periodInvoices : invoices;
    if (targetInvoices.length === 0) {
      alert("Aucune facture à exporter pour la période sélectionnée.");
      return;
    }

    const headers = [
      "Numéro",
      "Client",
      "Contact",
      "Date émission",
      "Date échéance",
      "Montant Total (FCFA)",
      "Montant Payé (FCFA)",
      "Reste dû (FCFA)",
      "Statut",
    ];

    const rows = targetInvoices.map((i) => [
      i.number,
      `"${i.client.name}"`,
      `"${i.client.contactPerson}"`,
      i.issueDate,
      i.dueDate,
      i.total,
      i.amountPaid,
      i.balanceDue,
      i.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `factures_telambah_${dateRange.key}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMarkAsPaid = (id: string) => {
    changeInvoiceStatus(id, "paid");
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0F1117] text-slate-900 dark:text-slate-100 flex">
        {/* 1. Desktop Sidebar */}
        <Sidebar currentPath="/dashboard" />

        {/* 2. Main Content Canvas */}
        <div className="flex-1 lg:pl-72 flex flex-col min-w-0 pb-20 lg:pb-12">
          {/* Mobile Header Bar */}
          <MobileHeader />

          {/* Dashboard Main Workspace */}
          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
            {/* Breadcrumb */}
            <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
              <span>Accueil</span>
              <span>›</span>
              <span className="text-slate-700 dark:text-slate-200 font-semibold">
                Tableau de bord
              </span>
            </div>

            {isLoading ? (
              <DashboardFullSkeleton />
            ) : (
              <>
                {/* Top Hero with greeting & quick actions */}
                <OverviewHero
                  onNewInvoice={() => setIsNewInvoiceOpen(true)}
                  onExportCsv={handleExportCsv}
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                />

                {/* Active Period Status Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Période active :</span>
                    <span className="font-bold text-slate-900 dark:text-white">{dateRange.label}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 dark:text-slate-400">
                      <strong className="text-slate-900 dark:text-white tabular-nums">{periodInvoices.length}</strong> facture{periodInvoices.length > 1 ? "s" : ""} trouvée{periodInvoices.length > 1 ? "s" : ""}
                    </span>
                    {dateRange.key !== "all" && (
                      <button
                        type="button"
                        onClick={() => setDateRange(getDateRangeForPreset("all"))}
                        className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
                      >
                        Voir tout l&apos;historique
                      </button>
                    )}
                  </div>
                </div>

                {/* 4 Stat KPI Cards */}
                <StatCards
                  stats={dynamicKpiSummary}
                  onFilterStatus={handleFilterFromStats}
                />

                {/* Overdue alert banner if there are unpaid overdue invoices */}
                <OverdueAlertBanner
                  overdueInvoices={overdueInvoices}
                  onRelance={handleRelance}
                />

                {/* Cashflow Chart (12 months overview) */}
                <CashflowChart />

                {/* Table of Latest Invoices */}
                <div id="factures-table">
                  <RecentInvoicesTable
                    invoices={periodInvoices}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    onSelectInvoice={(inv) => setSelectedInvoice(inv)}
                    onPayInvoice={(inv) => setSelectedInvoice(inv)}
                  />
                </div>
              </>
            )}
          </main>
        </div>

        {/* 3. Mobile Bottom Navigation */}
        <MobileBottomNav currentPath="/dashboard" />

        {/* 4. New Invoice Modal */}
        <NewInvoiceModal
          isOpen={isNewInvoiceOpen}
          onClose={() => setIsNewInvoiceOpen(false)}
          onInvoiceCreated={(newInv) => {
            addInvoice(newInv);
          }}
        />

        {/* 5. Invoice Details / Preview Modal */}
        <InvoiceDetailsModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onMarkAsPaid={handleMarkAsPaid}
        />
      </div>
    </AuthGuard>
  );
}

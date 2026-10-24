"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Download,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  FileQuestion,
  Eye,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useData } from "@/lib/data-context";
import { formatFCFA, formatDate } from "@/lib/utils";
import { InvoiceStatus } from "@/types";
import { generateInvoicePDF } from "@/lib/pdf-generator";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { InvoicesSkeleton } from "@/components/invoices/InvoicesSkeleton";

export default function InvoicesListPage() {
  const router = useRouter();
  const { invoices, isLoading } = useData();

  const [currentTab, setCurrentTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: invoices.length,
      paid: invoices.filter((i) => i.status === "paid").length,
      sent: invoices.filter((i) => i.status === "sent").length,
      overdue: invoices.filter((i) => i.status === "overdue").length,
      draft: invoices.filter((i) => i.status === "draft").length,
    };
  }, [invoices]);

  const tabs = [
    { id: "all", label: "Toutes les factures", count: counts.all },
    { id: "paid", label: "Payées", count: counts.paid, dotColor: "bg-emerald-500" },
    { id: "sent", label: "Envoyées", count: counts.sent, dotColor: "bg-amber-500" },
    { id: "overdue", label: "En retard", count: counts.overdue, dotColor: "bg-rose-500" },
    { id: "draft", label: "Brouillons", count: counts.draft, dotColor: "bg-slate-400" },
  ];

  // Filtering
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      // 1. Status tab
      if (currentTab !== "all" && inv.status !== currentTab) {
        return false;
      }
      // 2. Search query (client name, contact person, number, city)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchClient = inv.client.name.toLowerCase().includes(q);
        const matchContact = inv.client.contactPerson.toLowerCase().includes(q);
        const matchNumber = inv.number.toLowerCase().includes(q);
        const matchCity = inv.client.city.toLowerCase().includes(q);
        return matchClient || matchContact || matchNumber || matchCity;
      }
      return true;
    });
  }, [invoices, currentTab, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage) || 1;
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInvoices.slice(start, start + itemsPerPage);
  }, [filteredInvoices, currentPage]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCsv = () => {
    const headers = [
      "Numero",
      "Client",
      "Contact",
      "Date_Emission",
      "Date_Echeance",
      "Montant_TTC_FCFA",
      "Montant_Paye_FCFA",
      "Reste_Du_FCFA",
      "Statut",
    ];

    const rows = filteredInvoices.map((i) => [
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
      `factures_telambah_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/50 hover:scale-105 transition-all">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Payée
          </span>
        );
      case "sent":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/50 hover:scale-105 transition-all">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Envoyée
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:scale-105 transition-all">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Brouillon
          </span>
        );
      case "overdue":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/50 animate-pulse hover:scale-105 transition-all">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            En retard
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0F1117] text-slate-900 dark:text-slate-100 flex">
        {/* 1. Desktop Sidebar */}
      <Sidebar currentPath="/invoices" />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 pb-20 lg:pb-12">
        {/* Mobile Header */}
        <MobileHeader />

        {/* Invoices Workspace */}
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
              Factures
            </span>
          </div>

          {isLoading ? (
            <InvoicesSkeleton />
          ) : (
            <>
              {/* Hero Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-700/60">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                  Factures
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                  {invoices.length} au total
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Gérez l&apos;ensemble de vos émissions, suivez les encaissements et relancez vos clients.
              </p>
            </div>

            {/* Top Action CTAs */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportCsv}
                className="group h-10 px-3.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 border border-slate-200/90 dark:border-slate-700 rounded-xl shadow-2xs flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                <span className="hidden sm:inline">Exporter CSV</span>
              </button>

              <Link
                href="/invoices/new"
                className="group h-10 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 rounded-xl shadow-sm flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
                <span>Créer une facture</span>
              </Link>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/60 shadow-card overflow-hidden">
            {/* Filter Tabs & Search Controls */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700/60 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Search by Client / Invoice Number */}
                <div className="relative flex items-center max-w-sm w-full group">
                  <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 absolute left-3 pointer-events-none transition-colors" />
                  <input
                    type="text"
                    placeholder="Rechercher par client, contact, n°..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100/70 dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl border border-slate-200 dark:border-slate-600 focus:border-slate-900 dark:focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 transition-all"
                  />
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {filteredInvoices.length} facture(s) trouvée(s)
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {tabs.map((tab) => {
                  const isActive = currentTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setCurrentTab(tab.id);
                        setCurrentPage(1);
                      }}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs hover:bg-slate-800 dark:hover:bg-slate-100 hover:-translate-y-0.5 active:scale-95"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 hover:-translate-y-0.5 active:scale-95"
                      }`}
                    >
                      {tab.dotColor && !isActive && (
                        <span className={`w-1.5 h-1.5 rounded-full ${tab.dotColor}`} />
                      )}
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold transition-transform duration-200 ${
                          isActive
                            ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 dark:bg-slate-700/40 border-b border-slate-200/70 dark:border-slate-700/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">N° Facture</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Date d&apos;émission</th>
                    <th className="py-3 px-4">Échéance</th>
                    <th className="py-3 px-4 text-right">Montant TTC</th>
                    <th className="py-3 px-4 text-center">Statut</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs">
                  {paginatedInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500 dark:text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500">
                            <FileQuestion className="w-5 h-5" />
                          </div>
                          <p className="font-semibold text-slate-700 dark:text-slate-300">
                            Aucune facture ne correspond à ces critères
                          </p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            Essayez un autre mot-clé ou modifiez le filtre sélectionné.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedInvoices.map((invoice) => {
                      const isOverdue = invoice.status === "overdue";
                      return (
                        <tr
                          key={invoice.id}
                          onClick={() => router.push(`/invoices/${invoice.id}`)}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-all duration-150 group cursor-pointer"
                        >
                          {/* Invoice Number */}
                          <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                {invoice.number}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(invoice.number, invoice.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-brand-600 hover:scale-125 active:scale-90 transition-all p-0.5 rounded"
                                title="Copier le numéro"
                              >
                                {copiedId === invoice.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Client Info */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 text-slate-700 dark:text-slate-300 font-bold text-[10px] flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-600 group-hover:border-brand-200 dark:group-hover:border-brand-700 group-hover:scale-105 transition-all">
                                {invoice.client.avatarInitials}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
                                  {invoice.client.name}
                                </p>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                                  {invoice.client.contactPerson} · {invoice.client.city}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Issue Date */}
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-medium">
                            {formatDate(invoice.issueDate)}
                          </td>

                          {/* Due Date */}
                          <td className="py-3.5 px-4 font-medium">
                            <span
                              className={
                                isOverdue
                                  ? "text-rose-700 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded"
                                  : "text-slate-600 dark:text-slate-400"
                              }
                            >
                              {formatDate(invoice.dueDate)}
                            </span>
                          </td>

                          {/* Amount TTC (FCFA) */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="font-bold text-slate-900 dark:text-white tabular-nums group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
                              {formatFCFA(invoice.total)}
                            </div>
                            {invoice.balanceDue > 0 && invoice.amountPaid > 0 && (
                              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                                Reste : {formatFCFA(invoice.balanceDue)}
                              </p>
                            )}
                          </td>

                          {/* Status Badge */}
                          <td className="py-3.5 px-4 text-center">
                            {renderStatusBadge(invoice.status)}
                          </td>

                          {/* Actions */}
                          <td
                            className="py-3.5 px-4 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-1">
                              {/* WhatsApp share */}
                              <a
                                href={`https://wa.me/?text=Bonjour%20${encodeURIComponent(
                                  invoice.client.contactPerson
                                )}%2C%20veuillez%20trouver%20votre%20facture%20${
                                  invoice.number
                                }%20d%27un%20montant%20de%20${encodeURIComponent(
                                  formatFCFA(invoice.total)
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-7 h-7 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:scale-120 active:scale-90 flex items-center justify-center transition-all duration-200"
                                title="Partager sur WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>

                              {/* Download PDF */}
                              <button
                                type="button"
                                onClick={() => generateInvoicePDF(invoice)}
                                className="w-7 h-7 rounded-lg text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/50 hover:scale-120 active:scale-90 flex items-center justify-center transition-all duration-200"
                                title="Télécharger la facture en PDF"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>

                              {/* Open Details */}
                              <Link
                                href={`/invoices/${invoice.id}`}
                                className="w-7 h-7 rounded-lg text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/50 hover:scale-120 active:scale-90 flex items-center justify-center transition-all duration-200"
                                title="Consulter la facture"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (< 768px) */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-700/60">
              {paginatedInvoices.length === 0 ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    Aucune facture trouvée
                  </p>
                </div>
              ) : (
                paginatedInvoices.map((invoice) => {
                  const isOverdue = invoice.status === "overdue";
                  return (
                    <div
                      key={invoice.id}
                      onClick={() => router.push(`/invoices/${invoice.id}`)}
                      className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors space-y-3 cursor-pointer active:scale-[0.99]"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                            {invoice.number}
                          </span>
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                            {invoice.client.name}
                          </h3>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {invoice.client.contactPerson} · {invoice.client.city}
                          </p>
                        </div>
                        <div>{renderStatusBadge(invoice.status)}</div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block">
                            Échéance
                          </span>
                          <span
                            className={`font-semibold ${
                              isOverdue
                                ? "text-rose-700 dark:text-rose-400"
                                : "text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {formatDate(invoice.dueDate)}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block">
                            Montant TTC
                          </span>
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white tabular-nums">
                            {formatFCFA(invoice.total)}
                          </span>
                        </div>
                      </div>

                      <div
                        className="flex items-center justify-end gap-2 pt-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a
                          href={`https://wa.me/?text=Bonjour%2C%20voici%20votre%20facture%20${invoice.number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-1.5 px-2 rounded-xl text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800/50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => generateInvoicePDF(invoice)}
                          className="py-1.5 px-3 rounded-xl text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>

                        <Link
                          href={`/invoices/${invoice.id}`}
                          className="py-1.5 px-3 rounded-xl text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Détails</span>
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination Footer */}
            <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-700/30 border-t border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <p>
                Affichage de{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {filteredInvoices.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                à{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {Math.min(currentPage * itemsPerPage, filteredInvoices.length)}
                </span>{" "}
                sur{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {filteredInvoices.length}
                </span>{" "}
                factures
              </p>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-all duration-150"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Précédent</span>
                </button>

                <div className="px-3 py-1 font-semibold text-slate-700 dark:text-slate-300">
                  Page {currentPage} sur {totalPages}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-all duration-150"
                >
                  <span>Suivant</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
          </>
          )}
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation */}
      <MobileBottomNav currentPath="/invoices" />
    </div>
    </AuthGuard>
  );
}

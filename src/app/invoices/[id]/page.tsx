"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  ArrowLeft,
  Download,
  MessageSquare,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useData } from "@/lib/data-context";
import { formatFCFA, formatDate } from "@/lib/utils";
import { InvoiceStatus } from "@/types";
import { generateInvoicePDF } from "@/lib/pdf-generator";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params?.id as string;

  const { getInvoice, changeInvoiceStatus, deleteInvoice, currentUser } = useData();
  const invoice = getInvoice(invoiceId);

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessToast, setIsSuccessToast] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!invoice) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0F1117] text-slate-900 dark:text-slate-100 flex">
        <Sidebar currentPath="/invoices" />
        <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
          <MobileHeader />
          <main className="flex-1 p-6 sm:p-12 max-w-3xl mx-auto flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <FileText className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold font-sans text-slate-900 dark:text-white">
              Facture introuvable
            </h1>
            <p className="text-xs text-slate-500 max-w-sm">
              La facture demandée n&apos;existe pas ou a été supprimée de votre espace Telambah Facture.
            </p>
            <Link
              href="/invoices"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 transition-all"
            >
              Retour à la liste des factures
            </Link>
          </main>
        </div>
      </div>
    );
  }

  const isOverdue = invoice.status === "overdue";

  const showToast = (message: string) => {
    setIsSuccessToast(message);
    setTimeout(() => setIsSuccessToast(null), 2500);
  };

  const handleChangeStatus = (newStatus: InvoiceStatus) => {
    changeInvoiceStatus(invoice.id, newStatus);
    setIsStatusDropdownOpen(false);
    showToast(`Statut mis à jour : ${newStatus.toUpperCase()}`);
  };

  const handleDelete = () => {
    deleteInvoice(invoice.id);
    setIsDeleteModalOpen(false);
    router.push("/invoices");
  };

  const renderStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/50">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Payée
          </span>
        );
      case "sent":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/50">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Envoyée
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            Brouillon
          </span>
        );
      case "overdue":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/50 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
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

        {/* Success Toast */}
        {isSuccessToast && (
          <div className="fixed top-5 right-5 z-50 bg-slate-900 dark:bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold">{isSuccessToast}</span>
          </div>
        )}

        {/* Workspace */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-5xl mx-auto w-full space-y-6">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Link
                href="/dashboard"
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                Accueil
              </Link>
              <span>›</span>
              <Link
                href="/invoices"
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                Factures
              </Link>
              <span>›</span>
              <span className="text-slate-700 dark:text-slate-200 font-semibold font-mono">
                {invoice.number}
              </span>
            </div>

            <Link
              href="/invoices"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour à la liste</span>
            </Link>
          </div>

          {/* Action Header Card */}
          <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/60 p-4 sm:p-5 shadow-card flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
                    {invoice.number}
                  </h1>
                  {renderStatusBadge(invoice.status)}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Émise le {formatDate(invoice.issueDate)} · Exigibilité au {formatDate(invoice.dueDate)}
                </p>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center gap-2">
              {/* WhatsApp Share Button */}
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
                className="h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:-translate-y-0.5 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              {/* Download PDF button */}
              <button
                type="button"
                disabled={isGeneratingPdf}
                onClick={() => {
                  setIsGeneratingPdf(true);
                  try {
                    generateInvoicePDF(invoice);
                    showToast(`Téléchargement de ${invoice.number}.pdf lancé !`);
                  } catch (err) {
                    console.error("Erreur PDF:", err);
                    showToast("Erreur lors de la génération du PDF.");
                  } finally {
                    setTimeout(() => setIsGeneratingPdf(false), 600);
                  }
                }}
                className="h-9 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shadow-2xs hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {isGeneratingPdf ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-600 dark:text-slate-400" />
                ) : (
                  <Download className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                )}
                <span>{isGeneratingPdf ? "Génération..." : "Télécharger PDF"}</span>
              </button>

              {/* Change Status Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className="h-9 px-3.5 rounded-xl border border-slate-900/80 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
                >
                  <span>Changer statut</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                      isStatusDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isStatusDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setIsStatusDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-[#12141A] border border-slate-900/80 dark:border-slate-700 rounded-2xl shadow-2xl z-40 py-2 animate-in fade-in-50 zoom-in-95 duration-150">
                      <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Sélectionner un statut :
                      </div>
                      <button
                        type="button"
                        onClick={() => handleChangeStatus("paid")}
                        className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                          invoice.status === "paid"
                            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Payée (Encaissée)</span>
                        </div>
                        {invoice.status === "paid" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChangeStatus("sent")}
                        className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                          invoice.status === "sent"
                            ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 font-bold"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>Envoyée</span>
                        </div>
                        {invoice.status === "sent" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChangeStatus("overdue")}
                        className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                          invoice.status === "overdue"
                            ? "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 font-bold"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                          <span>En retard</span>
                        </div>
                        {invoice.status === "overdue" && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChangeStatus("draft")}
                        className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                          invoice.status === "draft"
                            ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span>Brouillon</span>
                        </div>
                        {invoice.status === "draft" && <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Edit button */}
              <Link
                href={`/invoices/new?edit=${invoice.id}`}
                className="h-9 px-3.5 rounded-xl border border-slate-900/80 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 shadow-2xs hover:-translate-y-0.5 transition-all"
              >
                <Edit className="w-3.5 h-3.5 text-slate-500" />
                <span>Modifier</span>
              </Link>

              {/* Delete button (with confirmation modal) */}
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="h-9 w-9 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                title="Supprimer la facture"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Overdue Warning Alert if applicable */}
          {isOverdue && (
            <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-rose-800 dark:text-rose-300">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <p className="font-bold">Facture échue en retard de paiement</p>
                  <p className="text-[11px] text-rose-600 dark:text-rose-400">
                    L&apos;échéance a expiré le {formatDate(invoice.dueDate)}. Relancez le client sans attendre.
                  </p>
                </div>
              </div>
              <a
                href={`https://wa.me/?text=Bonjour%20${encodeURIComponent(
                  invoice.client.contactPerson
                )}%2C%20rappel%20concernant%20la%20facture%20échue%20${invoice.number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all"
              >
                Relance urgente
              </a>
            </div>
          )}

          {/* Main Printable Document Sheet (Standard A4 / OHADA) */}
          <div className="bg-white dark:bg-slate-800/90 rounded-3xl shadow-xl border border-slate-200/90 dark:border-slate-700/60 p-6 sm:p-10 space-y-8 text-slate-900 dark:text-white">
            {/* Document Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 border-b border-slate-100 dark:border-slate-700/60 pb-6">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold flex items-center justify-center text-lg shadow-sm">
                    T
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight font-sans">Telambah Facture</h2>
                    <p className="text-[11px] text-slate-400 font-medium">Facturation Zone FCFA</p>
                  </div>
                </div>

                <div className="mt-6">
                  <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
                    FACTURE
                  </span>
                  <p className="font-mono text-sm font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                    {invoice.number}
                  </p>
                </div>
              </div>

              {/* Émetteur Details */}
              <div className="text-right space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Émetteur
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {currentUser.companyName}
                </p>
                {currentUser.rccm && (
                  <p className="text-slate-500 dark:text-slate-400">RC : {currentUser.rccm}</p>
                )}
                {currentUser.taxId ? (
                  <p className="text-slate-500 dark:text-slate-400">NIF : {currentUser.taxId}</p>
                ) : null}
                <p className="text-slate-500 dark:text-slate-400">{currentUser.email}</p>
                <p className="text-slate-500 dark:text-slate-400">{currentUser.phone}</p>
                <p className="text-slate-500 dark:text-slate-400">
                  {currentUser.city}, {currentUser.country}
                </p>
              </div>
            </div>

            {/* Parties Snapshot & Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Facturé à (Client) :
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {invoice.client.name}
                </p>
                <p className="text-slate-600 dark:text-slate-300 font-medium">
                  Attn : {invoice.client.contactPerson}
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  {invoice.client.email} · {invoice.client.phone}
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  {invoice.client.city}, {invoice.client.country}
                </p>
                {invoice.client.taxId && (
                  <p className="text-[10px] text-slate-400 font-mono mt-1">
                    ID Fiscal : {invoice.client.taxId}
                  </p>
                )}
              </div>

              <div className="sm:text-right space-y-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Date d&apos;émission :
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatDate(invoice.issueDate)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Date d&apos;échéance :
                  </span>
                  <p className="font-bold text-brand-600 dark:text-brand-400 text-sm">
                    {formatDate(invoice.dueDate)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Règlement accepté :
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 font-medium">
                    {invoice.paymentMethod || "Wave, Orange Money & Virement"}
                  </p>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b-2 border-slate-200 dark:border-slate-700 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3 text-center">Qté</th>
                      <th className="py-2.5 px-3 text-right">Prix Unitaire HT</th>
                      <th className="py-2.5 px-3 text-center">TVA</th>
                      <th className="py-2.5 px-3 text-right">Total HT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                    {(invoice.items || []).map((item, idx) => {
                      const lineTotal = item.quantity * item.unitPrice;
                      return (
                        <tr key={item.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-3">
                            <p className="font-bold text-slate-900 dark:text-white">
                              {item.description}
                            </p>
                          </td>
                          <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-300 font-medium">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-3 text-right font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                            {formatFCFA(item.unitPrice)}
                          </td>
                          <td className="py-3 px-3 text-center text-slate-500 font-semibold">
                            {item.taxRate || 18}%
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white tabular-nums">
                            {formatFCFA(lineTotal)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 items-start">
              <div className="sm:col-span-7 space-y-3">
                {/* Notes */}
                {invoice.notes && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white">Notes & Modalités :</p>
                    <p>{invoice.notes}</p>
                  </div>
                )}

                {/* Mobile Money Notice */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50 text-xs space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white">
                    Canaux de règlement Mobile Money :
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    • TMoney (Togo 🇹🇬) : <strong>+228 90 12 34 56</strong>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    • Flooz Moov (Togo 🇹🇬) : <strong>+228 99 87 65 43</strong>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    • Wave / Orange Money : <strong>+228 90 12 34 56</strong>
                  </p>
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  « Facture arrêtée à la somme de {formatFCFA(invoice.total)} toutes taxes comprises. »
                </p>
              </div>

              {/* Totals Table */}
              <div className="sm:col-span-5 border border-slate-200/90 dark:border-slate-700/70 rounded-2xl p-4 space-y-2.5 text-xs bg-slate-50/50 dark:bg-slate-800/40">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Sous-total HT</span>
                  <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                    {formatFCFA(invoice.subtotal)}
                  </span>
                </div>

                {invoice.discountAmount && invoice.discountAmount > 0 ? (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Remise commerciale</span>
                    <span className="tabular-nums">-{formatFCFA(invoice.discountAmount)}</span>
                  </div>
                ) : null}

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>TVA légale ({invoice.taxRate}%)</span>
                  <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                    {formatFCFA(invoice.taxAmount)}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm font-extrabold text-slate-900 dark:text-white">
                  <span>Total TTC Net</span>
                  <span className="text-base text-slate-900 dark:text-white font-extrabold tabular-nums">
                    {formatFCFA(invoice.total)}
                  </span>
                </div>

                {invoice.amountPaid > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                    <span>Montant réglé</span>
                    <span className="tabular-nums">-{formatFCFA(invoice.amountPaid)}</span>
                  </div>
                )}

                {invoice.balanceDue > 0 && (
                  <div className="flex justify-between text-rose-600 dark:text-rose-400 font-bold pt-1 border-t border-slate-100 dark:border-slate-700">
                    <span>Reste dû</span>
                    <span className="tabular-nums">{formatFCFA(invoice.balanceDue)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Signature Block */}
            <div className="pt-8 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{currentUser.companyName}</p>
                <p className="text-[11px] text-slate-400">{currentUser.city}, le {formatDate(invoice.issueDate)}</p>
              </div>

              <div className="text-right">
                <span className="font-sans italic text-base text-slate-900 dark:text-white font-bold block">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Signature & Cachet
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation */}
      <MobileBottomNav currentPath="/invoices" />

      {/* Reusable Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer la facture ?"
        description={`Êtes-vous sûr de vouloir supprimer définitivement la facture ${invoice.number} d'un montant de ${formatFCFA(invoice.total)} ? Cette action est irréversible.`}
        confirmLabel="Oui, supprimer"
        cancelLabel="Annuler"
        isDestructive={true}
      />
    </div>
    </AuthGuard>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  Download,
  CheckCircle2,
  MessageSquare,
  FileText,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { formatFCFA, formatDate } from "@/lib/utils";
import { Invoice, InvoiceStatus } from "@/types";
import { useData } from "@/lib/data-context";
import { generateInvoicePDF } from "@/lib/pdf-generator";

interface InvoiceDetailsModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  onMarkAsPaid?: (invoiceId: string) => void;
}

export function InvoiceDetailsModal({
  invoice,
  onClose,
  onMarkAsPaid,
}: InvoiceDetailsModalProps) {
  const { currentUser } = useData();
  const [isDownloading, setIsDownloading] = useState(false);

  if (!invoice) return null;

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    try {
      generateInvoicePDF(invoice, currentUser);
    } catch (err) {
      console.error("Erreur génération PDF:", err);
    } finally {
      setTimeout(() => setIsDownloading(false), 600);
    }
  };

  const renderBadge = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Payée
          </span>
        );
      case "sent":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Envoyée
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Brouillon
          </span>
        );
      case "overdue":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            En retard
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-screen flex items-center justify-center p-3 sm:p-6">
        <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 transition-colors">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                    {invoice.number}
                  </h3>
                  {renderBadge(invoice.status)}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Émise le {formatDate(invoice.issueDate)} · Échéance : {formatDate(invoice.dueDate)}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 hover:rotate-90 hover:scale-110 active:scale-90 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
            {/* Parties */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                  Émetteur
                </span>
                <p className="font-bold text-slate-900 dark:text-white">{currentUser.companyName}</p>
                {currentUser.taxId && <p className="text-slate-500 dark:text-slate-400">{currentUser.taxId}</p>}
                {currentUser.phone && <p className="text-slate-500 dark:text-slate-400">{currentUser.phone}</p>}
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                  Client
                </span>
                <p className="font-bold text-slate-900 dark:text-white">{invoice.client.name}</p>
                <p className="text-slate-500 dark:text-slate-400">
                  {invoice.client.contactPerson} · {invoice.client.city}
                </p>
                <p className="text-slate-500 dark:text-slate-400">{invoice.client.phone}</p>
              </div>
            </div>

            {/* Financial Details */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Total Prestations HT</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                  {formatFCFA(invoice.subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>TVA légale ({invoice.taxRate}%)</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                  {formatFCFA(invoice.taxAmount)}
                </span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Montant Net à Payer (TTC)</span>
                <span className="text-slate-900 dark:text-white font-mono tabular-nums">
                  {formatFCFA(invoice.total)}
                </span>
              </div>

              {invoice.amountPaid > 0 && (
                <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                  <span>Montant Encaissé</span>
                  <span className="tabular-nums">-{formatFCFA(invoice.amountPaid)}</span>
                </div>
              )}

              {invoice.balanceDue > 0 && (
                <div className="flex justify-between text-xs text-rose-600 dark:text-rose-400 font-bold pt-1">
                  <span>Reste à percevoir</span>
                  <span className="tabular-nums">{formatFCFA(invoice.balanceDue)}</span>
                </div>
              )}
            </div>

            {/* Notes & Description */}
            {invoice.notes && (
              <div className="text-xs p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 dark:text-white">Notes & Objet :</span>
                <p className="text-slate-700 dark:text-slate-300">{invoice.notes}</p>
              </div>
            )}

            {/* Legal wording in words */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-400 italic">
              « Arrêtée la présente facture à la somme de règlement en FCFA toutes taxes comprises. »
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/?text=Bonjour%2C%20voici%20votre%20facture%20${invoice.number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-md hover:scale-105 active:scale-95 text-white flex items-center gap-1.5 shadow-sm transition-all duration-200"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <Link
                href={`/invoices/${invoice.id}`}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Ouvrir la page</span>
              </Link>

              <button
                type="button"
                disabled={isDownloading}
                onClick={handleDownloadPDF}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 hover:-translate-y-0.5 hover:shadow-xs hover:scale-105 active:scale-95 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-all duration-200 disabled:opacity-50"
              >
                {isDownloading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-600 dark:text-slate-400" />
                ) : (
                  <Download className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                )}
                <span>{isDownloading ? "Génération PDF..." : "Télécharger PDF"}</span>
              </button>
            </div>

            {invoice.status !== "paid" && (
              <button
                type="button"
                onClick={() => {
                  onMarkAsPaid?.(invoice.id);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 hover:-translate-y-0.5 hover:scale-105 active:scale-95 text-white flex items-center gap-1.5 shadow-sm transition-all duration-200"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Enregistrer un paiement</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Plus,
  Trash2,
  Send,
  Eye,
  Calendar,
  Building2,
  User,
  Hash,
  Sparkles,
  Download,
  MessageSquare,
  ArrowLeft,
  CheckCircle,
  Coins,
  Save,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useData } from "@/lib/data-context";
import { formatFCFA, formatDate } from "@/lib/utils";
import { Invoice, InvoiceItem } from "@/types";
import { generateInvoicePDF } from "@/lib/pdf-generator";
import { DatePicker } from "@/components/ui/DatePicker";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function CreateInvoicePage() {
  return (
    <AuthGuard>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0F1117] flex items-center justify-center text-xs text-slate-400">
            Chargement du formulaire...
          </div>
        }
      >
        <InvoiceFormContent />
      </Suspense>
    </AuthGuard>
  );
}

function InvoiceFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { clients, addInvoice, updateInvoice, getInvoice, currentUser } = useData();

  // Initial client
  const clientKeys = Object.keys(clients);
  const defaultClientId = clientKeys.length > 0 ? clientKeys[0] : "";

  // Form states
  const [invoiceType, setInvoiceType] = useState<"standard" | "split" | "recurring">("standard");
  const [selectedClientId, setSelectedClientId] = useState<string>(defaultClientId);
  const [invoiceNumber, setInvoiceNumber] = useState<string>("FAC-2026-0043");
  
  // Dates: deterministic defaults for SSR matching
  const [issueDate, setIssueDate] = useState<string>("2026-10-22");
  const [dueDate, setDueDate] = useState<string>("2026-11-21");
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [hasDiscount, setHasDiscount] = useState<boolean>(false);
  const [discountPercent, setDiscountPercent] = useState<number>(5);
  const [paymentOption, setPaymentOption] = useState<string>("TMoney & Flooz (Togo 🇹🇬)");
  const [notes, setNotes] = useState<string>(
    "Paiement à réception par Mobile Money (TMoney, Flooz, Wave) ou virement bancaire Ecobank Togo."
  );
  const [isSuccessToast, setIsSuccessToast] = useState(false);
  const [toastText, setToastText] = useState("");

  // Pre-fill if editing, or auto-select client if passed via ?clientId=
  useEffect(() => {
    if (editId) {
      const inv = getInvoice(editId);
      if (inv) {
        setInvoiceNumber(inv.number);
        setSelectedClientId(inv.client.id);
        setIssueDate(inv.issueDate);
        setDueDate(inv.dueDate);
        setItems(inv.items || []);
        setNotes(inv.notes || "");
        if (inv.paymentMethod) setPaymentOption(inv.paymentMethod);
        if (inv.discountPercent && inv.discountPercent > 0) {
          setHasDiscount(true);
          setDiscountPercent(inv.discountPercent);
        }
        return;
      }
    }

    if (typeof window !== "undefined") {
      const today = new Date();
      const todayFormatted = today.toISOString().slice(0, 10);
      const due = new Date();
      due.setDate(due.getDate() + 30);
      const dueFormatted = due.toISOString().slice(0, 10);

      setIssueDate(todayFormatted);
      setDueDate(dueFormatted);

      const cId = searchParams.get("clientId");
      if (cId && clients[cId]) {
        setSelectedClientId(cId);
      }

      const randomSeq = Math.floor(Math.random() * 900) + 100;
      setInvoiceNumber(`FAC-2026-${String(randomSeq).padStart(4, "0")}`);
    }
  }, [clients, editId, getInvoice, searchParams]);

  // Line items
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "item-1",
      description: "Stratégie de marque & Direction artistique",
      quantity: 1,
      unitPrice: 1200000,
      taxRate: 18,
    },
    {
      id: "item-2",
      description: "Développement web & Intégration portail client",
      quantity: 2,
      unitPrice: 750000,
      taxRate: 18,
    },
  ]);
  const selectedClient = clients[selectedClientId] || Object.values(clients)[0];

  // Dynamic calculations
  const subtotal = items.reduce(
    (acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  );
  const discountAmount = hasDiscount ? Math.round(subtotal * (discountPercent / 100)) : 0;
  const netHT = subtotal - discountAmount;
  const taxAmount = Math.round(netHT * 0.18); // TVA 18% UEMOA
  const totalTTC = netHT + taxAmount;

  // Items handlers
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: "",
      quantity: 1,
      unitPrice: 0,
      taxRate: 18,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleSubmit = (status: "draft" | "sent") => {
    if (!selectedClient) {
      alert("Veuillez sélectionner un client valide.");
      return;
    }

    if (editId) {
      updateInvoice(editId, {
        client: selectedClient,
        issueDate,
        dueDate,
        subtotal,
        discountPercent: hasDiscount ? discountPercent : 0,
        discountAmount,
        taxRate: 18,
        taxAmount,
        total: totalTTC,
        balanceDue: totalTTC,
        status,
        itemsCount: items.length,
        items,
        notes,
        paymentMethod: paymentOption,
      });
      setToastText(`Facture ${invoiceNumber} modifiée avec succès !`);
      setIsSuccessToast(true);

      setTimeout(() => {
        router.push(`/invoices/${editId}`);
      }, 1000);
      return;
    }

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      number: invoiceNumber,
      client: selectedClient,
      issueDate,
      dueDate,
      subtotal,
      discountPercent: hasDiscount ? discountPercent : 0,
      discountAmount,
      taxRate: 18,
      taxAmount,
      total: totalTTC,
      amountPaid: 0,
      balanceDue: totalTTC,
      status,
      itemsCount: items.length,
      items,
      currency: "XOF",
      notes,
      paymentMethod: paymentOption,
    };

    addInvoice(newInvoice);
    setToastText(`Facture ${invoiceNumber} créée avec succès !`);
    setIsSuccessToast(true);

    setTimeout(() => {
      router.push("/invoices");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0F1117] text-slate-900 dark:text-slate-100 flex">
      {/* 1. Desktop Sidebar */}
      <Sidebar currentPath="/invoices" />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 pb-20 lg:pb-12">
        {/* Mobile Header */}
        <MobileHeader />

        {/* Success Toast */}
        {isSuccessToast && (
          <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircle className="w-5 h-5" />
            <div>
              <p className="font-bold text-sm">
                {toastText || (editId ? `Facture ${invoiceNumber} mise à jour !` : `Facture ${invoiceNumber} créée !`)}
              </p>
              <p className="text-xs text-emerald-100">
                {editId ? "Redirection vers les détails..." : "Redirection vers la liste des factures..."}
              </p>
            </div>
          </div>
        )}

        {/* Create / Edit Invoice Workspace */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Breadcrumb matching inspiration capture */}
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
              <span className="text-slate-700 dark:text-slate-200 font-semibold">
                {editId ? `Modifier ${invoiceNumber}` : "Créer une facture"}
              </span>
            </div>

            <Link
              href={editId ? `/invoices/${editId}` : "/invoices"}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{editId ? "Annuler et retourner" : "Retour aux factures"}</span>
            </Link>
          </div>

          {/* Top Page Title & Actions Banner */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-700/60">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                  {editId ? `Modifier la facture ${invoiceNumber}` : "Créer une facture"}
                </h1>
                {editId && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/60">
                    Mode édition
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {editId
                  ? "Modifiez les informations, prestations et coordonnées de règlement de votre facture."
                  : "Émettez une facture conforme OHADA, calculez la TVA en FCFA et livrez-la en 1 clic."}
              </p>
            </div>

            {/* Quick Actions Header */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className={`hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                  showPreview
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 font-semibold"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showPreview ? "Aperçu actif" : "Afficher aperçu"}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSubmit("draft")}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 border border-slate-200/90 dark:border-slate-700 rounded-xl shadow-2xs hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
              >
                Sauvegarder brouillon
              </button>

              <button
                type="button"
                onClick={() => handleSubmit("sent")}
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 rounded-xl shadow-sm flex items-center gap-2 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
              >
                {editId ? <Save className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                <span>{editId ? "Enregistrer les modifications" : "Envoyer la facture"}</span>
              </button>
            </div>
          </div>

          {/* Form & Live Preview Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Comprehensive Invoice Form */}
            <div
              className={`space-y-6 ${
                showPreview ? "lg:col-span-7 xl:col-span-7" : "lg:col-span-12"
              }`}
            >
              {/* Invoice Type Pills matching inspiration capture */}
              <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/60 p-1.5 flex items-center gap-1 shadow-card">
                <button
                  type="button"
                  onClick={() => setInvoiceType("standard")}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                    invoiceType === "standard"
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Standard
                </button>
                <button
                  type="button"
                  onClick={() => setInvoiceType("split")}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                    invoiceType === "split"
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Acompte / Échelonné
                </button>
                <button
                  type="button"
                  onClick={() => setInvoiceType("recurring")}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                    invoiceType === "recurring"
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Récurrente (Abonnement)
                </button>
              </div>

              {/* Section 1: Informations Générales */}
              <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/60 p-5 sm:p-6 shadow-card space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                    <span>Informations de la facture</span>
                  </h2>
                  <span
                    suppressHydrationWarning
                    className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700"
                  >
                    {invoiceNumber}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Émetteur (Readonly) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Émetteur (Votre Entreprise)
                    </label>
                    <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold">{currentUser.companyName}</span>
                    </div>
                  </div>

                  {/* Destinataire / Client (Sélection liste déroulante) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Client destinataire <span className="text-rose-500">*</span>
                      </label>
                      <Link
                        href="/clients"
                        className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:underline"
                      >
                        + Nouveau client
                      </Link>
                    </div>
                    <select
                      value={selectedClientId}
                      onChange={(e) => setSelectedClientId(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-800 focus:border-slate-900 dark:focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 focus:outline-none transition-all cursor-pointer"
                    >
                      {Object.values(clients).map((client) => (
                        <option key={client.id} value={client.id} className="dark:bg-slate-800">
                          {client.name} — {client.city} ({client.contactPerson})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date d'émission (Aujourd'hui par défaut) */}
                  <DatePicker
                    label="Date d'émission"
                    value={issueDate}
                    onChange={(val) => setIssueDate(val)}
                  />

                  {/* Date d'échéance */}
                  <DatePicker
                    label="Date d'échéance"
                    value={dueDate}
                    onChange={(val) => setDueDate(val)}
                  />

                  {/* Numéro de facture */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Numéro de facture
                    </label>
                    <div className="relative">
                      <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        readOnly
                        value={invoiceNumber}
                        className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 font-mono font-semibold"
                      />
                    </div>
                  </div>

                  {/* Devise (Strictement FCFA) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Devise légale
                    </label>
                    <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <Coins className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                      <span>Franc CFA (FCFA / XOF)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Lignes de Facture (Prestations / Articles) */}
              <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/60 p-5 sm:p-6 shadow-card space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Lignes de facture
                    </h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Chaque ligne calcule automatiquement son total HT
                    </p>
                  </div>

                  {/* Bouton Ajouter une ligne */}
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:-translate-y-0.5 active:scale-95 transition-all duration-150"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Ajouter une ligne</span>
                  </button>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {items.map((item, idx) => {
                    const lineTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);

                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/90 dark:border-slate-700/70 space-y-3 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </span>
                            <span>Article #{idx + 1}</span>
                          </span>

                          {/* Bouton Supprimer */}
                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Supprimer la ligne"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Description field */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                            Description du service ou produit
                          </label>
                          <input
                            type="text"
                            placeholder="Ex : Conception graphique, Maintenance serveur..."
                            value={item.description}
                            onChange={(e) =>
                              handleUpdateItem(item.id, "description", e.target.value)
                            }
                            className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 transition-all font-medium"
                          />
                        </div>

                        {/* Quantity, Unit Price and Calculated Total */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                          <div className="sm:col-span-3">
                            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                              Quantité
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleUpdateItem(
                                  item.id,
                                  "quantity",
                                  Math.max(1, parseFloat(e.target.value) || 1)
                                )
                              }
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-right font-medium focus:outline-none focus:border-brand-500"
                            />
                          </div>

                          <div className="sm:col-span-4">
                            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                              Prix unitaire (FCFA)
                            </label>
                            <input
                              type="number"
                              step="5000"
                              min="0"
                              value={item.unitPrice}
                              onChange={(e) =>
                                handleUpdateItem(
                                  item.id,
                                  "unitPrice",
                                  Math.max(0, parseInt(e.target.value, 10) || 0)
                                )
                              }
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-right font-semibold focus:outline-none focus:border-brand-500 tabular-nums"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                              Taux TVA
                            </label>
                            <div className="px-2.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center font-bold text-slate-700 dark:text-slate-300">
                              18%
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                              Total HT
                            </label>
                            <div className="px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-right font-extrabold text-slate-900 dark:text-white tabular-nums truncate">
                              {formatFCFA(lineTotal)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Remise & Options complémentaires */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={hasDiscount}
                        onChange={(e) => setHasDiscount(e.target.checked)}
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                      />
                      <span>Appliquer une remise commerciale</span>
                    </label>

                    {hasDiscount && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Taux :</span>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={discountPercent}
                          onChange={(e) =>
                            setDiscountPercent(
                              Math.min(100, Math.max(1, parseInt(e.target.value, 10) || 1))
                            )
                          }
                          className="w-16 px-2 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-right font-bold"
                        />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">%</span>
                      </div>
                    )}
                  </div>

                  {/* Mode de règlement & Coordonnées Mobile Money */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Canal de règlement recommandé
                      </label>
                      <select
                        value={paymentOption}
                        onChange={(e) => setPaymentOption(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none"
                      >
                        <option>TMoney & Flooz (Togo 🇹🇬)</option>
                        <option>TMoney Togo (+228 90 12 34 56)</option>
                        <option>Flooz Moov Togo (+228 99 87 65 43)</option>
                        <option>Wave Digital Finance (Panafricain)</option>
                        <option>Orange Money (Zone UEMOA / CEMAC)</option>
                        <option>Virement bancaire (Ecobank Togo / Coris Bank / Orabank)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Notes & Modalités de paiement
                      </label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Récapitulatif Financier (Sous-total, TVA, Total TTC) */}
              <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/60 p-5 sm:p-6 shadow-card space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-700/60">
                  Décomposition financière (FCFA)
                </h2>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Sous-total HT brut</span>
                    <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                      {formatFCFA(subtotal)}
                    </span>
                  </div>

                  {hasDiscount && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>Remise commerciale ({discountPercent}%)</span>
                      <span className="tabular-nums">-{formatFCFA(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>TVA légale UEMOA (18%)</span>
                    <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                      {formatFCFA(taxAmount)}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-base font-extrabold text-slate-900 dark:text-white">
                    <div>
                      <span>Total Net à Payer (TTC)</span>
                      <span className="block text-[11px] font-normal text-slate-400 dark:text-slate-500">
                        Montant net exigible en FCFA arrondi
                      </span>
                    </div>
                    <span className="text-xl text-brand-600 dark:text-brand-400 tabular-nums">
                      {formatFCFA(totalTTC)}
                    </span>
                  </div>
                </div>

                {/* Footer Buttons inside Form */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleSubmit("draft")}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all active:scale-95"
                  >
                    Sauvegarder comme brouillon
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSubmit("sent")}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 shadow-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95 transition-all"
                  >
                    {editId ? <Save className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                    <span>{editId ? "Enregistrer les modifications" : "Émettre & Envoyer"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Live Invoice Preview (The "Paper Sheet" matching inspiration) */}
            {showPreview && (
              <div className="lg:col-span-5 xl:col-span-5 space-y-4 sticky top-6">
                {/* Header Preview Controls */}
                <div className="flex items-center justify-between bg-white dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200/90 dark:border-slate-700/60 shadow-xs text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                    <span>Aperçu en temps réel</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const previewInvoice: Invoice = {
                          id: "preview-temp",
                          number: invoiceNumber,
                          client: selectedClient || {
                            id: "temp",
                            name: "Client Partenaire",
                            contactPerson: "Direction Commerciale",
                            email: "contact@client.com",
                            phone: "+228 90 00 00 00",
                            city: "Lomé",
                            country: "Togo",
                            avatarInitials: "CP",
                          },
                          issueDate: issueDate,
                          dueDate: dueDate,
                          subtotal: subtotal,
                          discountPercent: hasDiscount ? discountPercent : 0,
                          discountAmount: discountAmount,
                          taxRate: 18,
                          taxAmount: taxAmount,
                          total: totalTTC,
                          amountPaid: 0,
                          balanceDue: totalTTC,
                          status: "draft",
                          itemsCount: items.length,
                          items: items,
                          currency: "XOF",
                          notes: notes,
                        };
                        generateInvoicePDF(previewInvoice);
                      }}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1 transition-all active:scale-95"
                    >
                      <Download className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                      <span>Télécharger PDF</span>
                    </button>
                    <a
                      href={`https://wa.me/?text=Bonjour%20${encodeURIComponent(
                        selectedClient?.contactPerson || ""
                      )}%2C%20veuillez%20trouver%20la%20facture%20${invoiceNumber}%20d%27un%20montant%20de%20${encodeURIComponent(
                        formatFCFA(totalTTC)
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* The Paper Sheet Container */}
                <div className="bg-white dark:bg-slate-800/95 rounded-2xl shadow-xl border border-slate-200/90 dark:border-slate-700/70 p-6 sm:p-7 space-y-6 text-slate-900 dark:text-white font-sans text-xs">
                  {/* Document Header */}
                  <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold flex items-center justify-center text-xs">
                          T
                        </div>
                        <span className="font-extrabold text-base tracking-tight font-sans text-slate-900 dark:text-white">
                          Telambah
                        </span>
                      </div>
                      <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans block mt-2">
                        FACTURE
                      </span>
                      <p
                        suppressHydrationWarning
                        className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400"
                      >
                        N° {invoiceNumber}
                      </p>
                    </div>

                    <div className="text-right space-y-0.5">
                      <p className="font-bold text-slate-900 dark:text-white">
                        {currentUser.companyName}
                      </p>
                      {currentUser.rccm && (
                        <p className="text-[10px] text-slate-400 dark:text-slate-400">
                          RC : {currentUser.rccm}
                        </p>
                      )}
                      {currentUser.taxId ? (
                        <p className="text-[10px] text-slate-400 dark:text-slate-400">
                          NIF : {currentUser.taxId}
                        </p>
                      ) : null}
                      <p className="text-[10px] text-slate-400 dark:text-slate-400">
                        {currentUser.phone} · {currentUser.city}, {currentUser.country} 🇹🇬
                      </p>
                    </div>
                  </div>

                  {/* Billed To and Dates Card */}
                  <div className="grid grid-cols-2 gap-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 text-[11px]">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Facturé à :
                      </span>
                      <p className="font-bold text-slate-900 dark:text-white text-xs">
                        {selectedClient?.name}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400">
                        Attn : {selectedClient?.contactPerson}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400">
                        {selectedClient?.city}, {selectedClient?.country}
                      </p>
                    </div>

                    <div className="text-right space-y-1">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                          Date d&apos;émission :
                        </span>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {formatDate(issueDate)}
                        </p>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                          Date d&apos;échéance :
                        </span>
                        <p className="font-bold text-brand-600 dark:text-brand-400">
                          {formatDate(dueDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
                    <div className="flex justify-between py-1.5 font-bold text-slate-400 text-[10px] uppercase">
                      <span>Prestation / Article</span>
                      <span className="text-right">Montant HT</span>
                    </div>

                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between py-2.5 text-xs">
                        <div className="pr-4">
                          <p className="font-bold text-slate-800 dark:text-slate-200">
                            {item.description || "Article non spécifié"}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {item.quantity} × {formatFCFA(item.unitPrice)} (TVA 18%)
                          </p>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white tabular-nums shrink-0">
                          {formatFCFA(item.quantity * item.unitPrice)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Financial Breakdown */}
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Total HT brut</span>
                      <span className="tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                        {formatFCFA(subtotal)}
                      </span>
                    </div>

                    {hasDiscount && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                        <span>Remise ({discountPercent}%)</span>
                        <span className="tabular-nums">-{formatFCFA(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>TVA UEMOA (18%)</span>
                      <span className="tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                        {formatFCFA(taxAmount)}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm font-extrabold text-slate-900 dark:text-white">
                      <span>Total Net à Payer (TTC)</span>
                      <span className="text-base text-slate-900 dark:text-white font-extrabold tabular-nums">
                        {formatFCFA(totalTTC)}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Money Payment Info Box */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-[10px] space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white">
                      Règlements acceptés (Togo & Panafricain) :
                    </p>
                    <p className="text-slate-700 dark:text-slate-300">
                      • TMoney (Togo 🇹🇬) : <strong>+228 90 12 34 56</strong>
                    </p>
                    <p className="text-slate-700 dark:text-slate-300">
                      • Flooz Moov (Togo 🇹🇬) : <strong>+228 99 87 65 43</strong>
                    </p>
                    <p className="text-slate-700 dark:text-slate-300">
                      • Wave / Orange Money / Ecobank : <strong>+228 90 12 34 56</strong>
                    </p>
                  </div>

                  {/* Professional Signature Block */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                    <div>
                      <p className="font-semibold text-slate-700 dark:text-slate-300">
                        Pour {currentUser.companyName}
                      </p>
                      <p className="italic">Bon pour accord & règlement</p>
                    </div>
                    <div className="text-right">
                      <span className="font-sans italic text-sm text-slate-900 dark:text-white block font-bold">
                        {currentUser.name}
                      </span>
                      <span>Signature autorisée</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation */}
      <MobileBottomNav currentPath="/invoices" />
    </div>
  );
}

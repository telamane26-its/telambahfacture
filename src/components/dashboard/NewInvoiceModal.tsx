"use client";

import React, { useState } from "react";
import {
  X,
  Plus,
  Trash2,
  FileText,
  Send,
  Eye,
} from "lucide-react";
import { formatFCFA } from "@/lib/utils";
import { Invoice, Client } from "@/types";
import { useData } from "@/lib/data-context";

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvoiceCreated?: (invoice: Invoice) => void;
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

export function NewInvoiceModal({ isOpen, onClose, onInvoiceCreated }: NewInvoiceModalProps) {
  const { clients, currentUser } = useData();
  const clientList = Object.values(clients);

  const todayStr = new Date().toISOString().slice(0, 10);
  const due30Str = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [selectedClientId, setSelectedClientId] = useState<string>(
    clientList[0]?.id || "new_client"
  );
  const [customClientName, setCustomClientName] = useState("");
  const [customClientContact, setCustomClientContact] = useState("");
  const customClientCity = "Lomé";

  const [issueDate, setIssueDate] = useState<string>(todayStr);
  const [dueDate, setDueDate] = useState<string>(due30Str);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [showPreview, setShowPreview] = useState<boolean>(true);

  const [items, setItems] = useState<LineItem[]>([
    {
      id: "item-1",
      description: "Campagne digitale & Contenu réseaux sociaux",
      quantity: 1,
      unitPrice: 850000,
      taxRate: 18,
    },
    {
      id: "item-2",
      description: "Production de capsules vidéo interview",
      quantity: 2,
      unitPrice: 300000,
      taxRate: 18,
    },
  ]);

  if (!isOpen) return null;

  const existingClient = clients[selectedClientId];
  const client: Client = existingClient || {
    id: `cli_${Date.now()}`,
    name: customClientName.trim() || "Nouveau Client",
    contactPerson: customClientContact.trim() || "Contact Client",
    email: "",
    phone: "",
    city: customClientCity.trim() || "Lomé",
    country: "Togo",
    avatarInitials: (customClientName.trim() || "NC").slice(0, 2).toUpperCase(),
  };

  // Real-time calculations
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxAmount = Math.round(subtotalAfterDiscount * 0.18); // TVA 18% standard UEMOA
  const totalTTC = subtotalAfterDiscount + taxAmount;

  const addItem = () => {
    const newItem: LineItem = {
      id: `item-${Date.now()}`,
      description: "",
      quantity: 1,
      unitPrice: 0,
      taxRate: 18,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = (
    id: string,
    field: keyof LineItem,
    value: string | number
  ) => {
    setItems(
      items.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const handleSave = (status: "draft" | "sent") => {
    const prefix = currentUser.invoicePrefix || "FAC-2026-";
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      number: `${prefix}${Math.floor(Math.random() * 900) + 100}`,
      client,
      issueDate,
      dueDate,
      subtotal,
      taxRate: 18,
      taxAmount,
      total: totalTTC,
      amountPaid: 0,
      balanceDue: totalTTC,
      status,
      itemsCount: items.length,
      currency: "XOF",
      notes: "Prestation validée par le client",
    };

    onInvoiceCreated?.(newInvoice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 md:p-6">
        <div className="relative bg-white dark:bg-slate-900 w-full max-w-6xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] transition-colors">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                  Créer une nouvelle facture
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Numérotation séquentielle automatique · Conforme OHADA Zone FCFA
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-150"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>{showPreview ? "Masquer l'aperçu" : "Afficher l'aperçu"}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 hover:rotate-90 hover:scale-110 active:scale-90 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Body: Two Columns (Form left + Live Preview right) */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
            {/* Left Column: Invoice Form */}
            <div
              className={`p-6 space-y-6 ${
                showPreview ? "lg:col-span-6 xl:col-span-7" : "lg:col-span-12"
              }`}
            >
              {/* Client and Dates */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Destinataire & Échéances
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Client Select */}
                  <div className="sm:col-span-2 space-y-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Client destinataire
                    </label>
                    <select
                      value={selectedClientId}
                      onChange={(e) => setSelectedClientId(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white font-medium"
                    >
                      {clientList.map((c) => (
                        <option key={c.id} value={c.id} className="dark:bg-slate-800">
                          {c.name} — {c.city} ({c.contactPerson})
                        </option>
                      ))}
                      <option value="new_client">+ Nouveau client personnalisé</option>
                    </select>

                    {(selectedClientId === "new_client" || clientList.length === 0) && (
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 animate-in fade-in duration-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Nom de l'entreprise ou client"
                            value={customClientName}
                            onChange={(e) => setCustomClientName(e.target.value)}
                            className="px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                          />
                          <input
                            type="text"
                            placeholder="Nom du contact"
                            value={customClientContact}
                            onChange={(e) => setCustomClientContact(e.target.value)}
                            className="px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Date d'émission */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Date d&apos;émission
                    </label>
                    <input
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:border-brand-500 focus:outline-none"
                    />
                  </div>

                  {/* Date d'échéance */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Date d&apos;échéance
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Line Items Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Lignes de prestation / Articles
                  </h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter une ligne</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          Ligne #{idx + 1}
                        </span>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="Description du produit ou service"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, "description", e.target.value)
                        }
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl focus:outline-none focus:border-brand-500"
                      />

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                            Quantité
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "quantity",
                                Math.max(1, parseFloat(e.target.value) || 1)
                              )
                            }
                            className="w-full px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-right font-medium"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                            Prix Unit. (FCFA)
                          </label>
                          <input
                            type="number"
                            step="1000"
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "unitPrice",
                                Math.max(0, parseInt(e.target.value, 10) || 0)
                              )
                            }
                            className="w-full px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-right font-semibold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                            Total HT
                          </label>
                          <div className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 rounded-lg text-right font-bold text-slate-800 dark:text-slate-200 truncate">
                            {formatFCFA(item.quantity * item.unitPrice)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Remise & Moyen de paiement */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Remise globale (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) =>
                      setDiscountPercent(
                        Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0))
                      )
                    }
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Moyen de règlement préféré
                  </label>
                  <select className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-medium">
                    <option className="dark:bg-slate-800">Wave Sénégal (+221 77 654 32 10)</option>
                    <option className="dark:bg-slate-800">Orange Money (+221 78 123 45 67)</option>
                    <option className="dark:bg-slate-800">Virement bancaire (CBAO / SGBS)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Column: Live Invoice Preview */}
            {showPreview && (
              <div className="lg:col-span-6 xl:col-span-5 bg-slate-100/70 dark:bg-slate-950/50 p-6 flex flex-col justify-between overflow-y-auto">
                <div className="bg-white dark:bg-slate-800/90 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-6 space-y-5 text-slate-900 dark:text-white font-sans">
                  {/* Top document banner */}
                  <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
                    <div>
                      <span className="text-xl font-extrabold tracking-tight text-brand-700 dark:text-brand-400 font-sans block">
                        FACTURE
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                        N° FAC-2026-0043
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {currentUser.companyName}
                      </div>
                      {currentUser.taxId ? (
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">
                          NIF: {currentUser.taxId}
                        </div>
                      ) : null}
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">
                        {currentUser.city}, {currentUser.country}
                      </div>
                    </div>
                  </div>

                  {/* Client Snapshot */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-xs space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
                      Facturé à :
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white">{client.name}</p>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                      Attn: {client.contactPerson} · {client.city}, {client.country}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      {client.taxId || "Client vérifié"}
                    </p>
                  </div>

                  {/* Items Mini-table */}
                  <div className="text-xs divide-y divide-slate-100 dark:divide-slate-700">
                    <div className="flex justify-between py-1.5 font-bold text-slate-400 dark:text-slate-500 text-[10px] uppercase">
                      <span>Prestation</span>
                      <span>Total HT</span>
                    </div>
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between py-2 text-xs">
                        <div className="pr-4">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {item.description || "Prestation de service"}
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500">
                            {item.quantity} × {formatFCFA(item.unitPrice)}
                          </p>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white tabular-nums shrink-0">
                          {formatFCFA(item.quantity * item.unitPrice)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Totals Section */}
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Sous-total HT</span>
                      <span className="tabular-nums font-medium text-slate-800 dark:text-slate-200">{formatFCFA(subtotal)}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                        <span>Remise ({discountPercent}%)</span>
                        <span className="tabular-nums">
                          -{formatFCFA(discountAmount)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>TVA UEMOA (18%)</span>
                      <span className="tabular-nums font-medium text-slate-800 dark:text-slate-200">{formatFCFA(taxAmount)}</span>
                    </div>

                    <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                      <span>Total TTC</span>
                      <span className="text-slate-900 dark:text-white font-extrabold tabular-nums">
                        {formatFCFA(totalTTC)}
                      </span>
                    </div>
                  </div>

                  {/* Payment Mobile Money badge */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-600 dark:text-slate-300 space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white">
                      Règlement Mobile Money accepté :
                    </p>
                    <p>• TMoney / Flooz : {currentUser.paymentMethods?.tmoney?.phone || currentUser.paymentMethods?.flooz?.phone || currentUser.phone || "Coordonnées dans votre profil"}</p>
                    <p>• Wave : {currentUser.paymentMethods?.wave?.phone || currentUser.phone || "Disponible"}</p>
                  </div>
                </div>

                <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 mt-4">
                  Aperçu conforme OHADA & DGI avec calculs exacts en entiers FCFA
                </p>
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="px-6 py-4 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Total à émettre :{" "}
              <span className="font-extrabold text-base text-slate-900 dark:text-white tabular-nums">
                {formatFCFA(totalTTC)}
              </span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleSave("draft")}
                className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 rounded-xl transition-all duration-150"
              >
                Enregistrer brouillon
              </button>

              <button
                type="button"
                onClick={() => handleSave("sent")}
                className="flex-1 sm:flex-none px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all duration-200"
              >
                <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                <span>Émettre & Envoyer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

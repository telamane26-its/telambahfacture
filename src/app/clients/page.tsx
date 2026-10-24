"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  Building2,
  Edit2,
  Trash2,
  FileText,
  FilePlus,
  ArrowUpRight,
  X,
  Check,
  AlertTriangle,
  Smartphone,
  ShieldCheck,
  Briefcase,
  MoreVertical,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useData } from "@/lib/data-context";
import { formatFCFA } from "@/lib/utils";
import { Client } from "@/types";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { ClientsSkeleton } from "@/components/clients/ClientsSkeleton";

const AVATAR_COLORS = [
  "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
];

export default function ClientsPage() {
  const { clients, invoices, addClient, updateClient, deleteClient, isLoading } = useData();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [openOptionsDropdownId, setOpenOptionsDropdownId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingClientId, setEditingClientId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    city: "",
    country: "Sénégal",
    taxId: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Delete State
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  // Convert clients dictionary to array
  const clientList = useMemo(() => Object.values(clients), [clients]);

  // Client invoice metrics
  const clientStats = useMemo(() => {
    const stats: Record<string, { count: number; total: number }> = {};
    clientList.forEach((c) => {
      stats[c.id] = { count: 0, total: 0 };
    });

    invoices.forEach((inv) => {
      const cId = inv.client.id;
      if (!stats[cId]) {
        stats[cId] = { count: 0, total: 0 };
      }
      stats[cId].count += 1;
      stats[cId].total += inv.total;
    });

    return stats;
  }, [clientList, invoices]);

  // Countries for filter
  const countries = useMemo(() => {
    const set = new Set<string>();
    clientList.forEach((c) => {
      if (c.country) set.add(c.country);
    });
    return Array.from(set);
  }, [clientList]);

  // Filtered clients
  const filteredClients = useMemo(() => {
    return clientList.filter((client) => {
      // Country filter
      if (selectedCountry !== "all" && client.country !== selectedCountry) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = client.name.toLowerCase().includes(q);
        const matchContact = client.contactPerson.toLowerCase().includes(q);
        const matchEmail = client.email.toLowerCase().includes(q);
        const matchCity = client.city.toLowerCase().includes(q);
        const matchPhone = client.phone.toLowerCase().includes(q);
        const matchTax = client.taxId?.toLowerCase().includes(q);
        return matchName || matchContact || matchEmail || matchCity || matchPhone || matchTax;
      }
      return true;
    });
  }, [clientList, selectedCountry, searchQuery]);

  // KPI calculations
  const totalVolume = useMemo(() => {
    return invoices.reduce((acc, inv) => acc + inv.total, 0);
  }, [invoices]);

  const citiesCount = useMemo(() => {
    const set = new Set<string>();
    clientList.forEach((c) => {
      if (c.city) set.add(c.city);
    });
    return set.size;
  }, [clientList]);

  // Handlers
  const handleOpenCreateModal = () => {
    setModalMode("create");
    setEditingClientId(null);
    setFormData({
      name: "",
      contactPerson: "",
      email: "",
      phone: "+221 ",
      city: "",
      country: "Sénégal",
      taxId: "",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (client: Client) => {
    setModalMode("edit");
    setEditingClientId(client.id);
    setFormData({
      name: client.name,
      contactPerson: client.contactPerson || "",
      email: client.email || "",
      phone: client.phone || "",
      city: client.city || "",
      country: client.country || "Sénégal",
      taxId: client.taxId || "",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = "Le nom de l'entreprise ou du client est requis";
    }
    if (!formData.email.trim()) {
      errors.email = "L'adresse email est requise";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Format d'email invalide";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Le numéro de téléphone est requis";
    }
    if (!formData.city.trim()) {
      errors.city = "La ville ou adresse est requise";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (modalMode === "create") {
      addClient({
        name: formData.name.trim(),
        contactPerson: formData.contactPerson.trim() || formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        country: formData.country.trim(),
        taxId: formData.taxId.trim() || undefined,
      });
    } else if (modalMode === "edit" && editingClientId) {
      updateClient(editingClientId, {
        name: formData.name.trim(),
        contactPerson: formData.contactPerson.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        country: formData.country.trim(),
        taxId: formData.taxId.trim() || undefined,
      });
    }

    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (clientToDelete) {
      deleteClient(clientToDelete.id);
      setClientToDelete(null);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0F1117] text-slate-900 dark:text-slate-100 flex">
        {/* 1. Desktop Sidebar */}
      <Sidebar currentPath="/clients" />

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
              Clients
            </span>
          </div>

          {isLoading ? (
            <ClientsSkeleton />
          ) : (
            <>
              {/* Hero Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-700/60">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                  Répertoire Clients
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60">
                  {clientList.length} clients
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Centralisez vos informations partenaires, identifiants fiscaux et coordonnées de facturation.
              </p>
            </div>

            {/* Action CTA */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="group h-10 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-xl shadow-xs flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
                <span>Nouveau client</span>
              </button>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Total Entreprises
                </p>
                <p className="text-2xl font-bold font-sans text-slate-900 dark:text-white mt-1">
                  {clientList.length}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
                  Partenaires enregistrés
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Factures Liées
                </p>
                <p className="text-2xl font-bold font-sans text-slate-900 dark:text-white mt-1">
                  {invoices.length}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  Dossiers en cours
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white">
                <FileText className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Volume Facturé
                </p>
                <p className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
                  {formatFCFA(totalVolume)}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
                  Zone UEMOA / CEMAC
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Villes Couvertes
                </p>
                <p className="text-2xl font-bold font-sans text-slate-900 dark:text-white mt-1">
                  {citiesCount}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  Dakar, Abidjan, etc.
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <MapPin className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/60 shadow-card">
            {/* Search and Filters */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700/60 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Search */}
                <div className="relative flex items-center max-w-md w-full group">
                  <Search className="w-4 h-4 text-slate-400 group-hover:text-brand-500 absolute left-3 pointer-events-none transition-colors" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, email, contact, ville, NIF OTR, NINEA..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100/70 dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl border border-slate-200 dark:border-slate-600 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/15 transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Country filter */}
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    Pays :
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-xl focus:border-brand-500 focus:outline-none"
                  >
                    <option value="all">Tous les pays</option>
                    {countries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400">
                {filteredClients.length} client(s) trouvé(s)
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto min-h-[300px] pb-28">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/70 dark:bg-slate-700/30 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700/60 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Client / Entreprise</th>
                    <th className="py-3 px-4">Contact Référent</th>
                    <th className="py-3 px-4">Coordonnées</th>
                    <th className="py-3 px-4">Localisation & NIF</th>
                    <th className="py-3 px-4 text-right">Facturation</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-slate-500">
                        <Users className="w-8 h-8 mx-auto mb-2 stroke-1 opacity-50" />
                        <p className="font-semibold text-sm">Aucun client trouvé</p>
                        <p className="text-xs mt-0.5">Essayez de modifier votre recherche ou ajoutez un nouveau partenaire.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map((client, index) => {
                      const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length];
                      const stats = clientStats[client.id] || { count: 0, total: 0 };

                      return (
                        <tr
                          key={client.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors group"
                        >
                          {/* Client / Entreprise */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs border ${colorClass}`}
                              >
                                {client.avatarInitials || client.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white block group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                  {client.name}
                                </span>
                                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                                  ID: {client.id}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Contact Référent */}
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                              {client.contactPerson}
                            </span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3" />
                              Gestionnaire de compte
                            </span>
                          </td>

                          {/* Coordonnées */}
                          <td className="py-3.5 px-4 space-y-1">
                            <a
                              href={`mailto:${client.email}`}
                              className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1.5 transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <span>{client.email}</span>
                            </a>
                            <a
                              href={`tel:${client.phone}`}
                              className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1.5 font-mono text-[11px] transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{client.phone}</span>
                            </a>
                          </td>

                          {/* Localisation & NIF */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                              <span>
                                {client.city}, {client.country}
                              </span>
                            </div>
                            {client.taxId ? (
                              <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-600">
                                {client.taxId}
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">
                                Aucun NIF
                              </span>
                            )}
                          </td>

                          {/* Facturation */}
                          <td className="py-3.5 px-4 text-right">
                            <span className="font-mono font-bold text-slate-900 dark:text-white block tabular-nums">
                              {formatFCFA(stats.total)}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              {stats.count} facture{stats.count > 1 ? "s" : ""}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center justify-center gap-1.5 relative">
                              {/* Create Invoice for this client */}
                              <Link
                                href={`/invoices/new?clientId=${client.id}`}
                                title="Créer une facture pour ce client"
                                className="p-1.5 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/50 rounded-lg transition-all"
                              >
                                <FilePlus className="w-4 h-4" />
                              </Link>

                              {/* Edit Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(client)}
                                title="Modifier les informations"
                                className="p-1.5 text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-lg transition-all cursor-pointer"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              {/* Direct Delete Button */}
                              <button
                                type="button"
                                onClick={() => setClientToDelete(client)}
                                title="Supprimer ce client"
                                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-all cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              {/* Options Dropdown Menu (3-dots) */}
                              <div className={`relative ${openOptionsDropdownId === client.id ? "z-50" : ""}`}>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenOptionsDropdownId(
                                      openOptionsDropdownId === client.id ? null : client.id
                                    )
                                  }
                                  title="Options du client"
                                  aria-label="Options du client"
                                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                                    openOptionsDropdownId === client.id
                                      ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white"
                                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                                  }`}
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>

                                {openOptionsDropdownId === client.id && (
                                  <>
                                    <div
                                      className="fixed inset-0 z-40"
                                      onClick={() => setOpenOptionsDropdownId(null)}
                                    />
                                    <div className="absolute right-0 top-full mt-1.5 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in-50 zoom-in-95 duration-150">
                                      <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                        Options client :
                                      </div>
                                      <Link
                                        href={`/invoices/new?clientId=${client.id}`}
                                        onClick={() => setOpenOptionsDropdownId(null)}
                                        className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
                                      >
                                        <FilePlus className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                                        <span>Créer une facture</span>
                                      </Link>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setOpenOptionsDropdownId(null);
                                          handleOpenEditModal(client);
                                        }}
                                        className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
                                      >
                                        <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                                        <span>Modifier les informations</span>
                                      </button>
                                      <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setOpenOptionsDropdownId(null);
                                          setClientToDelete(client);
                                        }}
                                        className="w-full text-left px-3.5 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 transition-colors cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                        <span>Supprimer le client</span>
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredClients.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <p className="font-semibold">Aucun client trouvé</p>
                </div>
              ) : (
                filteredClients.map((client, index) => {
                  const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length];
                  const stats = clientStats[client.id] || { count: 0, total: 0 };

                  return (
                    <div key={client.id} className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs border ${colorClass}`}
                          >
                            {client.avatarInitials || client.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                              {client.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {client.contactPerson}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                            {formatFCFA(stats.total)}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {stats.count} fact.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 dark:border-slate-700/60">
                        <div className="space-y-1">
                          <p className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span className="truncate">{client.email}</span>
                          </p>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{client.phone}</span>
                          </p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-slate-600 dark:text-slate-300 font-medium text-[11px]">
                            {client.city}, {client.country}
                          </p>
                          {client.taxId && (
                            <span className="text-[10px] font-mono text-slate-400 block truncate">
                              {client.taxId}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <Link
                          href={`/invoices/new?clientId=${client.id}`}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg flex items-center gap-1.5 transition-colors"
                        >
                          <FilePlus className="w-3.5 h-3.5" />
                          <span>Facturer</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(client)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center gap-1.5"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Modifier</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setClientToDelete(client)}
                          className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </main>
      </div>

      {/* 3. Mobile Navigation */}
      <MobileBottomNav />

      {/* 4. Create / Edit Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-lg w-full p-6 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white">
                    {modalMode === "create" ? "Ajouter un nouveau client" : "Modifier le client"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {modalMode === "create"
                      ? "Remplissez les informations du partenaire commercial."
                      : "Mettez à jour les coordonnées et identifiants fiscaux."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nom de l&apos;entreprise ou du client <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="ex: Sonatel Orange, SODECI, Baobab SARL..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                />
                {formErrors.name && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{formErrors.name}</p>
                )}
              </div>

              {/* Contact Person */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Personne de contact / Interlocuteur
                </label>
                <input
                  type="text"
                  placeholder="ex: Mamadou Sylla, Clarisse Kouamé..."
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email professionnel <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="contact@entreprise.sn"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                  />
                  {formErrors.email && (
                    <p className="text-xs text-rose-500 mt-1 font-medium">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Téléphone (Mobile Money / WhatsApp) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="+221 77 654 32 10"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                  />
                  {formErrors.phone && (
                    <p className="text-xs text-rose-500 mt-1 font-medium">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* City / Address & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ville ou Adresse <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Dakar - Plateau, Abidjan..."
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                  />
                  {formErrors.city && (
                    <p className="text-xs text-rose-500 mt-1 font-medium">{formErrors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Pays
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 font-semibold"
                  >
                    <option value="Togo">Togo 🇹🇬 (TG)</option>
                    <option value="Côte d'Ivoire">Côte d&apos;Ivoire 🇨🇮 (CI)</option>
                    <option value="Sénégal">Sénégal 🇸🇳 (SN)</option>
                    <option value="Bénin">Bénin 🇧🇯 (BJ)</option>
                    <option value="Cameroun">Cameroun 🇨🇲 (CM)</option>
                    <option value="Burkina Faso">Burkina Faso 🇧🇫 (BF)</option>
                    <option value="Mali">Mali 🇲🇱 (ML)</option>
                    <option value="Gabon">Gabon 🇬🇦 (GA)</option>
                    <option value="Congo">Congo 🇨🇬 (CG)</option>
                  </select>
                </div>
              </div>

              {/* Tax ID */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Numéro fiscal (NIF OTR, NINEA, NCC, IFU, NIU) — Optionnel
                </label>
                <input
                  type="text"
                  placeholder="ex: TG-NIF-100234891-OTR ou CI-NCC-1823902-K"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Ce numéro apparaîtra automatiquement sur toutes les factures officielles adressées à ce client.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-xl shadow-xs transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  {modalMode === "create" ? "Créer le client" : "Enregistrer les modifications"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Reusable Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(clientToDelete)}
        onClose={() => setClientToDelete(null)}
        onConfirm={confirmDelete}
        title="Supprimer le client ?"
        description={
          clientToDelete
            ? `Êtes-vous sûr de vouloir supprimer définitivement « ${clientToDelete.name} » de votre répertoire ? Cette action est irréversible.${
                clientStats[clientToDelete.id]?.count > 0
                  ? ` Attention : ce client a actuellement ${clientStats[clientToDelete.id].count} facture(s) enregistrée(s).`
                  : ""
              }`
            : ""
        }
        confirmLabel="Oui, supprimer le client"
        cancelLabel="Annuler"
        isDestructive={true}
      />
    </div>
    </AuthGuard>
  );
}

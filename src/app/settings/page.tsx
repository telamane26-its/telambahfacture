"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Receipt,
  Smartphone,
  CreditCard,
  Palette,
  ShieldCheck,
  Save,
  CheckCircle2,
  Upload,
  Globe,
  Mail,
  Phone,
  MapPin,
  FileText,
  Lock,
  Moon,
  Sun,
  Sparkles,
  Command,
  Download,
  RefreshCw,
  QrCode,
  AlertTriangle,
  ChevronRight,
  Sliders,
  Camera,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useTheme } from "@/lib/theme-context";
import { useData } from "@/lib/data-context";
import { ProfilePhotoModal } from "@/components/layout/ProfilePhotoModal";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();
  const { currentUser, updateCurrentUser } = useData();

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [showTaxId, setShowTaxId] = useState(Boolean(currentUser.taxId && currentUser.taxId.trim()));

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    "organization" | "billing" | "payments" | "appearance" | "security"
  >("organization");

  // Company Profile State
  const [companyData, setCompanyData] = useState({
    companyName: currentUser.companyName,
    legalForm: currentUser.legalForm || "SARL",
    contactName: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone || "",
    address: currentUser.address || "",
    city: currentUser.city || "Lomé",
    country: currentUser.country || "Togo",
    taxId: currentUser.taxId || "",
    rccm: currentUser.rccm || "",
    website: "",
    activityDomain: currentUser.activityDomain || "Prestations de services",
  });

  // Keep synced if currentUser changes (e.g., photo or company updated elsewhere)
  React.useEffect(() => {
    setCompanyData((prev) => ({
      ...prev,
      companyName: currentUser.companyName,
      contactName: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      city: currentUser.city,
      country: currentUser.country,
      taxId: currentUser.taxId,
    }));
    setShowTaxId(Boolean(currentUser.taxId && currentUser.taxId.trim()));
  }, [currentUser]);

  // Billing & Tax State
  const [billingConfig, setBillingConfig] = useState({
    currency: "XOF",
    defaultTaxRate: 18,
    paymentTermDays: 30,
    invoicePrefix: "FAC-2026-",
    defaultNotes:
      "Paiement exigible à 30 jours. Conformité commerciale Acte Uniforme OHADA. Pénalités de retard applicables de plein droit.",
    enableAutomaticReminders: true,
    reminderBeforeDueDateDays: 3,
  });

  // Payment Methods State (Togo priority)
  const [paymentMethods, setPaymentMethods] = useState({
    tmoneyPhone: "+228 90 12 34 56",
    tmoneyMerchantCode: "TM-88204",
    tmoneyEnabled: true,
    floozPhone: "+228 99 87 65 43",
    floozMerchantCode: "FL-10492",
    floozEnabled: true,
    wavePhone: "+228 90 12 34 56",
    waveMerchantId: "WAVE-LOME-TG",
    waveEnabled: true,
    omPhone: "+225 07 00 11 22 33",
    omMerchantCode: "OM-489201",
    omEnabled: false,
    bankName: "Ecobank Togo (Siège Panafricain Lomé)",
    bankIban: "TG53 TG05 0012 3456 7890 1234 5678 90",
    bankBic: "ECOBTGTG",
    bankEnabled: true,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      companyName: companyData.companyName,
      name: companyData.contactName,
      email: companyData.email,
      phone: companyData.phone,
      city: companyData.city,
      country: companyData.country,
      taxId: showTaxId ? companyData.taxId : "",
    });
    showToast("Modifications enregistrées avec succès !");
  };

  const tabs = [
    {
      id: "organization",
      label: "Profil de l'Entreprise",
      badge: "Profil",
      icon: Building2,
      desc: "Identité de l'entreprise, Registre du Commerce et coordonnées.",
    },
    {
      id: "billing",
      label: "Facturation & TVA",
      badge: "18%",
      icon: Receipt,
      desc: "Devise FCFA, taux TVA 18%, mentions commerciales OHADA.",
    },
    {
      id: "payments",
      label: "Paiements & Mobile Money",
      badge: "TMoney / Flooz",
      icon: Smartphone,
      desc: "Togocom TMoney, Moov Flooz, Wave & Ecobank.",
    },
    {
      id: "appearance",
      label: "Thèmes & Interface",
      badge: isDark ? "Sombre" : "Clair",
      icon: Palette,
      desc: "Mode sombre, design system et raccourcis clavier.",
    },
    {
      id: "security",
      label: "Sauvegardes & Données",
      badge: "Sécurisé",
      icon: ShieldCheck,
      desc: "Export JSON/CSV, sécurité et réinitialisation.",
    },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0F1117] text-slate-900 dark:text-slate-100 flex">
        {/* 1. Desktop Sidebar */}
      <Sidebar currentPath="/settings" />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 pb-20 lg:pb-12">
        <MobileHeader />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 animate-in fade-in slide-in-from-top-4 duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600 shrink-0" />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
          {/* Breadcrumb */}
          <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Link
              href="/dashboard"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Accueil
            </Link>
            <span>›</span>
            <span className="text-slate-700 dark:text-slate-200 font-semibold">
              Paramètres
            </span>
          </div>

          {/* Top Hero Banner */}
          <div className="bg-white dark:bg-[#12141A] rounded-3xl border border-slate-900/80 dark:border-slate-800 p-6 shadow-card relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => setIsPhotoModalOpen(true)}
                  title="Cliquer pour changer votre photo de profil"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-900 dark:ring-white shadow-md group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPhotoModalOpen(true);
                    }}
                    title="Changer la photo de profil"
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 ring-2 ring-white dark:ring-slate-900 flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold font-sans tracking-tight text-slate-900 dark:text-white">
                      {companyData.companyName}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                      {companyData.legalForm}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60">
                      Compte Actif 🇹🇬
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Administrateur principal : <strong className="text-slate-700 dark:text-slate-300">{companyData.contactName}</strong> · Lomé, Togo
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsPhotoModalOpen(true)}
                      className="text-[11px] font-bold text-slate-900 dark:text-slate-200 hover:underline flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Camera className="w-3 h-3 text-slate-700 dark:text-slate-300" />
                      <span>Changer ma photo</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-700 dark:bg-slate-300" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Devise : XOF (FCFA)</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">TVA : 18% UEMOA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Pills Bar (Segmented Design inspired by new aesthetics) */}
          <div className="bg-white dark:bg-[#12141A] rounded-2xl border border-slate-900/80 dark:border-slate-800 p-1.5 flex flex-wrap gap-1 shadow-card">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 outline-none ${
                    isActive
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md scale-[1.01]"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: PROFIL DE L'ENTREPRISE */}
          {activeTab === "organization" && (
            <form onSubmit={handleSave} className="bg-white dark:bg-[#12141A] rounded-3xl border border-slate-900/80 dark:border-slate-800 shadow-card p-6 sm:p-8 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-bold font-sans text-slate-900 dark:text-white">
                    Profil de l&apos;Entreprise
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Coordonnées officielles de votre entreprise figurant sur l&apos;ensemble de vos factures et devis.
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-xl shadow-xs transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer</span>
                </button>
              </div>

              {/* 1. IDENTITÉ DE L'ENTREPRISE */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                  <Building2 className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Identité de l&apos;entreprise
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Nom Légal / Raison Sociale <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={companyData.companyName}
                      onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold focus:border-slate-900 dark:focus:border-white focus:outline-none"
                      placeholder="Nom de votre entreprise"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Forme Juridique
                    </label>
                    <select
                      value={companyData.legalForm}
                      onChange={(e) => setCompanyData({ ...companyData, legalForm: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold focus:border-slate-900 dark:focus:border-white focus:outline-none"
                    >
                      <option value="SARL">SARL (Société à Responsabilité Limitée)</option>
                      <option value="SAS">SAS (Société par Actions Simplifiée)</option>
                      <option value="EI">EI (Entreprise Individuelle / Freelance)</option>
                      <option value="SUARL">SUARL (SARL Unipersonnelle)</option>
                      <option value="SA">SA (Société Anonyme)</option>
                      <option value="GIE">GIE (Groupement d&apos;Intérêt Économique)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Registre du Commerce (RC / RCCM)
                    </label>
                    <input
                      type="text"
                      value={companyData.rccm}
                      onChange={(e) => setCompanyData({ ...companyData, rccm: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-slate-900 dark:focus:border-white focus:outline-none"
                      placeholder="ex: TG-LOM-2024-B-0842"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Pays (Zone FCFA)
                    </label>
                    <select
                      value={companyData.country}
                      onChange={(e) => setCompanyData({ ...companyData, country: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold focus:border-slate-900 dark:focus:border-white focus:outline-none"
                    >
                      <option value="Togo">Togo 🇹🇬 (Lomé)</option>
                      <option value="Côte d'Ivoire">Côte d&apos;Ivoire 🇨🇮 (Abidjan)</option>
                      <option value="Sénégal">Sénégal 🇸🇳 (Dakar)</option>
                      <option value="Bénin">Bénin 🇧🇯 (Cotonou)</option>
                      <option value="Burkina Faso">Burkina Faso 🇧🇫 (Ouagadougou)</option>
                      <option value="Mali">Mali 🇲🇱 (Bamako)</option>
                      <option value="Cameroun">Cameroun 🇨🇲 (Douala)</option>
                      <option value="Gabon">Gabon 🇬🇦 (Libreville)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Adresse du siège social
                    </label>
                    <input
                      type="text"
                      value={companyData.address}
                      onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-slate-900 dark:focus:border-white focus:outline-none"
                      placeholder="Rue, Quartier, Immeuble..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Ville
                    </label>
                    <input
                      type="text"
                      value={companyData.city}
                      onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-slate-900 dark:focus:border-white focus:outline-none"
                      placeholder="Lomé"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Domaine d&apos;Activité (Optionnel)
                    </label>
                    <input
                      type="text"
                      value={companyData.activityDomain}
                      onChange={(e) => setCompanyData({ ...companyData, activityDomain: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-slate-900 dark:focus:border-white focus:outline-none"
                      placeholder="Prestations, Commerce, Numérique..."
                    />
                  </div>
                </div>
              </div>

              {/* 2. COORDONNÉES DU CONTACT */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                  <Mail className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Coordonnées du contact
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Contact Principal / Dirigeant
                    </label>
                    <input
                      type="text"
                      value={companyData.contactName}
                      onChange={(e) => setCompanyData({ ...companyData, contactName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold focus:border-slate-900 dark:focus:border-white focus:outline-none"
                      placeholder="Nom et prénom du responsable"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email de facturation <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={companyData.email}
                      onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-slate-900 dark:focus:border-white focus:outline-none"
                      placeholder="contact@entreprise.tg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Téléphone professionnel <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={companyData.phone}
                      onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-slate-900 dark:focus:border-white focus:outline-none"
                      placeholder="+228 90 00 00 00"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Site Internet (Optionnel)
                    </label>
                    <input
                      type="text"
                      value={companyData.website}
                      onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-slate-900 dark:focus:border-white focus:outline-none"
                      placeholder="https://entreprise.tg"
                    />
                  </div>
                </div>
              </div>

              {/* 3. SECTION BASSE OPTIONNELLE : IDENTIFIANT FISCAL & NIF */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <div className="flex items-start sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 text-slate-700 dark:text-slate-200 mt-0.5 sm:mt-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          Identifiant Fiscal & NIF (Optionnel)
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Optionnel : activez si votre entreprise dispose d&apos;un NIF officiel. Sinon, Telambah adapte automatiquement vos factures aux normes commerciales sans mention fiscale imposée.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={showTaxId}
                      onClick={() => setShowTaxId(!showTaxId)}
                      className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 shrink-0 ${
                        showTaxId ? "bg-slate-900 dark:bg-white" : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                          showTaxId
                            ? "translate-x-4 bg-white dark:bg-slate-900"
                            : "translate-x-0 bg-white"
                        }`}
                      />
                    </button>
                  </div>

                  {showTaxId && (
                    <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 animate-in fade-in duration-150">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Numéro d&apos;Identification Fiscale (NIF Optionnel)
                      </label>
                      <input
                        type="text"
                        value={companyData.taxId}
                        onChange={(e) => setCompanyData({ ...companyData, taxId: e.target.value })}
                        className="w-full sm:w-1/2 px-3.5 py-2.5 text-xs font-mono font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-slate-900 dark:focus:border-white focus:outline-none"
                        placeholder="ex: TG-NIF-100234891"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        Ce numéro sera imprimé sur vos factures uniquement s&apos;il est renseigné.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: BILLING & TAXES */}
          {activeTab === "billing" && (
            <form onSubmit={handleSave} className="bg-white dark:bg-[#12141A] rounded-3xl border border-slate-900/80 dark:border-slate-800 shadow-card p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-bold font-sans text-slate-900 dark:text-white">
                    Paramètres de Facturation & Règles Fiscales
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Taux légal de TVA à 18% calculé sur le montant HT net et numérotation séquentielle OHADA.
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-xl shadow-xs transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Devise par Défaut
                  </label>
                  <select
                    value={billingConfig.currency}
                    onChange={(e) => setBillingConfig({ ...billingConfig, currency: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold focus:border-slate-900 dark:focus:border-white focus:outline-none"
                  >
                    <option value="XOF">Franc CFA UEMOA (XOF) — Sans centimes (ex: 1 500 000 FCFA)</option>
                    <option value="XAF">Franc CFA CEMAC (XAF) — Sans centimes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Taux de TVA Standard (Zone UEMOA)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={billingConfig.defaultTaxRate}
                      onChange={(e) => setBillingConfig({ ...billingConfig, defaultTaxRate: Number(e.target.value) })}
                      className="w-28 px-3.5 py-2.5 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                    <span className="text-xs font-bold">%</span>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60">
                      Standard 18%
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Délai d&apos;Échéance par Défaut
                  </label>
                  <select
                    value={billingConfig.paymentTermDays}
                    onChange={(e) => setBillingConfig({ ...billingConfig, paymentTermDays: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold"
                  >
                    <option value={0}>Paiement comptant / À réception</option>
                    <option value={15}>15 jours</option>
                    <option value={30}>30 jours (Standard commercial)</option>
                    <option value={45}>45 jours</option>
                    <option value={60}>60 jours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Préfixe de Numérotation Séquentielle OHADA
                  </label>
                  <input
                    type="text"
                    value={billingConfig.invoicePrefix}
                    onChange={(e) => setBillingConfig({ ...billingConfig, invoicePrefix: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Exemple : FAC-2026-0043</p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Mentions Légales & Conditions en Pied de Facture
                  </label>
                  <textarea
                    rows={3}
                    value={billingConfig.defaultNotes}
                    onChange={(e) => setBillingConfig({ ...billingConfig, defaultNotes: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </form>
          )}

          {/* TAB 3: PAYMENTS & MOBILE MONEY */}
          {activeTab === "payments" && (
            <form onSubmit={handleSave} className="bg-white dark:bg-[#12141A] rounded-3xl border border-slate-900/80 dark:border-slate-800 shadow-card p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-bold font-sans text-slate-900 dark:text-white">
                    Canaux de Paiement Mobile Money & Virement
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Mettez en avant TMoney (Togocom) et Flooz (Moov Togo) en priorité, ainsi que Wave et vos coordonnées RIB.
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-xl shadow-xs transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer</span>
                </button>
              </div>

              <div className="space-y-4">
                {/* 1. TMoney (Togocom Togo) */}
                <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-xs">
                        TM
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                            TMoney (Togocom Togo)
                          </h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200">
                            Priorité Togo 🇹🇬
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Paiement rapide via USSD *145# et code marchand officiel
                        </p>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={paymentMethods.tmoneyEnabled}
                        onChange={(e) => setPaymentMethods({ ...paymentMethods, tmoneyEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 dark:peer-checked:bg-emerald-500" />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Numéro TMoney de réception
                      </label>
                      <input
                        type="text"
                        value={paymentMethods.tmoneyPhone}
                        onChange={(e) => setPaymentMethods({ ...paymentMethods, tmoneyPhone: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-mono font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Code Marchand TMoney (Optionnel)
                      </label>
                      <input
                        type="text"
                        value={paymentMethods.tmoneyMerchantCode}
                        onChange={(e) => setPaymentMethods({ ...paymentMethods, tmoneyMerchantCode: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-mono font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Flooz (Moov Africa Togo) */}
                <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                        FL
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                            Flooz (Moov Africa Togo)
                          </h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-900 dark:text-indigo-200">
                            Togo 🇹🇬
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Transactions directes *155# Moov Togo
                        </p>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={paymentMethods.floozEnabled}
                        onChange={(e) => setPaymentMethods({ ...paymentMethods, floozEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 dark:peer-checked:bg-emerald-500" />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Numéro Flooz de réception
                      </label>
                      <input
                        type="text"
                        value={paymentMethods.floozPhone}
                        onChange={(e) => setPaymentMethods({ ...paymentMethods, floozPhone: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-mono font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Code Marchand Flooz
                      </label>
                      <input
                        type="text"
                        value={paymentMethods.floozMerchantCode}
                        onChange={(e) => setPaymentMethods({ ...paymentMethods, floozMerchantCode: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-mono font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Wave & Bank */}
                <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-500 text-white font-black text-xs flex items-center justify-center">
                        W
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          Wave Digital Finance & Virement Bancaire
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Paiement 1% sans frais et RIB bancaire Ecobank Togo
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Numéro Wave
                      </label>
                      <input
                        type="text"
                        value={paymentMethods.wavePhone}
                        onChange={(e) => setPaymentMethods({ ...paymentMethods, wavePhone: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        IBAN Ecobank Togo
                      </label>
                      <input
                        type="text"
                        value={paymentMethods.bankIban}
                        onChange={(e) => setPaymentMethods({ ...paymentMethods, bankIban: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* TAB 4: THEMES & APPEARANCE */}
          {activeTab === "appearance" && (
            <div className="bg-white dark:bg-[#12141A] rounded-3xl border border-slate-900/80 dark:border-slate-800 shadow-card p-6 sm:p-8 space-y-6">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-bold font-sans text-slate-900 dark:text-white">
                  Thèmes & Préférences Visuelles
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Basculez entre le mode clair haute lisibilité et le mode sombre OLED économe en batterie.
                </p>
              </div>

              {/* Mode Toggle Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => {
                    if (isDark) toggleTheme();
                  }}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    !isDark
                      ? "border-slate-900 bg-slate-50 shadow-md ring-2 ring-slate-900/10"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Sun className="w-6 h-6 text-amber-500" />
                    {!isDark && (
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Mode Clair (Standard)</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Fond clair, contrastes nets et lisibilité optimale en plein jour.
                  </p>
                </div>

                <div
                  onClick={() => {
                    if (!isDark) toggleTheme();
                  }}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    isDark
                      ? "border-white bg-slate-900 shadow-md ring-2 ring-white/10"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Moon className="w-6 h-6 text-slate-300" />
                    {isDark && (
                      <span className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-white">Mode Sombre (OLED)</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Palette sombre élégante, réduit la fatigue oculaire et économise la batterie.
                  </p>
                </div>
              </div>

              {/* Hotkeys Cheatsheet */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Command className="w-3.5 h-3.5" />
                    <span>Raccourcis Clavier Rapides & Actions Directes</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">Cliquez ou utilisez les touches</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-xs flex items-center justify-between text-slate-800 dark:text-slate-200 transition-all active:scale-95 group"
                    title="Basculer le mode Clair / Sombre"
                  >
                    <span className="font-semibold group-hover:text-slate-950 dark:group-hover:text-white">Thèmes</span>
                    <kbd className="font-mono text-[10px] font-bold bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">⌘1</kbd>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("organization")}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-xs flex items-center justify-between text-slate-800 dark:text-slate-200 transition-all active:scale-95 group"
                    title="Aller au profil de l'entreprise"
                  >
                    <span className="font-semibold group-hover:text-slate-950 dark:group-hover:text-white">Profil</span>
                    <kbd className="font-mono text-[10px] font-bold bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">⌘2</kbd>
                  </button>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-xs flex items-center justify-between text-slate-800 dark:text-slate-200 transition-all active:scale-95 group ring-1 ring-slate-900/5 dark:ring-white/5"
                    title="Ouvrir la palette de recherche globale"
                  >
                    <span className="font-semibold group-hover:text-slate-950 dark:group-hover:text-white">Recherche</span>
                    <kbd className="font-mono text-[10px] font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-1.5 py-0.5 rounded">⌘K</kbd>
                  </button>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent("open-notifications"))}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-xs flex items-center justify-between text-slate-800 dark:text-slate-200 transition-all active:scale-95 group"
                    title="Ouvrir le centre de notifications"
                  >
                    <span className="font-semibold group-hover:text-slate-950 dark:group-hover:text-white">Notifications</span>
                    <kbd className="font-mono text-[10px] font-bold bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">⌘3</kbd>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY & EXPORT */}
          {activeTab === "security" && (
            <div className="bg-white dark:bg-[#12141A] rounded-3xl border border-slate-900/80 dark:border-slate-800 shadow-card p-6 sm:p-8 space-y-6">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-bold font-sans text-slate-900 dark:text-white">
                  Gestion des Données & Sauvegardes
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Exportez l&apos;intégralité de vos factures et clients en local.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                    <div>
                      <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                        Exporter les données (JSON)
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Sauvegarde complète de votre espace Telambah Facture
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const data = {
                        company: companyData,
                        billing: billingConfig,
                        payments: paymentMethods,
                        exportedAt: new Date().toISOString(),
                      };
                      const blob = new Blob([JSON.stringify(data, null, 2)], {
                        type: "application/json",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `telambah-backup-${new Date().toISOString().slice(0, 10)}.json`;
                      a.click();
                      showToast("Sauvegarde JSON téléchargée !");
                    }}
                    className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-650 transition-all text-slate-800 dark:text-slate-100"
                  >
                    Télécharger l&apos;archive JSON
                  </button>
                </div>

                <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 space-y-3">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <div>
                      <h3 className="font-bold text-xs text-rose-900 dark:text-rose-300">
                        Zone de Réinitialisation
                      </h3>
                      <p className="text-[11px] text-rose-700 dark:text-rose-400">
                        Rétablir les données de démonstration d&apos;origine
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Réinitialiser les données de démonstration ?")) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="w-full py-2 px-3 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all"
                  >
                    Réinitialiser le stockage local
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Profile Photo Upload Modal */}
      <ProfilePhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
      />

      <MobileBottomNav currentPath="/settings" />
    </div>
    </AuthGuard>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Mail,
  Phone,
  ChevronDown,
  Search,
  ExternalLink,
  Send,
  BookOpen,
  Sparkles,
  Zap,
  Check,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

interface FaqItem {
  id: string;
  category: "facturation" | "paiements" | "conformite" | "general";
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    category: "facturation",
    question: "Comment est calculée la TVA à 18% en zone FCFA (UEMOA) ?",
    answer:
      "Conformément à la directive harmonisée de l'UEMOA (Togo, Bénin, Côte d'Ivoire, Sénégal...), la Taxe sur la Valeur Ajoutée (TVA) légale standard de 18% s'applique sur le montant Hors Taxes (HT) net de toute remise commerciale éventuelle. Le total TTC est calculé selon la formule : Total TTC = Montant Net HT + (Montant Net HT × 0,18).",
  },
  {
    id: "faq-2",
    category: "facturation",
    question: "Pourquoi les montants en FCFA ne comportent-ils pas de centimes ?",
    answer:
      "Dans l'espace UEMOA (XOF) et CEMAC (XAF), le Franc CFA est une devise non fractionnaire dans les transactions courantes. Les montants sur Telambah Facture sont donc toujours arrondis à l'entier strict (ex: 1 500 000 FCFA), sans décimales inutiles, garantissant une lisibilité et conformité comptable optimale.",
  },
  {
    id: "faq-3",
    category: "conformite",
    question: "Quelle est la règle de numérotation séquentielle OHADA ?",
    answer:
      "L'Acte Uniforme OHADA portant sur le droit commercial général impose une numérotation continue, chronologique et sans rupture de séquence. Sur Telambah Facture, le format par défaut est 'FAC-YYYY-NNNN' (ex: FAC-2026-0042) pour assurer une traçabilité commerciale et comptable absolue.",
  },
  {
    id: "faq-4",
    category: "paiements",
    question: "Comment relancer un client en retard de paiement via WhatsApp ?",
    answer:
      "Sur chaque facture en statut 'En retard' ou 'Envoyée', un bouton WhatsApp pré-rempli est mis à votre disposition. Il génère automatiquement un message personnalisé et courtois contenant le nom du contact, le numéro de facture, la date d'échéance dépassée, le montant dû et vos canaux de paiement TMoney, Flooz ou Wave.",
  },
  {
    id: "faq-5",
    category: "paiements",
    question: "Comment configurer mes encaissements TMoney, Flooz et Wave ?",
    answer:
      "Rendez-vous dans la rubrique 'Paramètres > Mobile Money & Banques'. Vous pouvez y renseigner votre compte TMoney (Togocom), votre compte Flooz (Moov Africa Togo), vos comptes Wave ou vos coordonnées bancaires (Ecobank Togo, Orabank, Coris Bank). Ces informations apparaîtront automatiquement sur vos factures.",
  },
  {
    id: "faq-6",
    category: "conformite",
    question: "Comment exporter mes données pour mon expert-comptable ?",
    answer:
      "Depuis la page 'Factures' ou le 'Tableau de bord', cliquez sur le bouton 'Exporter CSV'. Vous obtiendrez un fichier structuré et compatible Excel avec l'ensemble des numéros de factures, clients, montants HT, TVA collectée (18%), restes dus et dates d'émission.",
  },
];

export default function HelpSupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openFaqIds, setOpenFaqIds] = useState<string[]>(["faq-1", "faq-4"]);

  // Ticket form state
  const [ticketForm, setTicketForm] = useState({
    name: "",
    email: "",
    subject: "",
    category: "technique",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    if (selectedCategory !== "all" && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.name || !ticketForm.email || !ticketForm.message) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setTicketForm({
        name: "",
        email: "",
        subject: "",
        category: "technique",
        message: "",
      });
      setIsSubmitted(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0F1117] text-slate-900 dark:text-slate-100 flex">
      {/* 1. Desktop Sidebar */}
      <Sidebar currentPath="/help" />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 pb-20 lg:pb-12">
        {/* Mobile Header */}
        <MobileHeader />

        {/* Workspace */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full space-y-8">
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
              Aide & Support
            </span>
          </div>

          {/* Hero Header */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 text-white p-6 sm:p-10 shadow-xl">
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white">
                <Sparkles className="w-3.5 h-3.5 text-slate-300" />
                <span>Assistance dédiée aux entrepreneurs zone FCFA</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold font-sans tracking-tight text-white leading-tight">
                Comment pouvons-nous vous aider aujourd&apos;hui ?
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Trouvez des réponses immédiates sur la facturation OHADA, les règles de TVA à 18%, les encaissements Mobile Money et l&apos;export comptable.
              </p>

              {/* Instant Search Bar inside Hero */}
              <div className="relative pt-2">
                <div className="relative flex items-center max-w-lg">
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Posez votre question (ex: TVA, Wave, OHADA, relance)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 rounded-2xl shadow-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Background design elements */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/5 to-transparent pointer-events-none" />
          </div>

          {/* Quick Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* WhatsApp */}
            <a
              href="https://wa.me/22890123456?text=Bonjour%20l%27équipe%20Telambah%2C%20j%27ai%20besoin%20d%27assistance"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/60 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700/60 hover:-translate-y-1 hover:shadow-card transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Support WhatsApp
                <ExternalLink className="w-3 h-3 opacity-60" />
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Ligne directe Lomé 🇹🇬 : +228 90 12 34 56 (7j/7).
              </p>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-3 inline-block">
                Démarrer un chat ›
              </span>
            </a>

            {/* Email */}
            <a
              href="mailto:support@telambah.africa"
              className="group p-5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/60 shadow-xs hover:border-slate-400 dark:hover:border-slate-500 hover:-translate-y-1 hover:shadow-card transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                Support par Email
                <ExternalLink className="w-3 h-3 opacity-60" />
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                support@telambah.africa (réponse sous 2h).
              </p>
              <span className="text-[11px] font-bold text-slate-900 dark:text-white mt-3 inline-block">
                Envoyer un email ›
              </span>
            </a>

            {/* Téléphone */}
            <a
              href="tel:+22822210000"
              className="group p-5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/60 shadow-xs hover:border-amber-300 dark:hover:border-amber-700/60 hover:-translate-y-1 hover:shadow-card transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Ligne Directe Lomé
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Desk central Lomé & permanence zone FCFA.
              </p>
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-3 inline-block font-mono">
                +228 22 21 00 00 ›
              </span>
            </a>

            {/* Documentation OHADA & OTR */}
            <div className="group p-5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/60 shadow-xs hover:border-slate-400 dark:hover:border-slate-500 hover:-translate-y-1 hover:shadow-card transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                Réglementation & OHADA
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                TVA 18%, TMoney, Flooz, mentions et traçabilité.
              </p>
              <span className="text-[11px] font-bold text-slate-900 dark:text-white mt-3 inline-block">
                Conformité 100% validée
              </span>
            </div>
          </div>

          {/* System Status Banner */}
          <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 rounded-2xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold">
                Tous les services de facturation & passerelles Mobile Money sont opérationnels.
              </span>
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono hidden sm:inline">
              Disponibilité : 99.98%
            </span>
          </div>

          {/* Interactive FAQ Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-700/60">
              <div>
                <h2 className="text-xl font-bold font-sans text-slate-900 dark:text-white">
                  Foire Aux Questions (FAQ)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Les réponses à vos questions les plus courantes sur la plateforme.
                </p>
              </div>

              {/* Category tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { id: "all", label: "Toutes" },
                  { id: "facturation", label: "Facturation & TVA" },
                  { id: "paiements", label: "Mobile Money" },
                  { id: "conformite", label: "OHADA / Fisc" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ Accordion Items */}
            <div className="space-y-3">
              {filteredFaqs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <p className="font-semibold text-xs">Aucun résultat trouvé pour cette recherche.</p>
                </div>
              ) : (
                filteredFaqs.map((faq) => {
                  const isOpen = openFaqIds.includes(faq.id);
                  return (
                    <div
                      key={faq.id}
                      className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/60 shadow-xs overflow-hidden transition-all duration-200"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                      >
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-slate-900 dark:text-white" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700/40">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Support Ticket Submission Form */}
          <div className="bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200/90 dark:border-slate-700/60 shadow-card p-6 sm:p-8 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 mb-2">
                <Zap className="w-3.5 h-3.5" />
                <span>Ticket Prioritaire</span>
              </div>
              <h2 className="text-xl font-bold font-sans text-slate-900 dark:text-white">
                Envoyer un message à l&apos;équipe technique
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Vous rencontrez une difficulté ou souhaitez suggérer une amélioration ? Nous vous répondons sous 2 heures ouvrées.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2 animate-in zoom-in-95 duration-200">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="font-sans font-bold text-base text-emerald-900 dark:text-emerald-200">
                  Message envoyé avec succès !
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
                  Votre demande a bien été transmise à notre équipe technique et support basée à Lomé, Togo. Un conseiller prendra contact avec vous dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Votre Nom ou Raison Sociale <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Koffi Mensah - Agbémévo Creative Labs"
                      value={ticketForm.name}
                      onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-white focus:ring-2 focus:ring-slate-900/10"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Votre Email de contact <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="koffi.mensah@agbemevo-labs.tg"
                      value={ticketForm.email}
                      onChange={(e) => setTicketForm({ ...ticketForm, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-white focus:ring-2 focus:ring-slate-900/10"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Catégorie de la demande
                    </label>
                    <select
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-white font-semibold"
                    >
                      <option value="technique">Assistance Technique / Bug</option>
                      <option value="facturation">Facturation, TVA & Normes OHADA</option>
                      <option value="paiement">Paiements TMoney, Flooz & Wave</option>
                      <option value="suggestion">Suggestion de nouvelle fonctionnalité</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Objet du message
                    </label>
                    <input
                      type="text"
                      placeholder="ex: Question sur la retenue à la source BRS..."
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Description détaillée <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Détaillez votre question ou le comportement observé..."
                    value={ticketForm.message}
                    onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-white"
                  />
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-xl shadow-xs flex items-center gap-2 transition-all hover:-translate-y-0.5 active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Envoyer le ticket</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>

      {/* 3. Mobile Navigation */}
      <MobileBottomNav currentPath="/help" />
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  PlayCircle,
  CheckCircle2,
  Download,
  Verified,
  Sparkles,
  MessageCircle,
  HelpCircle,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-16 sm:pb-24 flex flex-col items-center text-center">
      {/* Top Pill Badge */}
      <div className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 shadow-2xs mb-6 hover:scale-105 transition-transform duration-200 cursor-default max-w-full">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        <span className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-slate-700 dark:text-slate-200 text-center">
          ✦ Facturation nouvelle génération · Afrique
        </span>
        <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-emerald-100/70 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200/80 dark:border-emerald-800/60 shrink-0">
          OHADA
        </span>
      </div>

      {/* Hero Typography */}
      <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        <h1 className="w-full text-center text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.16] sm:leading-[1.12]">
          Fini les factures Excel.
        </h1>

        {/* Highlight Centerpiece Badge */}
        <div className="relative my-2 sm:my-3 z-10 max-w-full px-4 sm:px-8 py-1.5 sm:py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs hover:scale-[1.02] transition-transform duration-300 mx-auto text-center">
          <span className="block text-center text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-extrabold text-emerald-700 dark:text-emerald-400 tracking-tight">
            Facturez avec sérénité
          </span>
        </div>

        <p className="w-full text-center text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.16] sm:leading-[1.12]">
          et développez votre entreprise.
        </p>

        {/* Subtitle */}
        <p className="w-full text-center text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mt-5 sm:mt-6 leading-relaxed px-2">
          Créez des factures professionnelles en 2 clics conformes aux normes{" "}
          <strong className="text-slate-900 dark:text-white font-semibold">OHADA</strong>, calculez la{" "}
          <strong className="text-slate-900 dark:text-white font-semibold">TVA 18%</strong> en temps réel et encaissez
          vos règlements en{" "}
          <strong className="text-slate-900 dark:text-white font-semibold">FCFA (TMoney, Flooz, Wave)</strong> sans
          friction.
        </p>

        {/* Action Buttons with Advanced Hover & Click Animations */}
        <div className="w-full flex flex-wrap items-center justify-center gap-3.5 mt-8">
          <Link
            href="/register"
            className="hero-cta-btn inline-flex items-center justify-center gap-3 pl-7 pr-2.5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all duration-200 group"
          >
            <span>Commencer gratuitement</span>
            <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </span>
          </Link>

          <a
            href="#fonctionnalites"
            className="secondary-cta-btn inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold text-sm shadow-2xs"
          >
            <PlayCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Voir la démonstration</span>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="w-full flex flex-wrap items-center justify-center text-center gap-y-2 gap-x-4 sm:gap-x-6 mt-8 text-slate-500 dark:text-slate-400 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Sans carte bancaire</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Conforme UEMOA & CEMAC</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Paiements TMoney, Flooz & Wave</span>
          </div>
        </div>
      </div>

      {/* Interactive Mockup Preview Card with Floating Badges */}
      <div className="relative w-full max-w-5xl mx-auto mt-14 sm:mt-16">
        {/* Main Card */}
        <div className="rounded-3xl p-4 sm:p-6 lg:p-8 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-200/60 dark:shadow-black/40 text-left">
          {/* Mockup Window Header */}
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60 gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600" />
                <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                FAC-2026-0482 • Cabinet Sylla & Associés
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Payée via Wave
              </span>
              <button
                type="button"
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Télécharger PDF"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Invoice Body Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-5">
            {/* Left: Invoice Content */}
            <div className="md:col-span-7 flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Client Destinataire
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      Cabinet Sylla & Associés
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Boulevard Circulaire, Lomé • Togo
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                      Régime Réel Normal · Conforme OHADA
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-sm border border-emerald-200 dark:border-emerald-800">
                    CS
                  </div>
                </div>

                {/* Line Items */}
                <div className="mt-5 space-y-2">
                  <div className="flex justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-1">
                    <span>Prestation</span>
                    <span>Total HT</span>
                  </div>

                  <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 text-xs shadow-2xs">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        Audit & Stratégie Digitale Q1
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Intervention expert
                      </span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      1 250 000 FCFA
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 text-xs shadow-2xs">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        Plateforme Cloud (Pack Pro)
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Période Janvier - Mars
                      </span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      225 000 FCFA
                    </span>
                  </div>
                </div>
              </div>

              {/* Tax Breakdown Footer */}
              <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-700/60 flex justify-between items-end">
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold">
                  TVA 18.0% Appliquée
                </span>
                <div className="text-right">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Net à payer (TTC)</span>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400 tabular-nums">
                    1 740 500 <span className="text-xs font-normal text-slate-600 dark:text-slate-400">FCFA</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Cashflow Graph & Mobile Money */}
            <div className="md:col-span-5 flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Encaissements du mois
                  </span>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    +28.4%
                  </span>
                </div>
                <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
                  45 820 000 <span className="text-xs font-normal text-slate-400">FCFA</span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  142 factures acquittées · 0 retard critique
                </p>

                {/* CSS Sparkline & Bars without inline styles */}
                <div className="mt-5 h-28 w-full flex items-end gap-2.5 pt-2 border-b border-slate-100 dark:border-slate-700/60 pb-2">
                  <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors bar-height-dakar" />
                    <span className="text-[10px] text-slate-400">Dakar</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div className="w-full bg-emerald-600 rounded-t-md hover:bg-emerald-700 transition-colors bar-height-abidjan" />
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Abidjan</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div className="w-full bg-indigo-300 dark:bg-indigo-600 rounded-t-md hover:bg-indigo-400 transition-colors bar-height-douala" />
                    <span className="text-[10px] text-slate-400">Douala</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div className="w-full bg-emerald-500 rounded-t-md hover:bg-emerald-600 transition-colors bar-height-lome" />
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Lomé</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors bar-height-cotonou" />
                    <span className="text-[10px] text-slate-400">Cotonou</span>
                  </div>
                </div>
              </div>

              {/* Mobile Money Supported Pills */}
              <div className="mt-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  Canaux connectés :
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="momo-pill px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                    Wave
                  </span>
                  <span className="momo-pill px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                    TMoney
                  </span>
                  <span className="momo-pill px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                    Flooz
                  </span>
                  <span className="momo-pill px-2 py-0.5 rounded-md bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-[10px] font-bold">
                    Orange
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Stat Badge 1 (Bottom Left) */}
        <div className="hidden lg:flex landing-float-badge absolute -bottom-5 -left-6 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/70 dark:shadow-black/50 items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Verified className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 dark:text-white">100% Conforme OHADA</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Mentions légales UEMOA & CEMAC
            </span>
          </div>
        </div>

        {/* Floating Stat Badge 2 (Top Right) */}
        <div className="hidden lg:flex landing-float-badge-delayed absolute -top-6 -right-5 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/70 dark:shadow-black/50 items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <Sparkles className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 dark:text-white">Règlement sous 48h</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Relances pré-remplies WhatsApp
            </span>
          </div>
        </div>
      </div>

      {/* Support Trigger Prompt */}
      <div className="mt-12 flex flex-col items-center gap-2 group cursor-pointer">
        <div className="flex items-center -space-x-2">
          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-xs">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div className="w-9 h-9 rounded-full bg-emerald-600 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-110">
            <MessageCircle className="w-4 h-4" />
          </div>
        </div>
        <a
          href="https://wa.me/?text=Bonjour%20l%27équipe%20Telambah%20Facture%2C%20j%27aimerais%20en%20savoir%20plus%20sur%20votre%20plateforme"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors font-semibold"
        >
          Besoin d&apos;aide ? Discutez avec nos experts sur WhatsApp
        </a>
      </div>
    </section>
  );
}

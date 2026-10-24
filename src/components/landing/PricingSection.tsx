"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowUpRight, CheckCircle2, X } from "lucide-react";

export function PricingSection() {
  return (
    <section
      id="tarifs"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-slate-50/70 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800"
    >
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <span className="text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
          Tarification transparente
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-4 tracking-tight">
          Des tarifs clairs, adaptés à votre rythme
        </h2>
        <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 mt-2">
          Aucun engagement. Choisissez l&apos;offre adaptée à la taille de votre structure et évoluez à votre rythme.
        </p>

        {/* Currency Switcher Info Badge */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Tarifs indiqués en Francs CFA (XOF / XAF)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Free Plan */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/60 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-base font-bold text-slate-900 dark:text-white">Gratuit</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Pour débuter sereinement</p>

            <div className="my-6">
              <span className="text-3xl sm:text-4xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                0
              </span>
              <span className="text-base font-bold text-slate-900 dark:text-white"> FCFA</span>
              <span className="text-xs text-slate-400"> / mois</span>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Jusqu&apos;à 5 factures & devis / mois</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>1 utilisateur unique</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Calcul automatique TVA 18%</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Export PDF standard</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-400">
                <X className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                <span className="line-through">Relances WhatsApp auto</span>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <Link
              href="/register"
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-xs font-bold flex items-center justify-center transition-colors"
            >
              Commencer gratuitement
            </Link>
          </div>
        </div>

        {/* Plan Pro (HIGHLIGHTED) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-emerald-600 shadow-xl shadow-emerald-900/10 dark:shadow-emerald-950/40 flex flex-col justify-between relative transform md:-translate-y-4">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold tracking-wider uppercase shadow-xs">
            ✦ Le plus populaire
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-emerald-700 dark:text-emerald-400">Plan Pro</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                Recommandé
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Pour les indépendants & TPE ambitieuses</p>

            <div className="my-6">
              <span className="text-3xl sm:text-4xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                5 000
              </span>
              <span className="text-base font-bold text-slate-900 dark:text-white"> FCFA</span>
              <span className="text-xs text-slate-400"> / mois</span>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <strong className="text-slate-900 dark:text-white font-semibold">Factures & devis illimités</strong>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Personnalisation logo & coordonnées</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Relances automatisées WhatsApp</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Passerelles TMoney, Flooz & Wave</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Export comptable Excel & Grand Livre</span>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <Link
              href="/register"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/30 text-xs font-bold flex items-center justify-center gap-2 group transition-all duration-200 hover:-translate-y-0.5"
            >
              <span>Choisir le Plan Pro</span>
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </div>

        {/* Business Plan */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/60 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-base font-bold text-slate-900 dark:text-white">Entreprise & PME</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Pour les équipes et structures en expansion</p>

            <div className="my-6">
              <span className="text-3xl sm:text-4xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                15 000
              </span>
              <span className="text-base font-bold text-slate-900 dark:text-white"> FCFA</span>
              <span className="text-xs text-slate-400"> / mois</span>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Multi-utilisateurs & collaborateurs</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Gestion des rôles & permissions</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Gestion multi-entreprises & filiales</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Rapports financiers avancés</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Support dédié 24/7 par WhatsApp</span>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <a
              href="https://wa.me/?text=Bonjour%2C%20je%20souhaite%20des%20informations%20sur%20l%27offre%20Entreprise%20de%20Telambah%20Facture"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-xs font-bold flex items-center justify-center transition-colors"
            >
              Contacter les ventes
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

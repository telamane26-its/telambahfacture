"use client";

import React from "react";
import {
  Receipt,
  FileCheck2,
  Percent,
  Send,
  MessageSquare,
  Users,
} from "lucide-react";

export function FeaturesBentoSection() {
  return (
    <section
      id="fonctionnalites"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-slate-50/70 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
            Puissance & Simplicité
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3.5 tracking-tight">
            L&apos;outil conçu sur mesure pour vos réalités
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md">
          Une suite de facturation complète pensée pour les spécificités de Lomé, Cotonou, Abidjan, Dakar, Douala et
          Libreville.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Feature 1 (Large 7 cols) */}
        <div className="md:col-span-7 rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/60 shadow-xs hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Receipt className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold">
                Génération Instantanée
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 font-sans">
              Factures professionnelles en 2 clics
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              Personnalisez vos documents avec votre logo, vos coordonnées Mobile Money (TMoney, Flooz, Wave) et vos
              mentions légales OHADA. Émission immédiate en Franc CFA (XOF / XAF) avec zéro centime.
            </p>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Facture-A4-Vectorielle.pdf
                </p>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Haute définition · Téléchargement immédiat
                </span>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-2xs">
              ✓ Prête
            </span>
          </div>
        </div>

        {/* Feature 2 (5 cols) */}
        <div className="md:col-span-5 rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/60 shadow-xs hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Percent className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 text-xs font-bold">
                Fiscalité UEMOA
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 font-sans">
              TVA 18% & fiscalité sans prise de tête
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Calcul automatique de la TVA 18% sur le montant HT net de remise. NIF strictement optionnel pour les
              indépendants facturant sous le régime commercial OHADA.
            </p>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Montant Brut HT</span>
              <span className="font-bold text-slate-900 dark:text-white tabular-nums">3 000 000 FCFA</span>
            </div>
            <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
              <span>TVA UEMOA (18%)</span>
              <span className="font-bold tabular-nums">+ 540 000 FCFA</span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-slate-900 dark:text-white">
              <span>Total Net à payer (TTC)</span>
              <span className="text-emerald-700 dark:text-emerald-400 text-sm tabular-nums">3 540 000 FCFA</span>
            </div>
          </div>
        </div>

        {/* Feature 3 (5 cols) */}
        <div className="md:col-span-5 rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/60 shadow-xs hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Send className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold">
                WhatsApp Direct
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 font-sans">
              Relances WhatsApp pré-remplies
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              En un seul clic, générez un message WhatsApp courtois et complet avec numéro de facture, date d&apos;échéance,
              montant exact et canaux de paiement pour votre client.
            </p>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-800 dark:text-slate-200 italic truncate font-sans">
                &quot;Bonjour, votre facture FAC-2026-0482 arrive à échéance...&quot;
              </p>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
                Lien wa.me instantané
              </span>
            </div>
          </div>
        </div>

        {/* Feature 4 (Large 7 cols) */}
        <div className="md:col-span-7 rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/60 shadow-xs hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Users className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 text-xs font-bold">
                Annuaire & Règlements
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 font-sans">
              Gestion clients & passerelles locales
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              Centralisez vos entreprises partenaires, suivez l&apos;encaissement par client et configurez vos comptes
              TMoney, Flooz, Wave et coordonnées bancaires RIB / IBAN en quelques secondes.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 text-center">
              <span className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-sans">
                100%
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Zone FCFA</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 text-center">
              <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-sans">
                0 Centime
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Montants Entiers</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 text-center">
              <span className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400 font-sans">
                &lt; 30s
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Création Facture</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

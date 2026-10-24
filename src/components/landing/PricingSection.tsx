"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowUpRight, CheckCircle2, X, AlertTriangle, Sparkles } from "lucide-react";

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
          Des tarifs clairs, adaptés à vos ambitions
        </h2>
        <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 mt-2">
          Aucun engagement, sans frais cachés. Débloquez tout le potentiel de votre entreprise dès aujourd&apos;hui.
        </p>

        {/* Currency Switcher Info Badge */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Tarifs en Francs CFA (XOF / XAF) · Zéro centime</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {/* Plan 1: Gratuit (Met l'accent sur les limites et ce qu'ils manquent) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/60 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-base font-bold text-slate-900 dark:text-white">Gratuit</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Strictement limité pour tester</p>

            <div className="my-5">
              <span className="text-3xl sm:text-4xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                0
              </span>
              <span className="text-base font-bold text-slate-900 dark:text-white"> FCFA</span>
              <span className="text-xs text-slate-400"> / mois</span>
            </div>

            {/* Inclus dans Gratuit */}
            <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Inclus au départ :
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Plafond strict de <strong>5 factures / mois</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>1 seul compte utilisateur</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Calcul basique TVA 18%</span>
              </div>
            </div>

            {/* Ce que vous manquez (Ce qu'ils ratent sans le Plan Pro) */}
            <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700/60">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-3">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Ce que vous perdez sans le Pro :</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-400 dark:text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-700 dark:text-slate-300 font-semibold">Aucune relance WhatsApp auto</strong> : vos impayés traînent
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-400 dark:text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-700 dark:text-slate-300 font-semibold">Zéro encaissement Mobile Money</strong> (pas de TMoney, Flooz, Wave)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-400 dark:text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-700 dark:text-slate-300 font-semibold">Mention & filigrane Telambah</strong> obligatoire sur vos PDF
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-400 dark:text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-700 dark:text-slate-300 font-semibold">Aucun export comptable</strong> (saisie manuelle fastidieuse)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-400 dark:text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-700 dark:text-slate-300 font-semibold">Blocage dès la 6ème facture</strong> (croissance bridée)
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/register"
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center transition-colors"
            >
              Commencer avec le Gratuit
            </Link>
          </div>
        </div>

        {/* Plan 2: Plan Pro (HIGHLIGHTED - Met en valeur TOUT CE QU'ILS ONT EN PLUS) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-emerald-600 shadow-xl shadow-emerald-900/15 dark:shadow-emerald-950/50 flex flex-col justify-between relative transform md:-translate-y-4">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold tracking-wider uppercase shadow-xs flex items-center gap-1.5 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recommandé · ROI dès la 1ère facture</span>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400">Plan Pro</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                Accès Complet
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pour consultants, freelances & PME qui veulent encaisser vite
            </p>

            <div className="my-5">
              <span className="text-3xl sm:text-4xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                5 000
              </span>
              <span className="text-base font-bold text-slate-900 dark:text-white"> FCFA</span>
              <span className="text-xs text-slate-400"> / mois</span>
            </div>

            {/* Ce qu'ils ont EN PLUS (Avantages Pro Massifs) */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                Tout ce que vous débloquez en plus :
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900 dark:text-white font-bold">Factures & Devis 100% ILLIMITÉS</strong> (zéro plafond, émission en 30s)
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900 dark:text-white font-bold">Relances automatiques WhatsApp</strong> : encaissez 2x plus vite sans froisser vos clients
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900 dark:text-white font-bold">Encaissement Mobile Money direct</strong> : TMoney, Flooz & Wave intégrés sur vos factures
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900 dark:text-white font-bold">Image de marque 100% personnalisée</strong> : Votre logo officiel, vos couleurs et votre cachet
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900 dark:text-white font-bold">Exports comptables en 1 clic</strong> : Tableaux Excel, Grand Livre et relevé TVA 18%
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900 dark:text-white font-bold">Tableau de bord financier en direct</strong> : Alertes retards, CA encaissé & encours
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900 dark:text-white font-bold">Support prioritaire 7j/7</strong> via WhatsApp & téléphone
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/register"
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/30 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 group transition-all duration-200 hover:-translate-y-0.5"
            >
              <span>Choisir le Plan Pro (5 000 FCFA)</span>
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </div>

        {/* Plan 3: Entreprise & PME */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/60 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-base font-bold text-slate-900 dark:text-white">Entreprise & PME</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Pour les structures établies et cabinets</p>

            <div className="my-5">
              <span className="text-3xl sm:text-4xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                15 000
              </span>
              <span className="text-base font-bold text-slate-900 dark:text-white"> FCFA</span>
              <span className="text-xs text-slate-400"> / mois</span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Tout le Plan Pro inclus, plus :
              </div>

              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white font-semibold">Multi-utilisateurs</strong> : jusqu&apos;à 10 accès collaborateurs</span>
              </div>

              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white font-semibold">Rôles & permissions sur mesure</strong> (comptable, commercial, gérant)</span>
              </div>

              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white font-semibold">Multi-sociétés</strong> : gérez plusieurs entités & filiales</span>
              </div>

              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white font-semibold">Audit trail</strong> & traçabilité complète des opérations</span>
              </div>

              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white font-semibold">Accompagnement & onboarding personnalisé</strong></span>
              </div>

              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white font-semibold">Chargé de compte dédié 24/7</strong></span>
              </div>
            </div>
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

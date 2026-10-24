"use client";

import React from "react";
import { FileSpreadsheet, Calculator, Hourglass, X, AlertTriangle, TrendingDown } from "lucide-react";

export function ProblemSection() {
  const problems = [
    {
      icon: <FileSpreadsheet className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
      bgIcon: "bg-rose-50 dark:bg-rose-950/50 border-rose-100 dark:border-rose-900/60",
      title: "Factures artisanales sur Word & Excel",
      description:
        "Mises en page instables, formules rompues et manque de professionnalisme face aux directions d'achats des grandes entreprises et institutions régionales.",
      footerIcon: <X className="w-4 h-4 text-rose-500" />,
      footerText: "Risque élevé d'erreurs de calcul",
    },
    {
      icon: <Calculator className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      bgIcon: "bg-amber-50 dark:bg-amber-950/50 border-amber-100 dark:border-amber-900/60",
      title: "Casse-tête fiscal & calcul de TVA 18%",
      description:
        "Confusion fréquente entre montants Hors Taxes (HT) et Toutes Taxes Comprises (TTC), exonérations mal renseignées et stress à chaque déclaration.",
      footerIcon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
      footerText: "Pénalités et redressements évitables",
    },
    {
      icon: <Hourglass className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      bgIcon: "bg-indigo-50 dark:bg-indigo-950/50 border-indigo-100 dark:border-indigo-900/60",
      title: "Suivi des impayés quasi impossible",
      description:
        "Relances manuelles embarrassantes ou oubliées, trésorerie fragilisée et aucun aperçu consolidé des créances en attente d'encaissement.",
      footerIcon: <TrendingDown className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
      footerText: "Moyenne de 45 jours de retard client",
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-slate-100 dark:border-slate-800">
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <span className="text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
          Le constat sur le terrain
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-4 tracking-tight">
          La facturation traditionnelle freine votre croissance
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
          Entre les fichiers Excel écrasés, les calculs de TVA approximatifs et les clients qui tardent à payer, vous
          perdez un temps précieux qui devrait être consacré à vos affaires.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {problems.map((p, index) => (
          <div
            key={index}
            className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/60 shadow-xs hover:shadow-card hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
          >
            <div>
              <div
                className={`w-12 h-12 rounded-2xl ${p.bgIcon} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}
              >
                {p.icon}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 font-sans">
                {p.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {p.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold">
              {p.footerIcon}
              <span>{p.footerText}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

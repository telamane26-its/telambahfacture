"use client";

import React from "react";
import { Zap, Sliders, CheckCircle2 } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Inscrivez-vous gratuitement",
      description:
        "Renseignez le nom de votre entreprise, choisissez votre pays (Togo, Sénégal, Côte d'Ivoire, Cameroun, Bénin...) et configurez votre devise par défaut en 30 secondes.",
      badgeIcon: <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      badgeText: "Sans carte bancaire",
    },
    {
      step: "02",
      title: "Créez votre première facture",
      description:
        "Sélectionnez votre client ou ajoutez-le en un clic. Entrez vos lignes de prestations en FCFA : les remises éventuelles et la TVA à 18% se calculent automatiquement.",
      badgeIcon: <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      badgeText: "Modèles conformes OHADA",
    },
    {
      step: "03",
      title: "Partagez et encaissez",
      description:
        "Transmettez le document par lien WhatsApp pré-rempli ou PDF vectoriel par email. Vos clients règlent directement par TMoney, Flooz, Wave ou virement bancaire.",
      badgeIcon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      badgeText: "Encaissement 2x plus rapide",
    },
  ];

  return (
    <section id="comment-ca-marche" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <span className="text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
          Parcours fluide
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-4 tracking-tight">
          Prêt en moins de 3 minutes chrono
        </h2>
        <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 mt-2">
          Aucune connaissance comptable préalable requise. Tout est pensé pour que vous soyez autonome dès aujourd&apos;hui.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, index) => (
          <div
            key={index}
            className="flex flex-col items-start p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/60 shadow-xs hover:shadow-card hover:-translate-y-1 transition-all duration-200 group"
          >
            <span className="font-mono text-4xl font-black text-emerald-600/30 dark:text-emerald-400/30 leading-none select-none mb-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {s.step}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 font-sans">
              {s.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
              {s.description}
            </p>
            <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {s.badgeIcon}
              <span>{s.badgeText}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

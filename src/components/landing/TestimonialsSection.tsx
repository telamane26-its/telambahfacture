"use client";

import React from "react";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "« Je perdais 4 heures chaque fin de mois à faire mes factures sur Excel avec des erreurs de TVA. Avec Telambah, tout est plié en 5 minutes et mes clients me payent deux fois plus vite via Wave et virement. »",
      name: "Aïssatou Diallo",
      role: "Fondatrice de Kemet Studio • Dakar",
      initials: "AD",
      highlight: false,
    },
    {
      quote:
        "« Le calcul instantané de la TVA à 18% et le suivi rigoureux en FCFA ont sauvé notre relation avec notre expert-comptable. C'est l'outil indispensable pour toute PME sérieuse en Afrique de l'Ouest. »",
      name: "Jean-Marc Kouamé",
      role: "CEO de Baobab Logistics • Abidjan",
      initials: "JK",
      highlight: true,
    },
    {
      quote:
        "« Le design des factures générées est tellement soigné et net que nos clients corporate nous prennent tout de suite au sérieux. Les coordonnées Mobile Money intégrées facilitent énormément les règlements. »",
      name: "Emmanuel Ndongo",
      role: "Directeur d'Agence Tech • Douala",
      initials: "EN",
      highlight: false,
    },
  ];

  return (
    <section id="temoignages" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-slate-100 dark:border-slate-800">
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <span className="text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
          Preuve sociale
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-4 tracking-tight">
          Adopté par les entrepreneurs qui font bouger l&apos;Afrique
        </h2>
        <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 mt-2">
          Plus de 12 000 indépendants, agences et PME font confiance à Telambah pour sécuriser leur facturation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className={`p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800/80 border shadow-xs hover:shadow-card hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between relative ${
              t.highlight
                ? "border-2 border-emerald-600 dark:border-emerald-500 shadow-md transform md:-translate-y-2"
                : "border-slate-200/90 dark:border-slate-700/60"
            }`}
          >
            {t.highlight && (
              <div className="absolute -top-3.5 right-6 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-xs">
                Top Témoignage
              </div>
            )}

            <div>
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-emerald-600 dark:fill-emerald-400 stroke-none" />
                ))}
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic font-sans">
                {t.quote}
              </p>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60">
              <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 flex items-center justify-center font-bold text-sm shrink-0">
                {t.initials}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {t.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

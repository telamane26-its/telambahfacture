"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Verified, Clock, Headphones } from "lucide-react";

export function CtaSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 mb-12">
      <div className="relative rounded-3xl p-8 sm:p-12 lg:p-16 bg-slate-900 text-white text-center overflow-hidden shadow-2xl border border-slate-800">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold mb-3">
            Passez à la vitesse supérieure
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 font-sans">
            Rejoignez les entrepreneurs qui facturent{" "}
            <span className="text-emerald-400">comme des pros</span>
          </h2>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Prêt à moderniser votre gestion financière ? Démarrez votre essai gratuit sans engagement en moins de 2
            minutes.
          </p>

          {/* Big Pill CTA Button */}
          <Link
            href="/register"
            className="hero-cta-btn inline-flex items-center gap-3 pl-8 pr-2.5 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-all duration-200 group"
          >
            <span>Commencer gratuitement</span>
            <span className="w-10 h-10 rounded-full bg-slate-950/15 flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </span>
          </Link>

          {/* Reassurance Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-slate-400 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <Verified className="w-4 h-4 text-emerald-400" />
              Sans carte bancaire
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              Configuration en 2 min
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Headphones className="w-4 h-4 text-emerald-400" />
              Support réactif à Lomé, Dakar & Abidjan
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

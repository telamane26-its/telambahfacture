"use client";

import React from "react";
import Link from "next/link";
import { Receipt, Mail, Share2 } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                <Receipt className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white font-sans">
                Telambah Facture
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Plateforme de facturation, devis et gestion de trésorerie conforme aux normes commerciales d&apos;Afrique
              francophone (UEMOA, CEMAC, TVA 18%, FCFA).
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-fit text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Conçu avec fierté au Togo 🇹🇬 pour l&apos;Afrique</span>
            </div>
          </div>

          {/* Links: Produit */}
          <div className="md:col-span-2 flex flex-col gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Produit
            </span>
            <a href="#fonctionnalites" className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              Fonctionnalités
            </a>
            <a href="#tarifs" className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              Grille Tarifaire
            </a>
            <a href="#comment-ca-marche" className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              Conformité TVA 18%
            </a>
            <a href="#comment-ca-marche" className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              Intégrations Mobiles
            </a>
          </div>

          {/* Links: Ressources */}
          <div className="md:col-span-2 flex flex-col gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Ressources
            </span>
            <a href="#temoignages" className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              Témoignages Clients
            </a>
            <Link href="/help" className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              Centre d&apos;Aide & FAQ
            </Link>
            <Link href="/login" className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              Espace Membre
            </Link>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Sécurité & Données
            </span>
          </div>

          {/* Links: Communauté */}
          <div className="md:col-span-3 flex flex-col gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Communauté & Contact
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Rejoignez plus de 12 000 entrepreneurs et PME à travers Lomé, Cotonou, Dakar, Abidjan et Douala.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <a
                href="https://wa.me/?text=Bonjour%20Telambah%20Facture"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contacter sur WhatsApp"
                className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-all"
              >
                <Mail className="w-4 h-4" />
              </a>
              <button
                type="button"
                aria-label="Partager"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "Telambah Facture",
                      text: "SaaS de facturation panafricain en FCFA conforme OHADA",
                      url: window.location.href,
                    });
                  }
                }}
                className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-all"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span>© 2026 Telambah Facture Technologies. Tous droits réservés.</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-default">
              Mentions Légales OHADA
            </span>
            <span>•</span>
            <span className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-default">
              Politique de Confidentialité
            </span>
            <span>•</span>
            <span className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-default">
              Conditions Générales
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

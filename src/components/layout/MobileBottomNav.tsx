"use client";

import React from "react";
import Link from "next/link";
import { LayoutDashboard, FileText, Plus, Users, Settings } from "lucide-react";

interface MobileBottomNavProps {
  currentPath?: string;
}

export function MobileBottomNav({ currentPath = "/dashboard" }: MobileBottomNavProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-700/60 px-3 py-1.5 flex items-center justify-around shadow-[0_-4px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.2)]">
      <Link
        href="/dashboard"
        className={`flex flex-col items-center py-1 px-3 text-[10px] font-medium transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${
          currentPath === "/dashboard" || currentPath === "/"
            ? "text-slate-900 dark:text-white font-bold"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
        }`}
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span>Accueil</span>
      </Link>

      <Link
        href="/invoices"
        className={`flex flex-col items-center py-1 px-3 text-[10px] font-medium transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${
          currentPath === "/invoices"
            ? "text-slate-900 dark:text-white font-bold"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
        }`}
      >
        <FileText className="w-5 h-5 mb-0.5" />
        <span>Factures</span>
      </Link>

      {/* Center floating action button for quick invoice creation */}
      <div className="-mt-5">
        <Link
          href="/invoices/new"
          className="w-12 h-12 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-md border border-slate-800 dark:border-slate-200 hover:scale-110 hover:-translate-y-0.5 active:scale-90 transition-all duration-200"
          aria-label="Nouvelle Facture"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </Link>
      </div>

      <Link
        href="/clients"
        className={`flex flex-col items-center py-1 px-3 text-[10px] font-medium transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${
          currentPath === "/clients"
            ? "text-slate-900 dark:text-white font-bold"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
        }`}
      >
        <Users className="w-5 h-5 mb-0.5" />
        <span>Clients</span>
      </Link>

      <Link
        href="/settings"
        className={`flex flex-col items-center py-1 px-3 text-[10px] font-medium transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${
          currentPath === "/settings"
            ? "text-slate-900 dark:text-white font-bold"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
        }`}
      >
        <Settings className="w-5 h-5 mb-0.5" />
        <span>Réglages</span>
      </Link>
    </nav>
  );
}

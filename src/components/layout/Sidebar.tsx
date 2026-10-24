"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Users,
  Package,
  BarChart3,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  Search,
  PlusCircle,
  ArrowUpRight,
  Bell,
  Gift,
} from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { useData } from "@/lib/data-context";
import { UserDropdown } from "@/components/layout/UserDropdown";
import { NotificationsModal } from "@/components/layout/NotificationsModal";
import { ReferralModal } from "@/components/layout/ReferralModal";

interface SidebarProps {
  currentPath?: string;
}

export function Sidebar({ currentPath = "/dashboard" }: SidebarProps) {
  const { isDark, toggleTheme } = useTheme();
  const { invoices, clients, unreadNotificationsCount, isCloudSynced } = useData();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isReferralOpen, setIsReferralOpen] = useState(false);

  const invoicesCount = invoices.length;
  const clientsCount = Object.keys(clients).length;

  const navigationItems = [
    {
      name: "Tableau de bord",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: currentPath === "/dashboard" || currentPath === "/",
      badge: null,
    },
    {
      name: "Factures",
      href: "/invoices",
      icon: FileText,
      active: currentPath === "/invoices" || currentPath.startsWith("/invoices/"),
      badge: String(invoicesCount),
      badgeColor: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 font-semibold",
    },
    {
      name: "Clients",
      href: "/clients",
      icon: Users,
      active: currentPath === "/clients",
      badge: String(clientsCount),
    },
    {
      name: "Produits & Services",
      href: "/products",
      icon: Package,
      active: currentPath === "/products",
      badge: null,
    },
    {
      name: "Trésorerie & Rapports",
      href: "/reports",
      icon: BarChart3,
      active: currentPath === "/reports",
      badge: "Nouveau",
      badgeColor: "bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5",
    },
  ];

  const secondaryItems = [
    {
      name: "Paramètres",
      href: "/settings",
      icon: Settings,
      active: currentPath === "/settings",
    },
    {
      name: "Aide & Support",
      href: "/help",
      icon: HelpCircle,
      active: currentPath === "/help",
    },
  ];



  return (
    <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-700/60 min-h-screen fixed top-0 left-0 bottom-0 z-30 select-none shadow-[1px_0_4px_rgba(0,0,0,0.02)] dark:shadow-[1px_0_4px_rgba(0,0,0,0.3)]">
      {/* 1. Header / Logo */}
      <div className="px-6 pt-6 pb-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60">
        <Link href="/" className="flex items-center gap-3 group hover:opacity-95 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 border border-slate-800 dark:border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
            <svg
              className="w-5 h-5 text-white dark:text-slate-900"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="4" />
              <path d="M7 8h10" />
              <path d="M7 12h7" />
              <path d="M7 16h4" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white transition-colors">
                Telambah
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors">
                SaaS
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isCloudSynced ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`} />
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                {isCloudSynced ? "Supabase Cloud" : "Connexion Cloud..."}
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* 2. Quick Search bar */}
      <div className="px-5 pt-4 pb-2">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
          className="w-full relative flex items-center justify-between pl-9 pr-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/90 dark:hover:bg-slate-700/80 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl border border-slate-200/90 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-left shadow-2xs group active:scale-[0.99]"
          title="Rechercher partout (Raccourci ⌘K ou Ctrl+K)"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 absolute left-3 transition-colors" />
          <span className="font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 truncate">
            Rechercher partout...
          </span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700 shadow-xs group-hover:text-slate-800 dark:group-hover:text-white transition-colors">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* 3. Main Navigation Items */}
      <div className="flex-1 px-4 py-3 space-y-6 overflow-y-auto">
        <div>
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Menu Principal
          </div>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    item.active
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 hover:scale-[1.01]"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/90 dark:hover:bg-slate-800 hover:translate-x-1"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform duration-200 ${
                        item.active
                          ? "text-white dark:text-slate-900"
                          : "text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white group-hover:scale-115"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full transition-transform duration-200 group-hover:scale-105 ${
                        item.badgeColor
                          ? item.badgeColor
                          : item.active
                          ? "bg-slate-800 dark:bg-slate-200 text-slate-200 dark:text-slate-800 font-semibold"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 4. Quick Action Button for Invoices */}
        <div
          onClick={() => {
            window.location.href = "/invoices/new";
          }}
          className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 hover:shadow-card hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 cursor-pointer group"
        >
          <div className="flex items-start gap-2.5 mb-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white transition-colors">
                Émettre en 30s
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Partage immédiat sur WhatsApp & PDF conforme
              </p>
            </div>
          </div>
          <Link
            href="/invoices/new"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = "/invoices/new";
            }}
            className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white text-xs font-semibold rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
          >
            <span>+ Nouvelle facture</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
          </Link>
        </div>

        {/* 5. General / Support Menu */}
        <div>
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Préférences
          </div>
          <nav className="space-y-1">
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800 hover:translate-x-1 transition-all duration-200 group"
                >
                  <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white group-hover:scale-110 transition-all duration-200" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Notifications Button */}
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800 hover:translate-x-1 transition-all duration-200 group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bell className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white group-hover:scale-110 transition-all duration-200" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </div>
                <span>Notifications</span>
              </div>
              {unreadNotificationsCount > 0 ? (
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-rose-500 text-white">
                  {unreadNotificationsCount}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-mono">0</span>
              )}
            </button>

            {/* Parrainage Button */}
            <button
              type="button"
              onClick={() => setIsReferralOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800 hover:translate-x-1 transition-all duration-200 group text-left"
            >
              <div className="flex items-center gap-3">
                <Gift className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-all duration-200" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Parrainage</span>
              </div>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                +10 000 F
              </span>
            </button>

            {/* Dark Mode Toggle Switch */}
            <div
              onClick={toggleTheme}
              className="flex items-center justify-between px-3.5 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-200" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:-rotate-12 transition-transform duration-200" />
                )}
                <span className="font-semibold text-slate-700 dark:text-slate-200">Mode Sombre</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isDark}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTheme();
                }}
                aria-label="Basculer le mode sombre"
                className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${
                  isDark ? "bg-slate-900 dark:bg-slate-600" : "bg-slate-200 dark:bg-slate-700"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    isDark ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* 6. User Profile Card with UserDropdown (Image 2) */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/30">
        <UserDropdown placement="bottom-up" />
      </div>

      {/* Modals for Notifications & Referral Program */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
      <ReferralModal
        isOpen={isReferralOpen}
        onClose={() => setIsReferralOpen(false)}
      />
    </aside>
  );
}

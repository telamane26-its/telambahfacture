"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Search,
  LayoutDashboard,
  FileText,
  Users,
  Package,
  BarChart3,
  Settings,
  HelpCircle,
  Bell,
  Moon,
  Sun,
  Gift,
  Camera,
} from "lucide-react";
import { useData } from "@/lib/data-context";
import { useTheme } from "@/lib/theme-context";
import { UserDropdown } from "@/components/layout/UserDropdown";
import { NotificationsModal } from "@/components/layout/NotificationsModal";
import { ReferralModal } from "@/components/layout/ReferralModal";
import { ProfilePhotoModal } from "@/components/layout/ProfilePhotoModal";

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isReferralOpen, setIsReferralOpen] = useState(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { currentUser, unreadNotificationsCount } = useData();

  return (
    <>
      {/* Mobile Top App Bar */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-xs transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Ouvrir le menu de navigation"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 active:scale-95 transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-xs">
              <svg
                className="w-4 h-4 text-white dark:text-slate-900"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <path d="M7 8h10" />
                <path d="M7 12h7" />
                <path d="M7 16h4" />
              </svg>
            </div>
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
              Telambah
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick search button */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-90 transition-all"
            aria-label="Rechercher partout"
            title="Rechercher partout (⌘K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Quick theme toggle in mobile header */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-90 transition-all"
            aria-label="Basculer le mode sombre"
            title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-200" />
            ) : (
              <Moon className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Notifications bell with live modal */}
          <button
            onClick={() => setIsNotifOpen(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>
          
          <div className="w-8 h-8">
            <UserDropdown placement="dropdown" compact={true} />
          </div>
        </div>
      </header>

      {/* Slide-over Drawer for Mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-slate-900 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200 border-r border-slate-200 dark:border-slate-800">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-sm">
                    T
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Telambah Facture</h3>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">Conçu au Togo 🇹🇬 · Zone FCFA</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Links inside Drawer */}
              <nav className="mt-6 space-y-1">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span>Tableau de bord</span>
                </Link>

                <Link
                  href="/invoices"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <span>Factures</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Direct
                  </span>
                </Link>

                <Link
                  href="/clients"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Users className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span>Clients</span>
                </Link>

                <Link
                  href="/products"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Package className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span>Produits & Services</span>
                </Link>

                <Link
                  href="/reports"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <BarChart3 className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span>Trésorerie & Rapports</span>
                </Link>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-3 space-y-1">
                  {/* Notifications in Drawer */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setIsNotifOpen(true);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Bell className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                      <span>Notifications</span>
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>

                  {/* Parrainage in Drawer */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setIsReferralOpen(true);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Gift className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Parrainage</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      10 000 F
                    </span>
                  </button>

                  {/* Dark Mode in Drawer */}
                  <div
                    onClick={toggleTheme}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isDark ? (
                        <Sun className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Moon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                      )}
                      <span>Mode Sombre</span>
                    </div>
                    <div
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                        isDark ? "bg-slate-900 dark:bg-slate-600" : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          isDark ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </div>

                  <Link
                    href="/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Settings className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <span>Paramètres</span>
                  </Link>

                  <Link
                    href="/help"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <HelpCircle className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <span>Aide & Support WhatsApp</span>
                  </Link>
                </div>
              </nav>
            </div>

            {/* Bottom card with profile in drawer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div
                onClick={() => {
                  setIsOpen(false);
                  setIsPhotoOpen(true);
                }}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                    />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-2 ring-white dark:ring-slate-900" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser.companyName}</p>
                  </div>
                </div>
                <Camera className="w-4 h-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors shrink-0" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <NotificationsModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
      />

      <ReferralModal
        isOpen={isReferralOpen}
        onClose={() => setIsReferralOpen(false)}
      />

      <ProfilePhotoModal
        isOpen={isPhotoOpen}
        onClose={() => setIsPhotoOpen(false)}
      />
    </>
  );
}

"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Paintbrush,
  Settings,
  Bell,
  Command,
  LayoutGrid,
  Gift,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Trash2,
  LogOut,
  ChevronUp,
  ChevronDown,
  Check,
  Moon,
  Sun,
  Camera,
} from "lucide-react";
import { useData } from "@/lib/data-context";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { ProfilePhotoModal } from "@/components/layout/ProfilePhotoModal";
import { NotificationsModal } from "@/components/layout/NotificationsModal";
import { ReferralModal } from "@/components/layout/ReferralModal";

interface UserDropdownProps {
  placement?: "bottom-up" | "dropdown"; // "bottom-up" for sidebar bottom, "dropdown" for mobile top header
  compact?: boolean;
}

export function UserDropdown({ placement = "bottom-up", compact = false }: UserDropdownProps) {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const { currentUser, unreadNotificationsCount } = useData();
  const { signOut } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Modals state
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard shortcut listener (Cmd+1, Cmd+2, Cmd+3)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "1") {
        e.preventDefault();
        toggleTheme();
      } else if ((e.metaKey || e.ctrlKey) && e.key === "2") {
        e.preventDefault();
        router.push("/settings");
        setIsOpen(false);
      } else if ((e.metaKey || e.ctrlKey) && e.key === "3") {
        e.preventDefault();
        setIsNotificationsModalOpen(true);
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleTheme, router]);

  const handleShowToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 3000);
  };

  return (
    <div ref={containerRef} className="relative inline-block w-full">
      {/* Toast Feedback */}
      {notificationToast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-150">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* Trigger Button (Profile in Sidebar or Header) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Menu du compte utilisateur"
        className={`w-full flex items-center justify-between rounded-2xl transition-all duration-200 outline-none text-left group ${
          compact ? "p-0" : "p-2"
        } ${
          isOpen
            ? "bg-slate-100 dark:bg-slate-800 ring-2 ring-slate-900/10 dark:ring-white/10"
            : compact
            ? ""
            : "hover:bg-slate-100/90 dark:hover:bg-slate-800"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className={`${
                compact ? "w-8 h-8" : "w-9 h-9"
              } rounded-full object-cover ring-2 ring-white dark:ring-slate-700 shadow-xs group-hover:scale-105 transition-transform`}
            />
            {unreadNotificationsCount > 0 ? (
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 absolute bottom-0 right-0 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-2 ring-white dark:ring-slate-900" />
            )}
          </div>
          {!compact && (
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate transition-colors">
                {currentUser.name}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {currentUser.companyName}
              </p>
            </div>
          )}
        </div>
        {!compact &&
          (placement === "bottom-up" ? (
            <ChevronUp
              className={`w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white shrink-0 ml-1 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          ) : (
            <ChevronDown
              className={`w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white shrink-0 ml-1 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          ))}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          className={`absolute z-50 w-72 bg-white dark:bg-[#12141A] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-2.5 animate-in fade-in-50 zoom-in-95 duration-150 ${
            placement === "bottom-up"
              ? "bottom-full mb-2 left-0"
              : "top-full mt-2 right-0"
          }`}
        >
          {/* Header Section: Avatar + Name + Change Photo Action */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 mb-2 space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0 group">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsPhotoModalOpen(true);
                    setIsOpen(false);
                  }}
                  className="absolute inset-0 rounded-full bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                  title="Modifier la photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-2 ring-white dark:ring-slate-900" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {currentUser.email}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>En ligne · Togo 🇹🇬</span>
                </div>
              </div>
            </div>

            {/* Quick button to change photo */}
            <button
              type="button"
              onClick={() => {
                setIsPhotoModalOpen(true);
                setIsOpen(false);
              }}
              className="w-full py-1.5 px-2.5 rounded-lg text-[11px] font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <Camera className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Changer ma photo de profil</span>
            </button>
          </div>

          {/* Section 1: Actions with Hotkeys */}
          <div className="space-y-0.5">
            {/* Thèmes (Cmd+1) */}
            <button
              type="button"
              onClick={() => {
                toggleTheme();
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Paintbrush className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                <span>Thèmes</span>
              </div>
              <div className="flex items-center gap-1.5">
                {isDark ? (
                  <Moon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-300" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                )}
                <kbd className="text-[10px] text-slate-400 dark:text-slate-500 font-mono px-1 rounded bg-slate-100 dark:bg-slate-800">
                  ⌘1
                </kbd>
              </div>
            </button>

            {/* Paramètres (Cmd+2) */}
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                <span>Paramètres</span>
              </div>
              <kbd className="text-[10px] text-slate-400 dark:text-slate-500 font-mono px-1 rounded bg-slate-100 dark:bg-slate-800">
                ⌘2
              </kbd>
            </Link>

            {/* Notifications (Cmd+3) */}
            <button
              type="button"
              onClick={() => {
                setIsNotificationsModalOpen(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Bell className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                  {unreadNotificationsCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 absolute -top-0.5 -right-0.5" />
                  )}
                </div>
                <span>Notifications</span>
              </div>
              <div className="flex items-center gap-1.5">
                {unreadNotificationsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                    {unreadNotificationsCount}
                  </span>
                )}
                <kbd className="text-[10px] text-slate-400 dark:text-slate-500 font-mono px-1 rounded bg-slate-100 dark:bg-slate-800">
                  ⌘3
                </kbd>
              </div>
            </button>
          </div>

          <div className="my-1.5 border-t border-slate-100 dark:border-slate-800" />

          {/* Section 2: Sub-options */}
          <div className="space-y-0.5">
            {/* Parrainage / Referrals */}
            <button
              type="button"
              onClick={() => {
                setIsReferralModalOpen(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Gift className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Programme de Parrainage</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                10 000 FCFA
              </span>
            </button>

            {/* Raccourcis / Hotkeys */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                window.dispatchEvent(new CustomEvent("open-command-palette"));
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Command className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                <span>Raccourcis & Recherche</span>
              </div>
              <kbd className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-500">
                ⌘K
              </kbd>
            </button>

            {/* Téléchargements / Apps */}
            <button
              type="button"
              onClick={() => {
                handleShowToast("Application Web & PWA Telambah synchronisées.");
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <LayoutGrid className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                <span>Application PWA</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Aide & Support */}
            <Link
              href="/help"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                <span>Aide & Support</span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
          </div>

          <div className="my-1.5 border-t border-slate-100 dark:border-slate-800" />

          {/* Section 3: Destructive Actions */}
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => {
                handleShowToast("La corbeille ne contient aucun élément archivé.");
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors group"
            >
              <Trash2 className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-rose-500 transition-colors" />
              <span>Corbeille</span>
            </button>

            {/* Déconnexion in red */}
            <button
              type="button"
              onClick={async () => {
                setIsOpen(false);
                await signOut();
                router.push("/login");
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors group cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      )}

      {/* Interactive Modals */}
      <ProfilePhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onSuccessToast={handleShowToast}
      />

      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        onSuccessToast={handleShowToast}
      />

      <ReferralModal
        isOpen={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
        onSuccessToast={handleShowToast}
      />
    </div>
  );
}

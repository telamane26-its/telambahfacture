"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  Check,
  Trash2,
  X,
  CreditCard,
  Clock,
  AlertTriangle,
  Gift,
  Info,
  ArrowUpRight,
} from "lucide-react";
import { useData } from "@/lib/data-context";
import { NotificationItem, NotificationType } from "@/types";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast?: (msg: string) => void;
}

export function NotificationsModal({ isOpen, onClose, onSuccessToast }: NotificationsModalProps) {
  const router = useRouter();
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
  } = useData();

  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "payment" | "alert">("all");

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((notif) => {
    if (activeFilter === "unread") return !notif.read;
    if (activeFilter === "payment") return notif.type === "payment";
    if (activeFilter === "alert") return notif.type === "due_soon" || notif.type === "overdue";
    return true;
  });

  const getNotifIcon = (type: NotificationType) => {
    switch (type) {
      case "payment":
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
        );
      case "due_soon":
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        );
      case "overdue":
        return (
          <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
      case "referral":
        return (
          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center shrink-0">
            <Gift className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4" />
          </div>
        );
    }
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    if (!notif.read) {
      markNotificationAsRead(notif.id);
    }
    if (notif.link) {
      onClose();
      router.push(notif.link);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-screen flex items-center justify-center p-3 sm:p-6">
        <div className="relative bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center font-bold relative">
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 absolute -top-0.5 -right-0.5 animate-pulse" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Centre de Notifications
                  </h3>
                  {unreadNotificationsCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                      {unreadNotificationsCount} non lue{unreadNotificationsCount > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Paiements, alertes d&apos;échéances et activité du compte
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadNotificationsCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    markAllNotificationsAsRead();
                    onSuccessToast?.("Toutes les notifications ont été marquées comme lues.");
                  }}
                  title="Tout marquer comme lu"
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tout marquer comme lu</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-1.5 overflow-x-auto text-xs">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                activeFilter === "all"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Toutes ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("unread")}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                activeFilter === "unread"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Non lues ({unreadNotificationsCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("payment")}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                activeFilter === "payment"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Paiements
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("alert")}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                activeFilter === "alert"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Alertes & Échéances
            </button>
          </div>

          {/* Body / List */}
          <div className="p-3 overflow-y-auto max-h-[60vh] space-y-2">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500 space-y-2">
                <Bell className="w-8 h-8 mx-auto opacity-30" />
                <p className="text-xs font-semibold">Aucune notification dans cet onglet.</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`group p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start justify-between gap-3 ${
                    notif.read
                      ? "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      : "bg-slate-50/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {getNotifIcon(notif.type)}

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`text-xs ${
                            notif.read
                              ? "font-semibold text-slate-700 dark:text-slate-300"
                              : "font-bold text-slate-900 dark:text-white"
                          }`}
                        >
                          {notif.title}
                        </h4>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white" />
                        )}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                          {notif.timestamp}
                        </span>
                        {notif.link && (
                          <span className="text-[10px] font-bold text-slate-900 dark:text-white group-hover:underline flex items-center gap-0.5">
                            <span>Voir le détail</span>
                            <ArrowUpRight className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notif.read && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          markNotificationAsRead(notif.id);
                        }}
                        title="Marquer comme lu"
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      title="Supprimer la notification"
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Synchronisé en temps réel · Lomé 🇹🇬
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white transition-all hover:-translate-y-0.5 active:scale-95"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  FileText,
  Users,
  Package,
  PlusCircle,
  BarChart3,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  ArrowRight,
  X,
  CornerDownLeft,
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderOpen,
} from "lucide-react";
import { useData } from "@/lib/data-context";
import { useTheme } from "@/lib/theme-context";
import { formatFCFA, formatDate } from "@/lib/utils";

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "Actions" | "Factures" | "Clients" | "Services";
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  onSelect: () => void;
}

export function CommandPaletteModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { invoices, clients } = useData();
  const { isDark, toggleTheme } = useTheme();

  // Listen for custom open event and global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. ⌘K or Ctrl+K -> Search Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      // 2. ⌘1 or Ctrl+1 -> Toggle Theme
      else if ((e.metaKey || e.ctrlKey) && e.key === "1") {
        e.preventDefault();
        toggleTheme();
      }
      // 3. ⌘2 or Ctrl+2 -> Settings
      else if ((e.metaKey || e.ctrlKey) && e.key === "2") {
        e.preventDefault();
        router.push("/settings");
      }
      // 4. ⌘3 or Ctrl+3 -> Notifications
      else if ((e.metaKey || e.ctrlKey) && e.key === "3") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("open-notifications"));
      }
      // 5. Escape -> Close modal
      else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    const handleCustomOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ query?: string }>;
      setIsOpen(true);
      if (customEvent.detail?.query) {
        setQuery(customEvent.detail.query);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [isOpen, toggleTheme, router]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Default quick actions
  const defaultActions: CommandItem[] = useMemo(() => [
    {
      id: "act-new-invoice",
      title: "Créer une nouvelle facture",
      subtitle: "Nouvelle facture conforme OHADA en FCFA",
      category: "Actions",
      icon: PlusCircle,
      badge: "Nouveau",
      badgeColor: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800",
      onSelect: () => {
        setIsOpen(false);
        router.push("/invoices/new");
      },
    },
    {
      id: "act-invoices-list",
      title: "Consulter toutes les factures",
      subtitle: "Voir l'ensemble des encaissements et relances",
      category: "Actions",
      icon: FileText,
      onSelect: () => {
        setIsOpen(false);
        router.push("/invoices");
      },
    },
    {
      id: "act-clients",
      title: "Répertoire des Clients",
      subtitle: "Gérer vos partenaires et contacts d'affaires",
      category: "Actions",
      icon: Users,
      onSelect: () => {
        setIsOpen(false);
        router.push("/clients");
      },
    },
    {
      id: "act-products",
      title: "Catalogue Produits & Services",
      subtitle: "Tarifs, prestations et forfaits enregistrés",
      category: "Actions",
      icon: Package,
      onSelect: () => {
        setIsOpen(false);
        router.push("/products");
      },
    },
    {
      id: "act-reports",
      title: "Trésorerie & Rapports financiers",
      subtitle: "Chiffre d'affaires, synthèses mensuelles et TVA",
      category: "Actions",
      icon: BarChart3,
      onSelect: () => {
        setIsOpen(false);
        router.push("/reports");
      },
    },
    {
      id: "act-theme",
      title: isDark ? "Passer en Mode Clair" : "Passer en Mode Sombre (OLED)",
      subtitle: "Raccourci clavier rapide ⌘1",
      category: "Actions",
      icon: isDark ? Sun : Moon,
      badge: "⌘1",
      badgeColor: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono",
      onSelect: () => {
        toggleTheme();
        setIsOpen(false);
      },
    },
    {
      id: "act-settings",
      title: "Paramètres de l'entreprise",
      subtitle: "Identité, Mobile Money TMoney/Flooz/Wave, logo",
      category: "Actions",
      icon: Settings,
      badge: "⌘2",
      badgeColor: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono",
      onSelect: () => {
        setIsOpen(false);
        router.push("/settings");
      },
    },
    {
      id: "act-notifications",
      title: "Centre de Notifications",
      subtitle: "Rappels d'échéances et paiements reçus",
      category: "Actions",
      icon: Bell,
      badge: "⌘3",
      badgeColor: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono",
      onSelect: () => {
        setIsOpen(false);
        window.dispatchEvent(new CustomEvent("open-notifications"));
      },
    },
    {
      id: "act-help",
      title: "Centre d'Aide & Support",
      subtitle: "FAQ, directives OHADA et assistance technique",
      category: "Actions",
      icon: HelpCircle,
      onSelect: () => {
        setIsOpen(false);
        router.push("/help");
      },
    },
  ], [isDark, toggleTheme, router]);

  // Search items across Invoices, Clients, Services
  const searchResults: CommandItem[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return defaultActions;
    }

    const results: CommandItem[] = [];

    // Filter matching actions
    defaultActions.forEach((act) => {
      if (
        act.title.toLowerCase().includes(q) ||
        (act.subtitle && act.subtitle.toLowerCase().includes(q))
      ) {
        results.push(act);
      }
    });

    // 1. Factures
    invoices.forEach((inv) => {
      const matchNumber = inv.number.toLowerCase().includes(q);
      const matchClient = inv.client.name.toLowerCase().includes(q);
      const matchStatus =
        (inv.status === "paid" && "payée payee reglée".includes(q)) ||
        (inv.status === "sent" && "envoyée envoyee attente".includes(q)) ||
        (inv.status === "overdue" && "retard relance échu echu".includes(q)) ||
        (inv.status === "draft" && "brouillon".includes(q));

      if (matchNumber || matchClient || matchStatus) {
        let statusBadge = "Payée";
        let statusColor = "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
        let StatusIcon = CheckCircle2;

        if (inv.status === "sent") {
          statusBadge = "Envoyée";
          statusColor = "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800";
          StatusIcon = Clock;
        } else if (inv.status === "overdue") {
          statusBadge = "En retard";
          statusColor = "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800";
          StatusIcon = AlertTriangle;
        } else if (inv.status === "draft") {
          statusBadge = "Brouillon";
          statusColor = "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
          StatusIcon = FileText;
        }

        results.push({
          id: `inv-${inv.id}`,
          title: `${inv.number} — ${inv.client.name}`,
          subtitle: `${formatFCFA(inv.totalTtc || inv.total || 0)} · Émise le ${formatDate(inv.issueDate)}`,
          category: "Factures",
          icon: StatusIcon,
          badge: statusBadge,
          badgeColor: `border px-2 py-0.5 rounded text-[10px] font-bold ${statusColor}`,
          onSelect: () => {
            setIsOpen(false);
            router.push(`/invoices/${inv.id}`);
          },
        });
      }
    });

    // 2. Clients
    Object.values(clients).forEach((cli) => {
      const matchName = cli.name.toLowerCase().includes(q);
      const matchContact = cli.contactPerson.toLowerCase().includes(q);
      const matchEmail = cli.email.toLowerCase().includes(q);
      const matchCity = cli.city.toLowerCase().includes(q);
      const matchPhone = cli.phone.includes(q);

      if (matchName || matchContact || matchEmail || matchCity || matchPhone) {
        results.push({
          id: `cli-${cli.id}`,
          title: cli.name,
          subtitle: `${cli.contactPerson} · ${cli.phone} · ${cli.city}`,
          category: "Clients",
          icon: Users,
          badge: cli.city.split("-")[0].trim() || "Client",
          badgeColor: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
          onSelect: () => {
            setIsOpen(false);
            router.push("/clients");
          },
        });
      }
    });

    // 3. Prestations / Services types
    const sampleServices = [
      { name: "Stratégie de marque & Identité visuelle", price: 1500000, cat: "Design UI/UX" },
      { name: "Développement Application Web SaaS / Next.js", price: 3200000, cat: "Développement Web" },
      { name: "Audit Ergonomique & Optimisation UI/UX", price: 850000, cat: "Design UI/UX" },
      { name: "Maintenance applicative & Hébergement cloud", price: 250000, cat: "Maintenance & Support" },
      { name: "Formation & Accompagnement aux outils digitaux", price: 450000, cat: "Formation" },
    ];

    sampleServices.forEach((srv, idx) => {
      if (srv.name.toLowerCase().includes(q) || srv.cat.toLowerCase().includes(q)) {
        results.push({
          id: `srv-${idx}`,
          title: srv.name,
          subtitle: `${srv.cat} · ${formatFCFA(srv.price)}`,
          category: "Services",
          icon: Package,
          badge: srv.cat,
          badgeColor: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
          onSelect: () => {
            setIsOpen(false);
            router.push("/products");
          },
        });
      }
    });

    return results;
  }, [query, defaultActions, invoices, clients, router]);

  // Key navigation in list (Arrow Up / Down / Enter)
  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < searchResults.length ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (searchResults[selectedIndex]) {
        searchResults[selectedIndex].onSelect();
      }
    }
  };

  // Group results by category
  const groupedResults = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    searchResults.forEach((item) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [searchResults]);

  if (!isOpen) return null;

  let overallIndex = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 dark:bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsOpen(false)}
      />

      {/* Palette Modal */}
      <div
        onKeyDown={handleListKeyDown}
        className="relative w-full max-w-2xl bg-white dark:bg-[#12141A] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[82vh] animate-in fade-in-50 zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Rechercher une facture (FAC-...), un client, un service ou une action..."
            className="w-full text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none font-medium"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md">
              ESC
            </kbd>
          )}
        </div>

        {/* Scrollable Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-4">
          {searchResults.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <FolderOpen className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Aucun résultat pour « {query} »
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
                Vérifiez l&apos;orthographe ou essayez un numéro de facture (ex: FAC), un nom de client ou un statut.
              </p>
            </div>
          ) : (
            Object.entries(groupedResults).map(([cat, items]) => (
              <div key={cat} className="space-y-1">
                <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {cat} ({items.length})
                </div>
                <div className="space-y-1">
                  {items.map((item) => {
                    const currentIndex = overallIndex++;
                    const isSelected = selectedIndex === currentIndex;
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.id}
                        onClick={item.onSelect}
                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                        className={`group flex items-center justify-between px-3.5 py-2.5 rounded-2xl cursor-pointer transition-all duration-150 ${
                          isSelected
                            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-100/90 dark:hover:bg-slate-800/80"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? "bg-white/10 dark:bg-slate-900/10 text-white dark:text-slate-950"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p
                              className={`text-xs font-bold truncate ${
                                isSelected
                                  ? "text-white dark:text-slate-950"
                                  : "text-slate-900 dark:text-white"
                              }`}
                            >
                              {item.title}
                            </p>
                            {item.subtitle && (
                              <p
                                className={`text-[11px] truncate ${
                                  isSelected
                                    ? "text-slate-300 dark:text-slate-600"
                                    : "text-slate-500 dark:text-slate-400"
                                }`}
                              >
                                {item.subtitle}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {item.badge && (
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isSelected
                                  ? "bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-950"
                                  : item.badgeColor || "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                          <ArrowRight
                            className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${
                              isSelected
                                ? "text-white dark:text-slate-950"
                                : "text-slate-400 dark:text-slate-600 opacity-0 group-hover:opacity-100"
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts hints */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-mono shadow-2xs">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-mono shadow-2xs">
                ↓
              </kbd>
              <span>Naviguer</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-mono shadow-2xs flex items-center">
                <CornerDownLeft className="w-2.5 h-2.5 mr-0.5" /> Entrée
              </kbd>
              <span>Ouvrir</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-mono shadow-2xs">
                Échap
              </kbd>
              <span>Fermer</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px]">
            <span className="font-mono">⌘1 Thème</span>
            <span>·</span>
            <span className="font-mono">⌘2 Paramètres</span>
            <span>·</span>
            <span className="font-mono">⌘3 Notifs</span>
          </div>
        </div>
      </div>
    </div>
  );
}

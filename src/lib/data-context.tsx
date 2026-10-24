"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Invoice, Client, InvoiceStatus, UserProfile, NotificationItem, ReferralItem } from "@/types";
import {
  supabase,
  mapDbClientToApp,
  mapAppClientToDb,
  mapDbInvoiceToApp,
  mapAppInvoiceToDb,
} from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

interface DataContextType {
  invoices: Invoice[];
  clients: Record<string, Client>;
  currentUser: UserProfile;
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  referrals: ReferralItem[];
  referralCode: string;
  referralLink: string;
  totalReferralsEarned: number;
  isCloudSynced: boolean;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  // Invoice actions
  addInvoice: (invoice: Invoice) => Promise<void>;
  updateInvoice: (id: string, updated: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  changeInvoiceStatus: (id: string, status: InvoiceStatus) => Promise<void>;
  getInvoice: (id: string) => Invoice | undefined;
  // Client actions
  addClient: (clientData: Omit<Client, "id" | "avatarInitials">) => Promise<Client>;
  updateClient: (id: string, updated: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  getClient: (id: string) => Client | undefined;
  // User profile & avatar actions
  updateCurrentUser: (updated: Partial<UserProfile>) => Promise<void>;
  uploadAvatar: (dataUrl: string) => void;
  resetAvatar: () => void;
  // Notification actions
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  addNotification: (notif: Omit<NotificationItem, "id" | "createdAt" | "timestamp" | "read">) => void;
}

const DataContext = createContext<DataContextType | null>(null);

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";

function createFallbackProfile(user: any): UserProfile {
  const meta = user?.user_metadata || {};
  const email = user?.email || "";
  const name = meta.full_name || (email ? email.split("@")[0] : "Entrepreneur");
  const companyName = meta.company_name || "Mon Entreprise";

  return {
    name,
    email,
    companyName,
    legalForm: "SARL",
    rccm: "",
    taxId: "",
    phone: "",
    city: "Lomé",
    country: "Togo",
    address: "",
    activityDomain: "Prestations de services",
    role: "Dirigeant",
    avatar: DEFAULT_AVATAR,
    currency: "XOF",
    paymentMethods: {
      tmoney: { phone: "", merchantCode: "", enabled: true },
      flooz: { phone: "", merchantCode: "", enabled: true },
      wave: { phone: "", enabled: true },
      bankTransfer: { iban: "", enabled: false },
    },
    defaultTaxRate: 18,
    paymentTermDays: 30,
    invoicePrefix: "FAC-2026-",
    defaultNotes: "Règlement souhaité sous 30 jours par TMoney, Flooz ou Wave.",
  };
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Record<string, Client>>({});
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => createFallbackProfile(user));
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [referrals, setReferrals] = useState<ReferralItem[]>([]);
  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const storagePrefix = user ? `telambah_${user.id}_` : "telambah_guest_";

  // Fetch data live from Supabase scoped to current user
  const refreshData = useCallback(async () => {
    if (!user) {
      setInvoices([]);
      setClients({});
      setNotifications([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // 1. Fetch Clients for this user
      const { data: dbClients, error: clientsErr } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user.id)
        .order("name", { ascending: true });

      const clientMap: Record<string, Client> = {};
      if (!clientsErr && dbClients) {
        dbClients.forEach((row) => {
          const client = mapDbClientToApp(row);
          clientMap[client.id] = client;
        });
        setClients(clientMap);
        try {
          localStorage.setItem(`${storagePrefix}clients`, JSON.stringify(clientMap));
        } catch (_) {}
      }

      // 2. Fetch Invoices with items for this user
      const { data: dbInvoices, error: invoicesErr } = await supabase
        .from("invoices")
        .select(`
          *,
          clients (*),
          invoice_items (*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!invoicesErr && dbInvoices) {
        const mappedInvoices = dbInvoices.map((row) => mapDbInvoiceToApp(row, clientMap));
        setInvoices(mappedInvoices);
        try {
          localStorage.setItem(`${storagePrefix}invoices`, JSON.stringify(mappedInvoices));
        } catch (_) {}
        setIsCloudSynced(true);
      }

      // 3. Fetch Company Profile for this user
      const { data: dbProfile, error: profileErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!profileErr && dbProfile) {
        const mappedProfile: UserProfile = {
          name: dbProfile.name || user.user_metadata?.full_name || "Entrepreneur",
          email: dbProfile.email || user.email || "",
          companyName: dbProfile.company_name || user.user_metadata?.company_name || "Mon Entreprise",
          legalForm: dbProfile.legal_form || "SARL",
          rccm: dbProfile.rccm || "",
          taxId: dbProfile.tax_id || "",
          phone: dbProfile.phone || "",
          city: dbProfile.city || "Lomé",
          country: dbProfile.country || "Togo",
          address: dbProfile.address || "",
          activityDomain: dbProfile.activity_domain || "Prestations de services",
          role: dbProfile.role || "Dirigeant",
          avatar: dbProfile.avatar || DEFAULT_AVATAR,
          currency: (dbProfile.currency as "XOF" | "XAF") || "XOF",
          paymentMethods: {
            tmoney: {
              phone: dbProfile.tmoney_phone || "",
              merchantCode: dbProfile.tmoney_merchant_code || "",
              enabled: dbProfile.tmoney_enabled ?? true,
            },
            flooz: {
              phone: dbProfile.flooz_phone || "",
              merchantCode: dbProfile.flooz_merchant_code || "",
              enabled: dbProfile.flooz_enabled ?? true,
            },
            wave: {
              phone: dbProfile.wave_phone || "",
              enabled: true,
            },
            bankTransfer: {
              iban: dbProfile.bank_iban || "",
              enabled: !!dbProfile.bank_iban,
            },
          },
          defaultTaxRate: Number(dbProfile.default_tax_rate) || 18,
          paymentTermDays: dbProfile.payment_term_days || 30,
          invoicePrefix: dbProfile.invoice_prefix || "FAC-2026-",
          defaultNotes: dbProfile.default_notes || "Règlement souhaité par TMoney, Flooz ou Wave.",
        };
        setCurrentUser(mappedProfile);
        try {
          localStorage.setItem(`${storagePrefix}profile`, JSON.stringify(mappedProfile));
        } catch (_) {}
      } else {
        // Fallback profile if row is being created
        setCurrentUser(createFallbackProfile(user));
      }

      // 4. Fetch Notifications for this user
      const { data: dbNotifs, error: notifsErr } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!notifsErr && dbNotifs) {
        const mappedNotifs: NotificationItem[] = dbNotifs.map((n) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          timestamp: "À l'instant",
          createdAt: n.created_at,
          read: n.read,
          type: n.type as any,
          link: n.action_url || undefined,
        }));
        setNotifications(mappedNotifs);
      }
    } catch (err) {
      console.warn("Could not sync with Supabase cloud, operating with local cache:", err);
      setIsCloudSynced(false);
    } finally {
      setIsLoading(false);
    }
  }, [user, storagePrefix]);

  // When user changes, load cache and refresh from cloud
  useEffect(() => {
    if (!user) {
      setInvoices([]);
      setClients({});
      setCurrentUser(createFallbackProfile(null));
      setNotifications([]);
      setIsLoading(false);
      return;
    }

    // Attempt to read user cache first for instant UI
    try {
      const cachedInvoices = localStorage.getItem(`${storagePrefix}invoices`);
      const cachedClients = localStorage.getItem(`${storagePrefix}clients`);
      const cachedProfile = localStorage.getItem(`${storagePrefix}profile`);

      if (cachedInvoices) setInvoices(JSON.parse(cachedInvoices));
      if (cachedClients) setClients(JSON.parse(cachedClients));
      if (cachedProfile) setCurrentUser(JSON.parse(cachedProfile));
    } catch (_) {}

    refreshData();
  }, [user, refreshData, storagePrefix]);

  // Real-time subscription to user's changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`realtime-user-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "invoices",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          refreshData();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "clients",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          refreshData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refreshData]);

  // Invoice handlers with Supabase cloud persistence
  const addInvoice = async (invoice: Invoice) => {
    if (!user) return;

    // 1. Optimistic local update
    setInvoices((prev) => [invoice, ...prev]);

    // 2. Cloud persistence
    try {
      const dbInvoice = {
        ...mapAppInvoiceToDb(invoice),
        user_id: user.id,
      };
      const { error: invErr } = await supabase.from("invoices").upsert(dbInvoice);
      if (invErr) throw invErr;

      // Insert line items
      if (invoice.items && invoice.items.length > 0) {
        const dbItems = invoice.items.map((it, idx) => ({
          id: it.id || `item-${invoice.id}-${idx}`,
          invoice_id: invoice.id,
          description: it.description,
          quantity: it.quantity,
          unit_price: Math.round(it.unitPrice),
          total: Math.round(it.quantity * it.unitPrice),
          sort_order: idx,
        }));
        await supabase.from("invoice_items").upsert(dbItems);
      }

      setIsCloudSynced(true);
    } catch (err) {
      console.error("Error saving invoice to Supabase:", err);
    }
  };

  const updateInvoice = async (id: string, updated: Partial<Invoice>) => {
    if (!user) return;

    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, ...updated } : inv))
    );

    try {
      const dbUpdates: any = {};
      if (updated.status) dbUpdates.status = updated.status;
      if (updated.notes !== undefined) dbUpdates.notes = updated.notes;
      if (updated.dueDate) dbUpdates.due_date = updated.dueDate;
      if (updated.issueDate) dbUpdates.issue_date = updated.issueDate;
      if (updated.total !== undefined) dbUpdates.total_ttc = Math.round(updated.total);
      if (updated.subtotal !== undefined) dbUpdates.subtotal_ht = Math.round(updated.subtotal);
      if (updated.taxAmount !== undefined) dbUpdates.tax_amount = Math.round(updated.taxAmount);
      if (updated.paymentMethod !== undefined) dbUpdates.payment_method = updated.paymentMethod;

      if (Object.keys(dbUpdates).length > 0) {
        dbUpdates.updated_at = new Date().toISOString();
        await supabase.from("invoices").update(dbUpdates).eq("id", id).eq("user_id", user.id);
      }
    } catch (err) {
      console.error("Error updating invoice in Supabase:", err);
    }
  };

  const deleteInvoice = async (id: string) => {
    if (!user) return;
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));

    try {
      await supabase.from("invoices").delete().eq("id", id).eq("user_id", user.id);
    } catch (err) {
      console.error("Error deleting invoice in Supabase:", err);
    }
  };

  const changeInvoiceStatus = async (id: string, status: InvoiceStatus) => {
    if (!user) return;

    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== id) return inv;
        const isPaid = status === "paid";
        return {
          ...inv,
          status,
          amountPaid: isPaid ? inv.total : inv.amountPaid,
          balanceDue: isPaid ? 0 : inv.total - inv.amountPaid,
        };
      })
    );

    try {
      await supabase
        .from("invoices")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id);
    } catch (err) {
      console.error("Error changing status in Supabase:", err);
    }
  };

  // Client handlers with Supabase cloud persistence
  const addClient = async (clientData: Omit<Client, "id" | "avatarInitials">): Promise<Client> => {
    const initials =
      clientData.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() || "")
        .join("") || "CL";

    const newClient: Client = {
      ...clientData,
      id: `cli_${Date.now()}`,
      avatarInitials: initials,
    };

    setClients((prev) => ({
      ...prev,
      [newClient.id]: newClient,
    }));

    if (user) {
      try {
        const dbRow = {
          ...mapAppClientToDb(newClient),
          user_id: user.id,
        };
        await supabase.from("clients").insert(dbRow);
        setIsCloudSynced(true);
      } catch (err) {
        console.error("Error adding client to Supabase:", err);
      }
    }

    return newClient;
  };

  const updateClient = async (id: string, updated: Partial<Client>) => {
    if (!user) return;

    let updatedClient: Client | null = null;
    setClients((prev) => {
      const existing = prev[id];
      if (!existing) return prev;

      let initials = existing.avatarInitials;
      if (updated.name) {
        initials = updated.name
          .split(" ")
          .slice(0, 2)
          .map((w) => w[0]?.toUpperCase() || "")
          .join("");
      }

      updatedClient = {
        ...existing,
        ...updated,
        avatarInitials: initials,
      };

      return {
        ...prev,
        [id]: updatedClient,
      };
    });

    if (updatedClient) {
      try {
        const dbRow = {
          ...mapAppClientToDb(updatedClient),
          user_id: user.id,
        };
        await supabase.from("clients").update(dbRow).eq("id", id).eq("user_id", user.id);
      } catch (err) {
        console.error("Error updating client in Supabase:", err);
      }
    }
  };

  const deleteClient = async (id: string) => {
    if (!user) return;

    setClients((prev) => {
      const clone = { ...prev };
      delete clone[id];
      return clone;
    });

    try {
      await supabase.from("clients").delete().eq("id", id).eq("user_id", user.id);
    } catch (err) {
      console.error("Error deleting client in Supabase:", err);
    }
  };

  const getInvoice = (id: string) => invoices.find((inv) => inv.id === id);
  const getClient = (id: string) => clients[id];

  // User profile & avatar handlers
  const updateCurrentUser = async (updated: Partial<UserProfile>) => {
    const merged = { ...currentUser, ...updated };
    setCurrentUser(merged);

    if (user) {
      try {
        localStorage.setItem(`${storagePrefix}profile`, JSON.stringify(merged));

        const dbProfileUpdates: any = {
          name: merged.name,
          company_name: merged.companyName,
          legal_form: merged.legalForm,
          rccm: merged.rccm,
          tax_id: merged.taxId,
          phone: merged.phone,
          city: merged.city,
          country: merged.country,
          address: merged.address,
          activity_domain: merged.activityDomain,
          role: merged.role,
          avatar: merged.avatar,
          currency: merged.currency,
          default_tax_rate: merged.defaultTaxRate,
          payment_term_days: merged.paymentTermDays,
          invoice_prefix: merged.invoicePrefix,
          default_notes: merged.defaultNotes,
          updated_at: new Date().toISOString(),
        };

        if (merged.paymentMethods) {
          dbProfileUpdates.tmoney_phone = merged.paymentMethods.tmoney?.phone;
          dbProfileUpdates.tmoney_merchant_code = merged.paymentMethods.tmoney?.merchantCode;
          dbProfileUpdates.tmoney_enabled = merged.paymentMethods.tmoney?.enabled;
          dbProfileUpdates.flooz_phone = merged.paymentMethods.flooz?.phone;
          dbProfileUpdates.flooz_merchant_code = merged.paymentMethods.flooz?.merchantCode;
          dbProfileUpdates.flooz_enabled = merged.paymentMethods.flooz?.enabled;
          dbProfileUpdates.wave_phone = merged.paymentMethods.wave?.phone;
          dbProfileUpdates.bank_iban = merged.paymentMethods.bankTransfer?.iban;
        }

        await supabase.from("profiles").upsert({
          id: user.id,
          email: user.email,
          ...dbProfileUpdates,
        });
      } catch (err) {
        console.error("Error saving profile to Supabase:", err);
      }
    }
  };

  const uploadAvatar = (dataUrl: string) => {
    updateCurrentUser({ avatar: dataUrl });
  };

  const resetAvatar = () => {
    updateCurrentUser({ avatar: DEFAULT_AVATAR });
  };

  // Notification handlers
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    if (user) {
      supabase.from("notifications").update({ read: true }).eq("id", id).eq("user_id", user.id).then();
    }
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (user) {
      supabase.from("notifications").update({ read: true }).eq("user_id", user.id).then();
    }
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (user) {
      supabase.from("notifications").delete().eq("id", id).eq("user_id", user.id).then();
    }
  };

  const addNotification = (notif: Omit<NotificationItem, "id" | "createdAt" | "timestamp" | "read">) => {
    const newItem: NotificationItem = {
      ...notif,
      id: `notif_${Date.now()}`,
      createdAt: new Date().toISOString(),
      timestamp: "À l'instant",
      read: false,
    };
    setNotifications((prev) => [newItem, ...prev]);

    if (user) {
      supabase.from("notifications").insert({
        id: newItem.id,
        user_id: user.id,
        title: newItem.title,
        message: newItem.message,
        type: newItem.type,
        action_url: newItem.link,
        read: false,
      }).then();
    }
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const referralCode = `TELAMBAH-${currentUser.city?.toUpperCase().slice(0, 4) || "LOME"}-${(user?.id || "792").slice(0, 4).toUpperCase()}`;
  const referralLink = `https://facture.telambah.tg/join?ref=${referralCode}`;
  const totalReferralsEarned = referrals.filter((r) => r.status === "rewarded").length * 10000;

  return (
    <DataContext.Provider
      value={{
        invoices,
        clients,
        currentUser,
        notifications,
        unreadNotificationsCount,
        referrals,
        referralCode,
        referralLink,
        totalReferralsEarned,
        isCloudSynced,
        isLoading,
        refreshData,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        changeInvoiceStatus,
        getInvoice,
        addClient,
        updateClient,
        deleteClient,
        getClient,
        updateCurrentUser,
        uploadAvatar,
        resetAvatar,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        addNotification,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

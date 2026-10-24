import { createClient } from "@supabase/supabase-js";
import { Client, Invoice, UserProfile } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yazatdtzpebxhlgmwsic.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhemF0ZHR6cGVieGhsZ213c2ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3OTA0ODgsImV4cCI6MjEwODM2NjQ4OH0.9Da1bLo-pmo0ZfjcTqJGTmNL7g13cHQruztqWC2NSSU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Database mapping helpers
export function mapDbClientToApp(row: any): Client {
  return {
    id: row.id,
    name: row.name,
    contactPerson: row.contact_person || "",
    email: row.email || "",
    phone: row.phone || "",
    city: row.city || "Lomé",
    country: row.country || "Togo",
    taxId: row.tax_id || "",
    avatarInitials: row.avatar_initials || row.name.slice(0, 2).toUpperCase(),
  };
}

export function mapAppClientToDb(client: Client) {
  return {
    id: client.id,
    name: client.name,
    contact_person: client.contactPerson,
    email: client.email,
    phone: client.phone,
    city: client.city,
    country: client.country,
    tax_id: client.taxId || "",
    avatar_initials: client.avatarInitials,
    updated_at: new Date().toISOString(),
  };
}

export function mapDbInvoiceToApp(row: any, clientMap: Record<string, Client>): Invoice {
  const client: Client = clientMap[row.client_id] || {
    id: row.client_id || "cli_unknown",
    name: row.clients?.name || "Client Partenaire",
    contactPerson: row.clients?.contact_person || "",
    email: row.clients?.email || "",
    phone: row.clients?.phone || "",
    city: row.clients?.city || "Lomé",
    country: row.clients?.country || "Togo",
    avatarInitials: (row.clients?.name || "CP").slice(0, 2).toUpperCase(),
  };

  const items = (row.invoice_items || []).map((item: any) => ({
    id: item.id,
    description: item.description,
    quantity: Number(item.quantity) || 1,
    unitPrice: Number(item.unit_price) || 0,
    taxRate: Number(row.tax_rate) || 18,
  }));

  const total = Number(row.total_ttc) || 0;
  const isPaid = row.status === "paid";
  const amountPaid = isPaid ? total : 0;
  const balanceDue = isPaid ? 0 : total;

  return {
    id: row.id,
    number: row.number,
    client,
    issueDate: row.issue_date,
    dueDate: row.due_date,
    subtotal: Number(row.subtotal_ht) || 0,
    discountAmount: Number(row.discount) || 0,
    taxRate: Number(row.tax_rate) || 18,
    taxAmount: Number(row.tax_amount) || 0,
    total,
    amountPaid,
    balanceDue,
    status: row.status,
    itemsCount: items.length || 1,
    items,
    currency: "XOF",
    notes: row.notes || "",
    paymentMethod: row.payment_method || "",
  };
}

export function mapAppInvoiceToDb(invoice: Invoice) {
  return {
    id: invoice.id,
    number: invoice.number,
    client_id: invoice.client.id,
    issue_date: invoice.issueDate,
    due_date: invoice.dueDate,
    status: invoice.status,
    subtotal_ht: Math.round(invoice.subtotal),
    discount: Math.round(invoice.discountAmount || 0),
    tax_rate: invoice.taxRate || 18,
    tax_amount: Math.round(invoice.taxAmount || 0),
    total_ttc: Math.round(invoice.total),
    notes: invoice.notes || "",
    payment_method: invoice.paymentMethod || "",
    updated_at: new Date().toISOString(),
  };
}

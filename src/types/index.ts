export type InvoiceStatus = "paid" | "sent" | "draft" | "overdue" | "partially_paid";

export type PaymentMethod = 
  | "tmoney"
  | "flooz"
  | "wave"
  | "orange_money"
  | "mtn_momo"
  | "moov_money"
  | "bank_transfer"
  | "cash"
  | "cheque";

export interface Client {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  taxId?: string; // NINEA, NCC, IFU, NIU
  avatarInitials: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // e.g. 18
}

export interface Invoice {
  id: string;
  number: string;
  client: Client;
  issueDate: string; // YYYY-MM-DD
  dueDate: string;   // YYYY-MM-DD
  subtotal: number;
  discountPercent?: number;
  discountAmount?: number;
  taxRate: number; // e.g. 18
  taxAmount: number;
  total: number;
  totalTtc?: number;
  amountPaid: number;
  balanceDue: number;
  status: InvoiceStatus;
  itemsCount: number;
  items?: InvoiceItem[];
  currency: "XOF" | "XAF";
  notes?: string;
  paymentMethod?: string;
  lastPaymentMethod?: PaymentMethod;
}

export interface KpiSummary {
  periodLabel: string;
  totalInvoiced: number;
  invoicesCount: number;
  totalCollected: number;
  collectedPercent: number;
  pendingAmount: number;
  pendingCount: number;
  overdueAmount: number;
  overdueCount: number;
  growthPercent: number;
  currency?: "XOF" | "XAF";
}

export interface MonthlyRevenue {
  month: string; // e.g. "Jan", "Fév", etc.
  invoiced: number;
  collected: number;
}

export interface UserProfile {
  name: string;
  email: string;
  companyName: string;
  legalForm?: string;
  rccm?: string;
  country: string;
  currency: "XOF" | "XAF";
  taxId: string;
  phone: string;
  city: string;
  address?: string;
  activityDomain?: string;
  avatar: string;
  role?: string;
  paymentMethods?: {
    tmoney?: { phone?: string; merchantCode?: string; enabled?: boolean };
    flooz?: { phone?: string; merchantCode?: string; enabled?: boolean };
    wave?: { phone?: string; enabled?: boolean };
    orangeMoney?: { phone?: string; enabled?: boolean };
    bankTransfer?: { iban?: string; bankName?: string; swift?: string; enabled?: boolean };
    [key: string]: unknown;
  };
  defaultTaxRate?: number;
  paymentTermDays?: number;
  invoicePrefix?: string;
  defaultNotes?: string;
}

export type NotificationType = "payment" | "due_soon" | "overdue" | "referral" | "system";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  createdAt: string;
  read: boolean;
  type: NotificationType;
  link?: string;
  amount?: number;
}

export interface ReferralItem {
  id: string;
  name: string;
  company: string;
  country: string;
  date: string;
  status: "active" | "pending" | "rewarded";
  rewardAmount: number;
}

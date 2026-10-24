import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats an amount in FCFA with non-breaking spaces (U+00A0)
 * Example: 250000 -> "250 000 FCFA"
 */
export function formatFCFA(amount: number | bigint): string {
  const numericAmount = typeof amount === "bigint" ? Number(amount) : amount;
  const rounded = Math.round(numericAmount);
  
  // Format with space as thousands separator
  const parts = Math.abs(rounded).toString().split("");
  let result = "";
  let count = 0;
  
  for (let i = parts.length - 1; i >= 0; i--) {
    result = parts[i] + result;
    count++;
    if (count % 3 === 0 && i > 0) {
      result = "\u00A0" + result; // non-breaking space
    }
  }
  
  const sign = rounded < 0 ? "-" : "";
  return `${sign}${result}\u00A0FCFA`;
}

/**
 * Formats an ISO date or Date object to DD/MM/YYYY
 * Example: "2026-10-18" -> "18/10/2026"
 */
export function formatDate(dateInput: string | Date): string {
  if (!dateInput) return "";
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return String(dateInput);
  
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
}

export type DatePresetKey =
  | "all"
  | "today"
  | "this_month"
  | "last_month"
  | "last_30_days"
  | "this_quarter"
  | "this_year"
  | "last_year"
  | "last_12_months"
  | "by_year"
  | "custom";

export interface DateRange {
  key: DatePresetKey;
  label: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  year?: number;
}

export function getDateRangeForPreset(
  key: DatePresetKey,
  custom?: { start?: string; end?: string; year?: number }
): DateRange {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  const pad = (n: number) => String(n).padStart(2, "0");
  const toYMD = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  switch (key) {
    case "today": {
      const todayStr = toYMD(now);
      return {
        key: "today",
        label: "Aujourd'hui",
        startDate: todayStr,
        endDate: todayStr,
      };
    }
    case "this_month": {
      const start = new Date(currentYear, currentMonth, 1);
      const end = new Date(currentYear, currentMonth + 1, 0);
      const monthName = start.toLocaleDateString("fr-FR", { month: "long" });
      const capMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
      return {
        key: "this_month",
        label: `Ce mois (${capMonth} ${currentYear})`,
        startDate: toYMD(start),
        endDate: toYMD(end),
      };
    }
    case "last_month": {
      const start = new Date(currentYear, currentMonth - 1, 1);
      const end = new Date(currentYear, currentMonth, 0);
      const monthName = start.toLocaleDateString("fr-FR", { month: "long" });
      const capMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
      return {
        key: "last_month",
        label: `Mois dernier (${capMonth} ${start.getFullYear()})`,
        startDate: toYMD(start),
        endDate: toYMD(end),
      };
    }
    case "last_30_days": {
      const start = new Date();
      start.setDate(now.getDate() - 30);
      return {
        key: "last_30_days",
        label: "30 derniers jours",
        startDate: toYMD(start),
        endDate: toYMD(now),
      };
    }
    case "this_quarter": {
      const quarter = Math.floor(currentMonth / 3);
      const start = new Date(currentYear, quarter * 3, 1);
      const end = new Date(currentYear, (quarter + 1) * 3, 0);
      return {
        key: "this_quarter",
        label: `Ce trimestre (T${quarter + 1} ${currentYear})`,
        startDate: toYMD(start),
        endDate: toYMD(end),
      };
    }
    case "this_year": {
      return {
        key: "this_year",
        label: `Année en cours (${currentYear})`,
        startDate: `${currentYear}-01-01`,
        endDate: `${currentYear}-12-31`,
        year: currentYear,
      };
    }
    case "last_year": {
      const lastY = currentYear - 1;
      return {
        key: "last_year",
        label: `Année dernière (${lastY})`,
        startDate: `${lastY}-01-01`,
        endDate: `${lastY}-12-31`,
        year: lastY,
      };
    }
    case "last_12_months": {
      const start = new Date();
      start.setFullYear(now.getFullYear() - 1);
      return {
        key: "last_12_months",
        label: "12 derniers mois",
        startDate: toYMD(start),
        endDate: toYMD(now),
      };
    }
    case "by_year": {
      const y = custom?.year || currentYear;
      return {
        key: "by_year",
        label: `Exercice ${y}`,
        startDate: `${y}-01-01`,
        endDate: `${y}-12-31`,
        year: y,
      };
    }
    case "custom": {
      const s = custom?.start || `${currentYear}-01-01`;
      const e = custom?.end || toYMD(now);
      const formatDisplay = (ymd: string) => {
        const parts = ymd.split("-");
        if (parts.length === 3) {
          return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return ymd;
      };
      return {
        key: "custom",
        label: `Du ${formatDisplay(s)} au ${formatDisplay(e)}`,
        startDate: s,
        endDate: e,
      };
    }
    case "all":
    default: {
      return {
        key: "all",
        label: "Toutes les dates",
      };
    }
  }
}

export function isInvoiceInDateRange(issueDate: string | undefined, range: DateRange): boolean {
  if (range.key === "all") return true;
  if (!issueDate) return false;

  const d = issueDate.slice(0, 10);
  if (range.startDate && d < range.startDate) return false;
  if (range.endDate && d > range.endDate) return false;
  return true;
}

export function formatRangeLabel(startDate?: string, endDate?: string): string {
  if (!startDate || !endDate) return "Période personnalisée";
  if (startDate === endDate) {
    const parts = startDate.split("-");
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  const sParts = startDate.split("-");
  const eParts = endDate.split("-");
  return `Du ${sParts[2]}/${sParts[1]}/${sParts[0]} au ${eParts[2]}/${eParts[1]}/${eParts[0]}`;
}



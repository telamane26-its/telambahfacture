import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { AuthProvider } from "@/lib/auth-context";
import { DataProvider } from "@/lib/data-context";
import { CommandPaletteModal } from "@/components/layout/CommandPaletteModal";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Telambah Facture — SaaS de facturation pour entrepreneurs africains (zone FCFA)",
  description: "Créez, envoyez et suivez vos factures conformes en FCFA avec suivi des paiements Mobile Money (Wave, Orange Money).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className={plusJakarta.variable}>
      <body className="min-h-screen font-sans bg-background text-foreground antialiased selection:bg-brand-100 selection:text-brand-900 dark:selection:bg-brand-900 dark:selection:text-brand-100">
        <ThemeProvider>
          <AuthProvider>
            <DataProvider>
              {children}
              <CommandPaletteModal />
            </DataProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

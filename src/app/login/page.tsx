"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import {
  Receipt,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Moon,
  Sun,
  CheckCircle2,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const { user, signIn, isLoading: authLoading } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (!authLoading && user) {
      router.replace(redirectPath);
    }
  }, [user, authLoading, router, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Veuillez renseigner votre email et votre mot de passe.");
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await signIn(email.trim(), password);
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrorMsg("Adresse email ou mot de passe incorrect.");
        } else {
          setErrorMsg(error.message || "Erreur de connexion. Veuillez réessayer.");
        }
      } else {
        router.replace(redirectPath);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Une erreur inattendue est survenue.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0F1117] flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden selection:bg-emerald-100 selection:text-emerald-900">
      {/* Ambient background halos */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] landing-ambient-halo -z-10" />
      <div className="pointer-events-none fixed top-40 right-10 w-80 h-80 bg-indigo-50/40 dark:bg-indigo-950/20 rounded-full blur-3xl -z-10" />

      {/* Top Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-2 sm:py-4">
        {/* Logo redirecting to Landing Page */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-transform hover:scale-[1.02]"
          title="Retourner à l'accueil Telambah"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/25 group-hover:bg-emerald-700 transition-colors">
            <Receipt className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight leading-tight">
              Telambah<span className="text-emerald-600 text-lg">.</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold -mt-0.5">
              Facture
            </span>
          </div>
          <span className="hidden sm:inline-block ml-1 px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800">
            Zone FCFA 🇹🇬
          </span>
        </Link>

        {/* Right Nav actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Accueil</span>
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-2xs transition-all"
            aria-label="Basculer le thème"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          <Link
            href="/register"
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-xs font-semibold hover:border-slate-300 transition-colors"
          >
            <span>Créer un compte</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="max-w-md mx-auto w-full my-auto py-6 sm:py-8">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/50">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Espace Professionnel Sécurisé</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Connexion à votre compte
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Retrouvez vos factures OHADA, vos devis et vos encaissements Mobile Money.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-start gap-2.5 text-rose-700 dark:text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Adresse email professionnelle
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@entreprise.tg"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mot de passe
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:ring-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/25 hover:shadow-lg hover:shadow-emerald-600/30 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <span>Accéder à mon espace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Vous n&apos;avez pas encore de compte ?{" "}
              <Link
                href="/register"
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline transition-colors"
              >
                Créer un compte gratuitement
              </Link>
            </p>
          </div>
        </div>

        {/* Security badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-4 text-[11px] text-slate-500 dark:text-slate-400 text-center">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Données isolées et chiffrées</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Conformité OHADA Zone FCFA</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full text-center py-4 text-[11px] text-slate-400 dark:text-slate-500">
        Telambah Facture © 2026 · Conçu au Togo 🇹🇬 pour l&apos;Afrique de l&apos;Ouest & Centrale
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0F1117] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-slate-300 dark:border-slate-700 border-t-emerald-600 animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}

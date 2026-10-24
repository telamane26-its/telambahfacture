"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const { user, signIn, isLoading: authLoading } = useAuth();

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
    } catch (err: any) {
      setErrorMsg(err.message || "Une erreur inattendue est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0F1117] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-extrabold text-lg shadow-sm">
            T
          </div>
          <div>
            <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
              Telambah<span className="text-slate-400 font-medium">Facture</span>
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700">
              Zone FCFA 🇹🇬
            </span>
          </div>
        </div>

        <Link
          href="/register"
          className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          Créer un compte →
        </Link>
      </header>

      {/* Center Auth Card */}
      <main className="max-w-md mx-auto w-full my-auto py-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Connexion à votre espace
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Gérez votre facturation OHADA et vos règlements Mobile Money en toute simplicité.
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
                  placeholder="contact@votre-entreprise.tg"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
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
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
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
              className="w-full mt-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
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
                className="font-bold text-slate-900 dark:text-white hover:underline transition-colors"
              >
                Créer un compte gratuitement
              </Link>
            </p>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Données isolées et chiffrées · Conformité OHADA Zone FCFA</span>
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
          <div className="w-8 h-8 rounded-full border-2 border-slate-300 dark:border-slate-700 border-t-slate-900 dark:border-t-white animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}

"use client";

import React, { useState } from "react";
import { Gift, Copy, Check, MessageSquare, Users, Sparkles, Award, X } from "lucide-react";
import { useData } from "@/lib/data-context";
import { formatFCFA } from "@/lib/utils";

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast?: (msg: string) => void;
}

export function ReferralModal({ isOpen, onClose, onSuccessToast }: ReferralModalProps) {
  const { referralCode, referralLink, referrals, totalReferralsEarned } = useData();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    onSuccessToast?.("Lien de parrainage copié dans le presse-papier !");
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `Bonjour ! J'utilise Telambah Facture pour émettre des factures professionnelles conformes (Togo & zone FCFA) et encaisser mes paiements par TMoney, Flooz et virement bancaire.\n\nInscris ton entreprise avec mon lien pour bénéficier de 1 mois d'abonnement Pro offert : ${referralLink}`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-screen flex items-center justify-center p-3 sm:p-6">
        <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center font-bold">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Programme de Parrainage
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    Actif · Zone FCFA 🇹🇬
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Partagez Telambah avec vos confrères et gagnez des crédits
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
            {/* Promo Banner */}
            <div className="p-5 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white border border-slate-800 dark:border-slate-700 relative overflow-hidden">
              <div className="relative z-10 space-y-2 max-w-lg">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-slate-200">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Avantage Ambassadeur Panafricain</span>
                </div>
                <h4 className="text-lg font-bold font-sans leading-snug">
                  Gagnez 10 000 FCFA ou 1 mois offert pour chaque entreprise parrainée
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Invitez vos confrères entrepreneurs, PME ou consultants à simplifier leur facturation. Dès leur première facture émise, vous recevez automatiquement vos crédits.
                </p>
              </div>
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            </div>

            {/* Referral Link & Code Section */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Votre lien et code de parrainage exclusif :
              </label>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 select-all focus:outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {referralCode}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white flex items-center justify-center gap-1.5 shadow-xs transition-all hover:-translate-y-0.5 active:scale-95"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? "Lien copié !" : "Copier"}</span>
                  </button>

                  <a
                    href={`https://wa.me/?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 shadow-xs transition-all hover:-translate-y-0.5 active:scale-95"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* KPI Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Entreprises Parrainées
                </p>
                <p className="text-xl font-bold font-sans text-slate-900 dark:text-white mt-1">
                  {referrals.length}
                </p>
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  3 actives · 1 en attente
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Crédits Cumulés
                </p>
                <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
                  {formatFCFA(totalReferralsEarned)}
                </p>
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  Déductible sur vos frais
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Statut Ambassadeur
                </p>
                <p className="text-xl font-bold font-sans text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
                  <Award className="w-5 h-5 text-amber-500 inline" />
                  <span>Argent</span>
                </p>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 block">
                  Palier Or à 5 filleuls
                </span>
              </div>
            </div>

            {/* Referrals History List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>Vos Filleuls Enregistrés</span>
              </h4>

              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {referrals.map((ref) => (
                  <div
                    key={ref.id}
                    className="p-3.5 flex items-center justify-between gap-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {ref.company}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {ref.name} · {ref.country} · Rejoint le {ref.date}
                      </p>
                    </div>

                    <div className="text-right flex items-center gap-2.5">
                      <div className="font-mono text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                        +{formatFCFA(ref.rewardAmount)}
                      </div>
                      {ref.status === "rewarded" ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          Validé
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                          En attente
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              « Chaque recommandation fait grandir l&apos;écosystème entrepreneurial d&apos;Afrique de l&apos;Ouest. »
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white transition-all hover:-translate-y-0.5 active:scale-95"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

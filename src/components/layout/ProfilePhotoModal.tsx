"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef } from "react";
import { Camera, Upload, Trash2, Check, X, RotateCcw, AlertCircle } from "lucide-react";
import { useData } from "@/lib/data-context";

interface ProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast?: (msg: string) => void;
}

export function ProfilePhotoModal({ isOpen, onClose, onSuccessToast }: ProfilePhotoModalProps) {
  const { currentUser, uploadAvatar, resetAvatar } = useData();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentAvatar = previewUrl || currentUser.avatar;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).");
      return;
    }

    // Validate size (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("L'image est trop volumineuse (maximum 5 Mo).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
    };
    reader.onerror = () => {
      setErrorMsg("Erreur lors de la lecture du fichier image.");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (previewUrl) {
      setIsSaving(true);
      uploadAvatar(previewUrl);
      setIsSaving(false);
      onSuccessToast?.("Photo de profil mise à jour avec succès !");
      onClose();
    }
  };

  const handleResetToDefault = () => {
    resetAvatar();
    setPreviewUrl(null);
    onSuccessToast?.("Photo par défaut rétablie.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center font-bold">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Photo de Profil
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Modifiez votre avatar utilisateur
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
          <div className="p-6 space-y-6 flex flex-col items-center text-center">
            {/* Avatar Preview */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-slate-100 dark:ring-slate-800 shadow-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <img
                  src={currentAvatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Click to upload overlay badge */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                title="Choisir une photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Hidden Input File */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {currentUser.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentUser.companyName}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Format JPG, PNG ou WebP. Max 5 Mo.
              </p>
            </div>

            {errorMsg && (
              <div className="w-full p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Upload Button */}
            <div className="w-full grid grid-cols-1 gap-2 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:scale-95 shadow-xs"
              >
                <Upload className="w-4 h-4" />
                <span>{previewUrl ? "Changer de fichier" : "Importer une image depuis l'appareil"}</span>
              </button>

              <button
                type="button"
                onClick={handleResetToDefault}
                className="w-full py-2 px-3 text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Rétablir la photo par défaut</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              disabled={!previewUrl || isSaving}
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white flex items-center gap-1.5 shadow-sm transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? "Enregistrement..." : "Appliquer la photo"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

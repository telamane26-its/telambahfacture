# Règle Antigravity — Design System & Standards UI/UX Telambah Facture

> **Statut : Obligatoire & Permanent**  
> **Portée :** Tout nouveau composant, page, modal, widget ou modification d'interface dans le projet **Telambah Facture**.  
> **Objectif :** Garantir une cohérence esthétique et ergonomique totale au standard SaaS international (Dribbble / Awwwards) pensé d'abord pour l'univers togolais 🇹🇬 et étendu à l'ensemble de l'écosystème panafricain (zone FCFA - UEMOA / CEMAC).

---

## 1. Identité de Marque & Naming

* **Nom officiel du produit :** `Telambah Facture` (ou `Telambah` dans les badges / logos compacts).
* **Baseline :** `SaaS de facturation panafricain conçu au Togo (zone FCFA)` ou `Facturation Zone FCFA · Conforme OTR & OHADA`.
* **Origine & Ancrage :** Conçu par des entrepreneurs togolais, ancré à Lomé (Togo 🇹🇬) avec prise en charge native des télécoms et moyens de paiement locaux (**TMoney**, **Flooz / Moov Africa Togo**), et connecté à l'espace économique régional (**Wave**, **Orange Money**, **Ecobank**, etc.).
* **Marché & Périmètre :** Togo, Sénégal, Côte d'Ivoire, Bénin, Cameroun, Mali, Burkina Faso, etc. Conformité OTR (Office Togolais des Recettes) & Acte Uniforme OHADA révisé.

---

## 2. Typographie & Hiérarchie

L'application utilise une combinaison de deux polices complémentaires définies dans `layout.tsx` :

1. **Titres éditoriaux / Hero / En-têtes de factures :**
   * Police avec empattement : `font-serif` (Fraunces).
   * Utilisation : `h1`, `h2`, mot `FACTURE` sur les aperçus, salutations (`Bonjour, Isaac 👋`), cartes héroïques.
2. **Interface utilisateur / Corps de texte / Formulaires / Données :**
   * Police sans-serif : `font-sans` (Plus Jakarta Sans).
   * Utilisation : labels, boutons, menus de navigation, badges, descriptions.
3. **Données chiffrées & Financières :**
   * Toujours accompagner les montants, dates et numéros de factures de `tabular-nums` et `font-mono` (ou `font-semibold font-sans tabular-nums`) pour un alignement strict des colonnes financières.

---

## 3. Système de Couleurs & Tokens Tailwind

Toute couleur utilisée doit provenir de la palette officielle définie dans `tailwind.config.ts` :

### 3.1. Palette Marque (Violet / Prune Impérial)
* `brand-50` : `#FBF5FD` (fonds d'accent clairs)
* `brand-100` : `#F3E7F9` (badges, surbrillances)
* `brand-200` : `#EDD5F6` (bordures douces)
* `brand-500` : `#A530D8` (couleur primaire principale, boutons CTA, icônes clés)
* `brand-600` : `#9224C1` (survol primaire)
* `brand-700` : `#791B9F` (textes forts, titres financiers)
* `brand-900` : `#451557` (bannières profondes)
* `brand-950` : `#240C2D` (mode sombre profond)

### 3.2. Statuts Métier Obligatoires (Règle stricte)
Tout composant affichant un statut de facture doit respecter ces classes :
* **Payée (Paid) :** Vert / Émeraude  
  `bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/50` + puce verte `bg-emerald-500`.
* **Envoyée (Sent) :** Orange / Ambre  
  `bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/50` + puce orange `bg-amber-500`.
* **Brouillon (Draft) :** Gris / Ardoise  
  `bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600` + puce grise `bg-slate-400`.
* **En retard (Overdue) :** Rouge / Rose  
  `bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/50` + puce rouge pulsante `bg-rose-500 animate-pulse`.

---

## 4. Règle Absolue du Mode Sombre (Dark Mode)

Chaque composant créé ou modifié **DOIT obligatoirement supporter le mode sombre** via les variantes `dark:` de Tailwind CSS (`darkMode: "class"` avec `next-themes`) :

* **Fonds de conteneurs / Cartes :** `bg-white dark:bg-slate-800/80` ou `dark:bg-slate-900`.
* **Fond global de page :** `bg-[#F8F9FC] dark:bg-[#0F1117]`.
* **Bordures :** `border-slate-200/90 dark:border-slate-700/60` ou `dark:border-slate-800`.
* **Titres principaux :** `text-slate-900 dark:text-white`.
* **Textes secondaires / Labels :** `text-slate-600 dark:text-slate-300`, `text-slate-500 dark:text-slate-400`.
* **Champs de formulaire / Inputs / Selects :**
  `bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800`.
* **Survols de lignes / tableaux :** `hover:bg-purple-50/40 dark:hover:bg-brand-950/30`.

---

## 5. Micro-animations & Expérience Utilisateur Tactile

Tout élément cliquable (boutons, liens, sélecteurs, checkboxes, cartes d'action) doit faire vivre l'interface :
1. **Transitions fluides :** `transition-all duration-200 ease-out`.
2. **Élévation au survol (Hover lift) :** `hover:-translate-y-0.5 hover:shadow-xs` ou `hover:shadow-card`.
3. **Pression au clic (Active feedback) :** `active:scale-95` ou `active:scale-[0.98] active:translate-y-0`.
4. **Micro-mouvements des icônes :**
   * Flèches CTA : `group-hover:translate-x-0.5 transition-transform`
   * Boutons `+` : `group-hover:rotate-90 transition-transform duration-200`
   * Soleils / Lunes : rotation légère au survol.

---

## 6. Règles Financières & Locales (Togo & Panafricain)

1. **Montants toujours entiers :**
   Le FCFA ne possède pas de centimes. Toujours formater avec `formatFCFA(amount)` (ex : `1 500 000 FCFA`). Ne jamais afficher de décimales.
2. **Calcul de la TVA :**
   Taux légal standard de **18%** (Directives UEMOA & OTR Togo) appliqué au sous-total HT net de remise :
   `taxAmount = Math.round(subtotalAfterDiscount * 0.18)`
3. **Numérotation des factures :**
   Format chronologique séquentiel OHADA : `FAC-YYYY-NNNN` (ex: `FAC-2026-0043`).
4. **Moyens de paiement intégrés :**
   Priorité à **TMoney (Togocom)**, **Flooz (Moov Africa)**, **Wave**, **Orange Money** et virements bancaires (**Ecobank**, Coris Bank, Orabank).

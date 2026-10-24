# Règle de Développement & Design System Telambah Facture

Ce fichier définit les directives obligatoires que tout agent d'assistance de code Antigravity doit respecter pour le projet **Telambah Facture**.

---

## 1. Identité et Naming
* **Nom du produit :** `Telambah Facture` (ou `Telambah` dans les en-têtes et badges compacts).
* **Baseline :** `SaaS de facturation panafricain conçu au Togo (zone FCFA)` ou `Facturation Zone FCFA · Conforme OHADA`.
* **Origine & Ancrage :** Conçu par des entrepreneurs togolais pour le Togo 🇹🇬 (Lomé, TMoney, Flooz) et l'ensemble de l'Afrique francophone (UEMOA / CEMAC).
* Ne jamais réintroduire l'ancien nom de code "Cauris".
* **Fiscalité OTR :** STRICTEMENT OPTIONNELLE. Ne jamais imposer de NIF obligatoire ni de mention OTR forcée pour les indépendants.

---

## 2. Design System & Tokens d'Interface
Tout nouveau composant (page, modal, tableau, widget, carte) doit strictement respecter :

### Typographie
* **Typographie unifiée (Identique au titre Telambah) :** `font-sans` (Plus Jakarta Sans) partout pour l'ensemble des titres, bannières, modales, boutons et textes de l'application.
* **Aucune police serif :** Ne pas utiliser de police avec empattement (`Fraunces` ou `font-serif`) afin de garantir une harmonie totale et moderne.
* **Chiffres financiers & Dates :** `tabular-nums font-mono` ou `font-semibold font-sans tabular-nums`.

### Couleurs & Tokens Tailwind
* **Couleur de marque :** Palette monochrome et ardoise minimaliste `brand-50` à `brand-950` (noir profond, gris ardoise `#0F172A`, blanc pur) pour une interface sobre, reposante et haut de gamme.
* **Statuts de factures :**
  - **Payée :** Vert `bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/50` + puce `bg-emerald-500`.
  - **Envoyée :** Orange `bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/50` + puce `bg-amber-500`.
  - **Brouillon :** Gris `bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600` + puce `bg-slate-400`.
  - **En retard :** Rouge `bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/50` + puce pulsante `bg-rose-500 animate-pulse`.

### Support Obligatoire du Mode Sombre
Chaque conteneur, texte, bouton, bordure et champ de saisie doit posséder ses variantes sombres :
* Page : `bg-[#F8F9FC] dark:bg-[#0F1117]`
* Cartes / Modales : `bg-white dark:bg-slate-800/80` ou `dark:bg-slate-900`
* Bordures : `border-slate-200/90 dark:border-slate-700/60`
* Textes : `text-slate-900 dark:text-white` et `text-slate-600 dark:text-slate-400`
* Inputs : `bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white`

### Micro-Animations Systématiques
Tout élément interactif doit intégrer :
* `transition-all duration-200 ease-out`
* Survol avec micro-élévation : `hover:-translate-y-0.5 hover:shadow-xs` ou `hover:scale-105`
* Pression tactile au clic : `active:scale-95`
* Micro-mouvements des icônes au survol du parent (`group-hover:...`).

---

## 3. Règles Métier Financières & Écosystème Togolais / Panafricain
1. **Montants sans centimes :** Toujours entiers (ex: `1 500 000 FCFA`), formatés avec `formatFCFA()`.
2. **Taux de TVA :** 18% légal standard UEMOA / Togo (OTR - Office Togolais des Recettes) calculé sur le montant HT net de remise.
3. **Numérotation séquentielle OHADA :** `FAC-YYYY-NNNN`.
4. **Dates françaises :** `formatDate()` (ex: `18 oct. 2026`).
5. **Identifiant fiscal NIF (Optionnel) :** Strictement optionnel. N'est affiché sur les factures et le profil que si l'utilisateur choisit de l'activer dans les paramètres.
6. **Paiement Mobile Money :** Mise en avant prioritaire de **TMoney (Togocom)** et **Flooz (Moov Africa)** au Togo, ainsi que **Wave** et **Orange Money** dans la sous-région, avec génération de liens WhatsApp pré-remplis pour les partages et relances.

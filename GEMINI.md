# Telambah Facture — Documentation Technique & Guide de Référence IA

Ce document constitue la référence centrale pour comprendre l'architecture, la vision métier, les décisions de design et les fonctionnalités de **Telambah Facture**. Tout modèle d'IA intervenant sur ce dépôt doit impérativement lire et respecter ce fichier.

---

## 1. Ce que l'application fait

**Telambah Facture** est une application SaaS de facturation et de gestion commerciale conçue au Togo 🇹🇬 pour les entrepreneurs, consultants, PME et indépendants d'Afrique francophone (Zone Franc CFA : UEMOA & CEMAC).

### Mission et Problématique Résolue
Les logiciels de facturation occidentaux (QuickBooks, FreshBooks, etc.) imposent des devises avec centimes, des passerelles de paiement inadaptées (Stripe, PayPal) et ignorent les réalités commerciales africaines.

**Telambah Facture répond directement à ces besoins :**
- **Facturation 100% en FCFA (XOF / XAF)** avec montants entiers stricts (zéro centime).
- **Conformité commerciale aux standards OHADA** (numérotation séquentielle `FAC-YYYY-NNNN`, mentions légales, TVA standard UEMOA de 18%).
- **Intégration native du Mobile Money :** Mise en avant prioritaire de **TMoney (Togocom)** et **Flooz (Moov Africa)** pour le Togo, complétés par **Wave Digital Finance** et les coordonnées de virement bancaire (IBAN Ecobank Togo, etc.).
- **Partage et Relances WhatsApp automatisés :** Génération de liens `wa.me` pré-remplis avec message courtois, numéro de facture, montant et canaux de règlement pour relancer les clients sans friction.
- **Fiscalité intelligente et NIF débrayable :** L'application ne force **aucune mention fiscale obligatoire** par défaut. Les entrepreneurs non assujettis à l'OTR (Office Togolais des Recettes) facturent en toute légalité sous le régime OHADA. Pour ceux qui possèdent un NIF, une option activable permet de l'intégrer automatiquement.
- **Authentification & Multi-tenant natif (Supabase Auth) :** Système d'inscription (`/register`), de connexion (`/login`) et de déconnexion sécurisé. Chaque utilisateur dispose d'un compte étanche et privé (`user_id = auth.uid()`). Aucun jeu de données fictif n'est imposé : un nouvel inscrit commence avec son propre espace vierge et ses propres coordonnées réelles.
- **Téléchargement PDF instantané :** Génération côté client de factures vectorielles A4 haute définition directement téléchargeables.

---

## 2. Toutes les Fonctionnalités Implémentées

### A. Authentification & Sécurité — `/login`, `/register`
- **Page de Connexion (`/login`) :** Authentification par email et mot de passe, gestion des erreurs d'authentification, redirection automatique vers la page demandée après connexion.
- **Page d'Inscription (`/register`) :** Création de compte en 1 étape avec Nom complet, Nom de l'entreprise, Email et Mot de passe. Déclenchement automatique du trigger PostgreSQL pour provisionner le profil utilisateur dans `public.profiles`.
- **Garde de Route (`AuthGuard`) :** Protection automatique de toutes les pages sensibles (`/dashboard`, `/invoices`, `/clients`, `/products`, `/reports`, `/settings`). Redirection vers `/login` si l'utilisateur n'est pas connecté.
- **Déconnexion réelle :** Bouton de déconnexion dans le menu utilisateur invalidant la session Supabase et nettoyant le cache local.

### B. Tableau de Bord (Dashboard) — `/dashboard` ou `/`
- **Hero Banner dynamique :** Message de bienvenue personnalisé avec nom du dirigeant et entreprise, raccourcis de création rapide et accès direct aux statistiques.
- **KPIs Financiers en temps réel :**
  - Chiffre d'Affaires Encaissé (total factures payées).
  - En attente d'encaissement (factures envoyées).
  - Factures en retard (alerte visuelle avec badge rouge pulsant).
  - Factures en brouillon.
- **Bannière d'Alerte Retards de Paiement :** Liste les factures dont l'échéance est dépassée avec bouton de relance immédiate par WhatsApp.
- **Graphique de Chiffre d'Affaires Mensuel :** Histogramme interactif en FCFA comparant les montants encaissés et facturés sur l'exercice en cours.
- **Tableau des Factures Récentes :**
  - Filtres par statut (*Toutes, Payées, Envoyées, En retard, Brouillon*).
  - Recherche instantanée par client ou numéro de facture.
  - Clic sur une ligne pour ouvrir la modale détaillée.
  - Actions rapides par ligne : aperçu, relance WhatsApp, téléchargement PDF.

### B. Gestion des Factures — `/invoices`, `/invoices/new`, `/invoices/[id]`
- **Création de facture (`/invoices/new`) :**
  - Sélection du client via liste déroulante dynamique ou redirection vers création client.
  - Date d'émission (date du jour par défaut) et date d'échéance (calculée automatiquement selon le délai configuré : comptant, 15j, 30j, 45j, 60j).
  - Lignes de prestation dynamiques : Description, Quantité, Prix unitaire en FCFA. Calcul automatique du total de ligne.
  - Boutons d'ajout et suppression de ligne.
  - Calculs financiers automatiques : Total HT, Remise globale éventuelle, TVA 18%, Total TTC en FCFA arrondi à l'entier.
  - Prévisualisation interactive en direct (format feuille A4) mise à jour à chaque frappe.
  - Sauvegarde comme *Brouillon* ou marquage comme *Envoyée*.
- **Liste complète des factures (`/invoices`) :**
  - Vue tabulaire exhaustive avec pagination/scroll, compteurs par statut, recherche et export.
- **Page de détail de facture (`/invoices/[id]`) :**
  - Rendu complet format document A4 imprimable avec coordonnées émetteur et client, détails des prestations, totaux et coordonnées bancaires/Mobile Money.
  - Menu déroulant de changement rapide de statut (*Brouillon → Envoyée → Payée*).
  - Bouton Télécharger PDF vectoriel haute fidélité.
  - Bouton Relance WhatsApp pré-formatée.
  - Bouton Modifier (ouvre le formulaire pré-rempli).
  - Bouton Supprimer avec modale de confirmation sécurisée.

### C. Répertoire des Clients — `/clients`
- Annuaire complet des entreprises et partenaires commerciaux.
- Fiche client : Nom légal, Responsable de compte, Email, Téléphone, Ville/Quartier, Pays, Numéro fiscal éventuel (NIF, NINEA, NCC, etc.).
- Statistiques client : Total facturé, Total encaissé, Nombre de factures associées.
- Modale d'ajout et d'édition de client avec validation.
- Suppression sécurisée de client (avec contrôle des factures rattachées).
- Liens directs : Appel téléphonique, Envoi d'email, Discussion WhatsApp.

### D. Catalogue Produits & Services — `/products`
- Gestion des forfaits, prestations et articles standardisés.
- Champs : Désignation, Catégorie (Design, Dév Web, Conseil, Support, etc.), Prix unitaire FCFA, Unité (prestation, heure, jour, mois), Taux de TVA.
- Recherche, filtrage par catégorie et ajout rapide dans les factures.

### E. Trésorerie & Rapports — `/reports`
- Synthèse de rentabilité financière de l'entreprise.
- Ventilation de la TVA collectée sur l'exercice.
- Taux de recouvrement et délai moyen de règlement client.
- Export des données financières en CSV et JSON pour la comptabilité.

### F. Palette de Commande & Recherche Globale (`⌘K` / `Ctrl+K`)
- **Raccourci universel accessible depuis n'importe quelle page :**
  - `⌘K` ou `Ctrl+K` : Ouvre la palette de commande.
  - `⌘1` : Bascule instantanément entre Mode Clair et Mode Sombre.
  - `⌘2` : Ouvre directement les Paramètres.
  - `⌘3` : Ouvre le centre de Notifications.
  - `Échap` : Ferme la palette.
- **Recherche temps réel multi-entités :** Factures (numéro, client, montant, statut), Clients (nom, contact, téléphone, ville), Services du catalogue, et Actions rapides de navigation.
- **Navigation intégrale au clavier** (flèches `↑` `↓`, touche `Entrée`).

### G. Paramètres de l'Entreprise — `/settings`
- **Profil de l'entreprise :**
  - *Identité de l'entreprise :* Raison sociale, Forme juridique (SARL, SAS, Freelance...), Registre du Commerce (RC/RCCM), Adresse physique du siège, Ville, Pays (Zone FCFA), Domaine d'activité.
  - *Coordonnées du contact :* Contact principal/dirigeant, Email de facturation, Téléphone professionnel, Site web.
  - *Identifiant Fiscal & NIF (Optionnel) :* Interrupteur switch activable/désactivable situé en bas. Si désactivé, l'application fonctionne de manière autonome en facturation commerciale directe OHADA sans imposer de NIF.
- **Règles de Facturation & Fiscalité :** Devise (XOF / XAF), Taux de TVA par défaut (18%), Délai de paiement par défaut, Préfixe de numérotation séquentielle, Mentions de bas de page.
- **Canaux de Paiement Mobile Money & Virement :** Configuration et activation de TMoney (Togocom), Flooz (Moov Togo), Wave et IBAN bancaire.
- **Thèmes & Apparence :** Sélecteur visuel Mode Clair / Mode Sombre OLED, pastilles de raccourcis interactives cliquables.
- **Sauvegarde & Sécurité :** Export complet des données au format JSON et bouton de réinitialisation du stockage local.

### H. Système de Modales & Notifications
- **Modale de Détail Facture (`InvoiceDetailsModal`) :** Aperçu rapide sans quitter le tableau de bord.
- **Centre de Notifications (`NotificationsModal`) :** Alertes d'échéances dépassées, nouveaux parrainages, synthèses mensuelles avec badge non lu.
- **Programme de Parrainage (`ReferralModal`) :** Code parrainage unique, prime de 10 000 FCFA par filleul et lien de partage WhatsApp pré-rempli.
- **Changement de Photo de Profil / Logo (`ProfilePhotoModal`) :** Import d'avatar/logo en local avec aperçu instantané.

---

## 3. Structure des Fichiers

```
c:/Users/isaac/Isaac-Facture/
├── AGENTS.md                         # Directives de développement & tokens d'interface stricts
├── GEMINI.md                         # Ce fichier (Guide complet d'architecture et de référence IA)
├── package.json                      # Dépendances et scripts de build
├── tailwind.config.ts                # Configuration Tailwind (palette monochrome brand, statuts)
├── tsconfig.json                     # Configuration TypeScript avec alias @/*
├── next.config.mjs                   # Configuration Next.js
│
├── public/                           # Assets statiques, icônes et logos
│
└── src/
    ├── app/                          # Next.js App Router (Pages et Routes)
    │   ├── layout.tsx                # Layout racine (HTML, polices, ThemeProvider, DataProvider, CommandPaletteModal)
    │   ├── page.tsx                  # Redirection d'accueil vers /dashboard
    │   ├── globals.css               # Styles globaux, variables CSS et scrollbars
    │   ├── dashboard/page.tsx        # Vue Tableau de bord principale
    │   ├── invoices/
    │   │   ├── page.tsx              # Liste exhaustive des factures avec filtres
    │   │   ├── new/page.tsx          # Formulaire de création/édition de facture avec aperçu A4
    │   │   └── [id]/page.tsx         # Page de consultation détaillée, impression et actions
    │   ├── clients/page.tsx          # Gestion et répertoire des clients
    │   ├── products/page.tsx         # Catalogue des prestations et produits
    │   ├── reports/page.tsx          # Rapports financiers, trésorerie et ventilation TVA
    │   ├── settings/page.tsx         # Paramètres entreprise, Mobile Money, fiscalité, thèmes
    │   └── help/page.tsx             # Centre d'aide, FAQ et support technique Lomé
    │
    ├── components/                   # Composants React modulaires
    │   ├── layout/                   # Composants de mise en page globale
    │   │   ├── Sidebar.tsx           # Barre latérale desktop avec recherche ⌘K et navigation
    │   │   ├── MobileHeader.tsx      # En-tête mobile avec bouton menu, recherche et thème
    │   │   ├── MobileBottomNav.tsx   # Barre de navigation basse pour smartphones
    │   │   ├── CommandPaletteModal.tsx # Palette de commande globale ⌘K et recherche multi-entités
    │   │   ├── UserDropdown.tsx      # Menu profil utilisateur (avatar, parrainage, raccourcis)
    │   │   ├── NotificationsModal.tsx# Modale du centre de notifications
    │   │   ├── ReferralModal.tsx     # Modale du programme de parrainage (10 000 FCFA)
    │   │   └── ProfilePhotoModal.tsx # Modale d'upload et recadrage d'avatar/logo
    │   │
    │   └── dashboard/                # Composants dédiés au tableau de bord
    │       ├── OverviewHero.tsx      # Bannière d'accueil et bienvenue
    │       ├── StatCards.tsx         # Cartes KPI (CA encaissé, en attente, en retard)
    │       ├── OverdueAlertBanner.tsx# Bandeau d'alerte des factures échues
    │       ├── RevenueChart.tsx      # Graphique des recettes mensuelles
    │       ├── RecentInvoicesTable.tsx# Tableau interactif des factures récentes
    │       └── InvoiceDetailsModal.tsx # Modale d'inspection rapide d'une facture
    │
    ├── data/
    │   └── mock-data.ts              # Jeux de données initiaux (utilisateurs, clients, factures togolaises)
    │
    ├── lib/                          # Utilitaires, Contextes et Moteurs métier
    │   ├── data-context.tsx          # Contexte de données global (CRUD Factures, Clients, Profil, LocalStorage)
    │   ├── theme-context.tsx         # Gestionnaire de thème Clair / Sombre avec persistance
    │   ├── pdf-generator.ts          # Moteur de génération de PDF vectoriel haute définition (jsPDF)
    │   └── utils.ts                  # Fonctions helpers (formatFCFA, formatDate, cn, calculs TVA)
    │
    └── types/
        └── index.ts                  # Définitions TypeScript complètes (Invoice, Client, UserProfile, etc.)
```

---

## 4. Technologies Utilisées

| Couche | Technologie | Rôle & Justification |
| :--- | :--- | :--- |
| **Framework Web** | Next.js 14+ (App Router) | Architecture moderne en Server/Client Components, routing performant |
| **Backend & Base de Données** | Supabase (PostgreSQL 17) | Persistance Cloud temps réel (`invoices`, `clients`, `products`, `profiles`, `invoice_items`) |
| **Langage** | TypeScript | Typage strict pour la fiabilité des calculs financiers et des objets métier |
| **Styling** | Tailwind CSS (v3.4+) | Design system sur-mesure, tokens HSL/Hex, utilitaires de micro-animations |
| **Typographie** | Google Font : *Plus Jakarta Sans* | Police sans-serif moderne, épurée et géométrique, commune à toute l'UI |
| **Icônes** | Lucide React | Jeu d'icônes vectorielles cohérent, léger et élégant |
| **Génération PDF** | `jspdf` & `jspdf-autotable` | Création de documents A4 imprimables 100% côté client sans serveur tiers |
| **Gestion d'État & Persistance** | React Context API + LocalStorage | Réactivité instantanée sans rechargement, persistance locale des modifications |

---

## 5. Décisions de Design & Identité Visuelle

### Palette de Couleurs Minimaliste Monochrome
L'interface a été délibérément épurée pour éliminer toute agressivité visuelle (suppression des violets vifs d'anciennes versions) au profit d'un univers haut de gamme, sobre et professionnel :
- **Marque :** Nuances monochromes de noir profond, ardoise foncée (`#0F172A`), gris perle et blanc pur.
- **Accents de Statuts (Convention stricte) :**
  - **Payée :** Vert émeraude (`emerald-500`, `emerald-50`, `emerald-700`).
  - **Envoyée :** Orange ambre chaud (`amber-500`, `amber-50`, `amber-700`).
  - **Brouillon :** Gris ardoise neutre (`slate-400`, `slate-100`, `slate-700`).
  - **En retard :** Rouge rubis énergique (`rose-500`, `rose-50`, `rose-700`) avec puce d'alerte pulsante.

### Typographie Unifiée
- **Police unique sans-serif :** `font-sans` (*Plus Jakarta Sans*) sur **l'intégralité** des éléments (titres, cartes, modales, boutons, en-têtes).
- **Interdiction absolue des polices serif** (`Fraunces`, `font-serif`, etc.) afin de garantir une harmonie totale et moderne.
- **Montants & Données chiffrées :** Toujours en `tabular-nums font-mono` ou `font-semibold font-sans tabular-nums` pour un alignement parfait dans les tableaux.

### Prise en Charge Totale du Mode Sombre (Dark Mode)
Chaque conteneur, texte, bouton, bordure et champ de saisie dispose obligatoirement de son équivalent sombre :
- Pages : `bg-[#F8F9FC] dark:bg-[#0F1117]`
- Cartes & Modales : `bg-white dark:bg-slate-900` ou `dark:bg-slate-800/80`
- Bordures : `border-slate-200/90 dark:border-slate-800`
- Textes : `text-slate-900 dark:text-white` et `text-slate-600 dark:text-slate-400`
- Inputs : `bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white`
- *Attention :* Ne jamais inventer de classes comme `dark:bg-slate-850` non déclarées dans Tailwind.

### Micro-Animations Systématiques
- Tous les boutons et éléments interactifs intègrent `transition-all duration-200 ease-out`.
- Effet d'élévation au survol : `hover:-translate-y-0.5 hover:shadow-xs` ou `hover:scale-105`.
- Retour haptique visuel au clic : `active:scale-95`.

---

## 6. Instructions Impératives pour Tout Futur Modèle IA

Avant d'écrire ou de modifier la moindre ligne de code sur ce projet, vous **DEVEZ** respecter les règles suivantes sans exception :

1. **Naming & Identité de Marque :**
   - Le produit s'appelle **Telambah Facture** (ou `Telambah` en version courte).
   - Ne **JAMAIS** réintroduire l'ancien nom de code *"Cauris"*.
   - Le pays d'ancrage est le **Togo 🇹🇬 (Lomé)** et la zone FCFA (UEMOA / CEMAC).

2. **Règles Fiscales & OTR :**
   - **NE JAMAIS rendre la mention OTR ou le NIF obligatoire.**
   - L'utilisateur est un indépendant/freelance non reconnu par l'OTR. Les factures sont émises au titre des règles commerciales de l'OHADA.
   - Le NIF est **strictement optionnel** et géré par un interrupteur débrayable dans le profil de l'entreprise. S'il est vide, aucun libellé *"NIF"* ou *"OTR"* ne doit figurer sur la facture imprimée.
   - Ne jamais afficher de cachet *"CERTIFIÉ CONFORME OTR"*. Utiliser le tampon neutre et professionnel : **`✓ FACTURE VALIDÉE`**.

3. **Formatage Monétaire :**
   - Toujours utiliser `formatFCFA(montant)`.
   - **Zéro centime.** Les montants en Franc CFA sont toujours entiers (ex: `1 500 000 FCFA` et non `1 500 000.00 FCFA`).

4. **Intégrité de la Palette & du Mode Sombre :**
   - Ne jamais introduire de couleurs violettes, fuchsias ou criardes pour l'interface.
   - Vérifier systématiquement que tout nouveau composant possède des styles sombres valides et testés.
   - Ne pas utiliser de police serif.

5. **Raccourcis Clavier & Recherche Globale :**
   - Conserver les raccourcis configurés : `⌘K` / `Ctrl+K` (recherche), `⌘1` (thème), `⌘2` (paramètres), `⌘3` (notifications).
   - Tout nouveau module de recherche doit s'interconnecter avec l'événement `open-command-palette`.

6. **Validation Avant Clôture de Tâche :**
   - Toujours valider la compilation et l'absence d'erreurs TypeScript / HTTP 500 sur les routes Next.js avant de conclure une intervention.

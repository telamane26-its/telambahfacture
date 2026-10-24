# Plan d'implémentation — SaaS de facturation pour entrepreneurs africains (zone FCFA)

> **Version 1.0 — 18 octobre 2026** · Statut : **en attente de validation** (voir §2)
> Références visuelles : [`docs/design/inspiration/`](design/inspiration/) (les 3 captures fournies)
> Ce document sert de référence à toutes les phases. Il est mis à jour à chaque décision (journal au §18).

## Sommaire

1. Résumé exécutif
2. Décisions à valider avant de coder
3. Produit : personas, périmètre MVP, hors périmètre
4. Spécificités du marché (zone FCFA)
5. Stack technique
6. Architecture applicative
7. Modèle de données
8. Règles métier : argent, TVA, numérotation, statuts, tableau de bord
9. Sécurité
10. Système de design (synthèse des 3 captures)
11. Routes et pages
12. Phases d'implémentation (0 → 6)
13. Stratégie de tests
14. Environnements, déploiement et coûts
15. Risques et parades
16. Après le MVP
17. Conventions de code (futur `CLAUDE.md`)
18. Journal des décisions

---

## 1. Résumé exécutif

- **Quoi** : une application web *mobile-first* pour que les indépendants, TPE et PME de la zone FCFA créent, envoient et suivent leurs factures, enregistrent les paiements (y compris partiels et par mobile money) et pilotent leur trésorerie.
- **Comment** : Next.js (App Router) + Supabase (Postgres, Auth, Storage) + Tailwind CSS + shadcn/ui, déployé sur Vercel. Données hébergées à Paris (Supabase n'a aucune région en Afrique).
- **Cinq principes non négociables**
  1. **L'argent est exact** : montants en **entiers FCFA**, jamais de nombres à virgule flottante ; la base de données recalcule les totaux et fait autorité.
  2. **Isolation des données** : plusieurs entreprises cohabitent dans une même base (*multi-tenant*), cloisonnées par la *Row Level Security* (RLS) sur chaque table et **testée automatiquement** dès que la base existe.
  3. **Intégrité légale** : numéro sans trou attribué à l'émission, facture émise non modifiable, aucune suppression d'une facture émise.
  4. **Pensé pour le terrain** : smartphone d'abord, pages légères, partage WhatsApp, modes de paiement locaux, montant en toutes lettres.
  5. **Validation à chaque étape** : chaque phase se termine par une démo (captures desktop et mobile, résultats des tests) et ton feu vert.
- **Phases** : 0 Fondations → 1 Design system et pages → 2 Interactivité sur données locales → 3 Base Supabase et tests → 4 Authentification → 5 Landing page → 6 Passage de bout en bout, sécurité, déploiement et re-test.

---

## 2. Décisions à valider avant de coder

| # | Sujet | Recommandation | Raison |
|---|---|---|---|
| **D1** | Version de Next.js | **Next.js 16** (16.4.x) au lieu de 14 | Next 14 est **en fin de vie depuis le 26/10/2025** : sa dernière version (14.2.35) ne recevra plus aucun correctif de sécurité. Next 15 sort à son tour du support fin octobre 2026 (politique officielle : maintenance jusqu'à 2 ans après la sortie). Next 16 est la seule branche en support actif. Les concepts sont identiques (App Router, Server Components, Server Actions) ; le principal changement visible est que le *middleware* s'appelle désormais `proxy.ts`. Démarrer une app qui gère de l'argent sur une version sans correctifs serait une dette de sécurité dès le premier jour. Si tu tiens à la 14, voir §5.2. |
| **D2** | Pays de lancement | **Sénégal** par défaut, application multi-pays UEMOA/CEMAC dès le départ | Ce choix fixe les valeurs par défaut (devise XOF/XAF, taux de TVA, nom de l'identifiant fiscal, indicatif téléphonique, fuseau horaire) et la priorité de conformité. ⚠️ En **Côte d'Ivoire**, la *Facture Normalisée Électronique* (FNE) de la DGI est désormais obligatoire pour toutes les entreprises : un lancement prioritaire là-bas impose une intégration FNE (voir §4). |
| **D3** | Direction visuelle | Identité **violet/prune** de la capture 1 + structure formulaire/aperçu de la capture 2 + structure KPI/tableaux de la capture 3. Thème clair par défaut, mode sombre inclus | Les captures 2 et 3 sont bleues : on garde leur ergonomie, pas leur couleur (détails au §10). |
| **D4** | Nom du produit | Provisoire (`APP_NAME` dans `src/config/site.ts`) | Nécessaire au plus tard en phase 4 (domaine d'envoi des emails) et en phase 5 (landing). |
| **D5** | Facture émise = verrouillée | **Oui** : après émission, contenu non modifiable ; pour corriger, on annule puis on duplique (les avoirs viendront après le MVP) | Numérotation continue et intégrité des pièces comptables (bonne pratique OHADA et exigence des administrations fiscales). |
| **D6** | Périmètre MVP | Celui du §3.2 | Inclut catalogue produits, paiements partiels, PDF, envoi par email, partage WhatsApp, export CSV. |
| **D7** | Langues | Interface 100 % en français ; code, base de données et URLs en anglais | Code plus lisible, et une version anglaise reste possible plus tard (Cameroun anglophone). |

---

## 3. Produit

### 3.1 Personas

- **Awa — gérante d'une agence de communication à Dakar (6 personnes).** 20 à 40 factures par mois. Travaille surtout sur son smartphone Android, envoie ses factures sur WhatsApp, est payée par Wave, Orange Money ou virement, souvent en plusieurs fois.
- **Koffi — consultant indépendant à Abidjan.** Veut des factures propres et conformes, savoir qui lui doit quoi, et relancer sans gêne.
- **Le comptable** (utilisateur indirect) : reçoit des exports clairs (CSV) et des factures numérotées sans trou.

### 3.2 Périmètre MVP

| Module | Fonctionnalités |
|---|---|
| **Tableau de bord** | Indicateurs (KPI) de la période : nombre de factures, montant facturé, montant encaissé, montant en attente (dont en retard) ; graphique facturé vs encaissé sur 12 mois ; dernières factures ; factures à relancer ; sélecteur de période. |
| **Factures** | Liste avec onglets par statut et compteurs, recherche, filtres (client, dates, montant), tri, pagination, export CSV. Création et édition de brouillons : lignes dynamiques, TVA automatique, remise globale, notes, aperçu en direct. Émission (attribution du numéro), envoi par email avec PDF joint, partage WhatsApp et lien public, téléchargement PDF. Paiements (partiels, mode de paiement, référence), annulation, duplication, historique (créée, émise, envoyée, vue par le client, payée). |
| **Clients** | Liste, recherche, création et modification : nom ou raison sociale, contact, email, téléphone, adresse, ville, pays, identifiant fiscal, RCCM, notes. Fiche client (factures, total facturé, solde dû). Archivage (un client qui a des factures n'est pas supprimé). |
| **Produits et services** | Catalogue (désignation, description, unité, prix unitaire, TVA) ; autocomplétion dans les lignes de facture. |
| **Paramètres** | *Entreprise* : nom, forme juridique, adresse, ville, pays, téléphone, email, site, logo, identifiant fiscal (NINEA/NCC/IFU/NIU), RCCM. *Facturation* : devise (XOF/XAF), TVA par défaut, préfixe de numérotation, délai de paiement, notes et conditions par défaut, pied de page, coordonnées bancaires, numéros mobile money, cachet et signature. *Compte* : profil, email, mot de passe, suppression du compte. |
| **Authentification** | Inscription et connexion par email + mot de passe, confirmation par email, mot de passe oublié, connexion Google (optionnelle), déconnexion, création de l'entreprise au premier lancement (*onboarding*). |
| **Landing page** | Présentation, fonctionnalités, « comment ça marche », tarifs en FCFA, FAQ, pages légales. |

### 3.3 Hors MVP (prévu, l'architecture est prête — voir §16)

Devis et factures proforma, avoirs, factures récurrentes, relances automatiques, paiement en ligne par mobile money, plusieurs utilisateurs par entreprise avec rôles, abonnement payant au SaaS, intégrations fiscales (FNE, e-MECeF…), mode hors ligne (PWA), multi-devises.

---

## 4. Spécificités du marché (zone FCFA)

| Constat | Conséquence dans le produit |
|---|---|
| **Monnaie** : XOF (UEMOA) et XAF (CEMAC), même parité mais deux devises distinctes ; aucune décimale (ISO 4217). | Montants stockés en **entiers** ; devise choisie par entreprise et figée sur chaque facture ; affichage « 1 250 000 FCFA ». |
| **TVA** : 18 % dans la plupart des pays de l'UEMOA, d'autres taux ailleurs (ex. Cameroun 19,25 %) ; certaines prestations sont exonérées. | Taux par défaut **par entreprise** (18 %), modifiable **par ligne** (dont 0 %) ; TVA ventilée par taux sur la facture. |
| **Mentions usuelles ou obligatoires** : identité et adresse du vendeur, identifiant fiscal (NINEA au Sénégal, NCC en Côte d'Ivoire, IFU au Bénin et au Burkina, NIU au Cameroun…), RCCM, numéro unique et séquentiel, date, identité du client, désignation, quantité, prix unitaire HT, taux et montant de TVA, total TTC, conditions de paiement. Usage très répandu : **montant en toutes lettres**, **cachet et signature**. | Champs dédiés dans les paramètres ; libellés adaptés au pays ; phrase « Arrêtée la présente facture à la somme de … » générée automatiquement ; cachet et signature optionnels sur le PDF. |
| **Conservation** : 10 ans pour les pièces comptables (Acte uniforme OHADA relatif au droit comptable). | Aucune suppression d'une facture émise (annulation uniquement) ; export proposé avant la suppression d'un compte. |
| **Facturation électronique certifiée** : obligatoire en Côte d'Ivoire (FNE) ; dispositifs au Bénin (e-MECeF) et au Burkina Faso (facture électronique certifiée) ; en préparation au Sénégal. | Le MVP produit des factures commerciales classiques. Les intégrations aux plateformes fiscales sont des chantiers pays par pays, priorisés selon D2. **À valider avec un expert-comptable local avant le lancement.** |
| **Paiements** : mobile money (Wave, Orange Money, MTN MoMo, Moov Money), espèces, virement, chèque ; paiements fractionnés fréquents. | Plusieurs paiements par facture ; statut « Partiellement payée » ; numéros mobile money affichés sur la facture. |
| **Usage** : smartphone Android de milieu de gamme, réseau 3G/4G variable ; WhatsApp omniprésent. | Mobile-first, peu de JavaScript côté navigateur, bouton « Envoyer par WhatsApp » avec le lien public de la facture. |
| **Hébergement** : aucune région Supabase en Afrique. | Base à **Paris (`eu-west-3`)** et fonctions Vercel à **Paris (`cdg1`)**, au plus près de l'Afrique de l'Ouest et du Centre. |
| **Données personnelles** : lois nationales (ex. Sénégal, loi 2008-12 / CDP ; Côte d'Ivoire, loi 2013-450 / ARTCI). | Politique de confidentialité, CGU, mention de l'hébergement hors du pays : **à valider juridiquement** avant le lancement. |

**Valeurs par défaut par pays** (`src/config/countries.ts`, à valider) :

| Pays | Devise | TVA | Identifiant fiscal | Indicatif | Fuseau |
|---|---|---|---|---|---|
| Sénégal | XOF | 18 % | NINEA | +221 | Africa/Dakar |
| Côte d'Ivoire | XOF | 18 % | NCC | +225 | Africa/Abidjan |
| Bénin | XOF | 18 % | IFU | +229 | Africa/Porto-Novo |
| Burkina Faso | XOF | 18 % | IFU | +226 | Africa/Ouagadougou |
| Mali | XOF | 18 % | NIF | +223 | Africa/Bamako |
| Togo | XOF | 18 % | NIF | +228 | Africa/Lome |
| Niger | XOF | 19 % | NIF | +227 | Africa/Niamey |
| Cameroun | XAF | 19,25 % | NIU | +237 | Africa/Douala |
| Gabon | XAF | 18 % | NIF | +241 | Africa/Libreville |

---

## 5. Stack technique

### 5.1 Choix

Versions vérifiées sur le registre npm le 18/10/2026 ; elles seront figées par le fichier de verrouillage (`package-lock.json`) en phase 0.

| Domaine | Choix | Version | Pourquoi |
|---|---|---|---|
| Runtime | Node.js LTS | 24.x | Next 16 exige Node ≥ 20.9 ; la 24 est maintenue jusqu'en avril 2028 |
| Framework | Next.js : App Router, Server Components, Server Actions, Turbopack | 16.4.x | Seule branche en support actif (D1) |
| UI | React | 19.x | Fourni avec Next 16 |
| Langage | TypeScript (mode strict) | 5.x | |
| Styles | Tailwind CSS | 4.x | Configuration en CSS (`@theme`), tokens en variables CSS |
| Composants | shadcn/ui (sur Radix UI) + lucide-react | CLI 4.x | Le code des composants vit dans le repo : entièrement thémable et accessible |
| Thème | next-themes | | Mode clair/sombre sans flash |
| Formulaires | react-hook-form + Zod + @hookform/resolvers | 7.x / 4.x / 5.x | Les mêmes schémas valident côté navigateur et côté serveur |
| État dans l'URL | nuqs | 2.x | Filtres, onglets et pagination partageables, bouton « retour » fiable |
| Graphiques | Recharts (via les composants « chart » de shadcn) | 3.x | Chargés à la demande |
| Dates | date-fns + locale `fr` | 4.x | |
| Notifications | sonner | 2.x | |
| Base, Auth, fichiers | Supabase (Postgres, Auth, Storage) + `@supabase/ssr` + `@supabase/supabase-js` | 0.12.x / 2.x | Sessions par cookies, RLS, clés « publishable » et « secret » |
| Outillage base | Supabase CLI (paquet npm `supabase`, en dépendance de dev) | 2.x | Migrations SQL versionnées, génération des types, tests pgTAP |
| PDF | @react-pdf/renderer | 4.x | Rendu côté serveur, compatible avec les fonctions Vercel |
| Emails | Resend + React Email | 6.x / 1.x | SMTP de Supabase Auth **et** envoi des factures |
| Téléphones | libphonenumber-js | | Validation et format international (E.164) |
| Tests | Vitest + Testing Library ; Playwright + axe ; pgTAP | 5.x ; 1.64 | Voir §13 |
| Qualité | ESLint + Prettier (+ plugin Tailwind) | | La commande `next lint` n'existe plus en Next 16 |
| Observabilité (phase 6) | Sentry, Vercel Analytics, Speed Insights | | |
| Anti-abus (phase 6) | Upstash Ratelimit | 2.x | Lien public, envoi d'emails, formulaires d'authentification |
| Gestionnaire de paquets | npm | | Fourni avec Node, rien d'autre à installer |

### 5.2 Si tu tiens à Next.js 14 (déconseillé)

| Sujet | Next 16 (recommandé) | Next 14.2.35 |
|---|---|---|
| Correctifs de sécurité | Oui | Aucun depuis octobre 2025 |
| React | 19 (`useActionState`, `ref` passée comme prop) | 18 |
| Tailwind / shadcn | v4 / CLI actuelle | v3.4 (`v3-lts`) / `shadcn@2.3.0` (dernière CLI compatible Tailwind 3) |
| Interception des requêtes | `proxy.ts` | `middleware.ts` |
| `cookies()`, `params`, `searchParams` | Asynchrones (`await`) | Synchrones |
| Paquets serveur externes (PDF) | `serverExternalPackages` | `experimental.serverComponentsExternalPackages` |
| Node.js | 24 LTS | 22 LTS conseillé |

Le reste du plan ne change pas.

---

## 6. Architecture applicative

### 6.1 Flux

```
Navigateur
  │
  ├──► proxy.ts ─ rafraîchit la session Supabase (getClaims) et redirige les visiteurs non connectés
  │               (confort uniquement : la sécurité est vérifiée plus bas, à chaque accès)
  │
  ├──► Server Components (pages) ─► features/*/queries.ts ───────┐
  │                                 (serveur uniquement, requireOrg())
  ├──► Server Actions (mutations) ─► Zod ─► requireOrg() ──────────┼──► Supabase Postgres
  │                                                                │    RLS + triggers + fonctions SQL
  └──► Route Handlers : PDF, export CSV, callbacks d'auth, lien public ┘
```

### 6.2 Principes

- **Serveur d'abord** : les pages lisent les données dans des Server Components. Le JavaScript côté navigateur est réservé aux zones interactives (formulaire de facture, filtres, dialogues, graphiques).
- **Couche d'accès aux données (DAL)** : seul chemin vers les données, dans des modules marqués `server-only`. Chaque fonction appelle `requireUser()` / `requireOrg()`, même si le proxy a déjà redirigé (défense en profondeur).
- **Même interface en phase 2 et en phase 3** : pages et actions appellent `features/<module>/queries.ts` et `actions.ts`. En phase 2, ces fonctions s'appuient sur un magasin local ; en phase 3, on remplace leur implémentation par Supabase sans toucher aux pages.
- **Domaine pur** (`src/domain`) : argent, TVA, montant en lettres, statuts, échéances. Aucune dépendance à React, Next ou Supabase, donc testé unitairement de façon quasi exhaustive, et réutilisé côté navigateur (aperçu en direct) comme côté serveur.
- **La base fait autorité** : totaux recalculés par des triggers, numéro attribué par une fonction SQL, transitions de statut contrôlées. Le navigateur n'envoie que des quantités, des prix et des taux, jamais de totaux « de confiance ».
- **Un seul modèle de document** : `buildInvoiceDocument()` transforme une facture en un modèle d'affichage unique, utilisé par l'aperçu HTML, la page publique, le PDF et l'email. Aucune divergence possible de calcul ou de format.
- **Résultats d'action typés** : `{ ok: true, data } | { ok: false, error, fieldErrors }`, messages en français, toasts côté navigateur.

### 6.3 Arborescence

```
src/
  app/
    (marketing)/            landing, tarifs, pages légales                  [phase 5]
    (auth)/                 login, signup, forgot-password, reset-password  [phase 4]
    auth/                   confirm/route.ts, callback/route.ts            [phase 4]
    onboarding/             création de l'entreprise (mise en page minimale)
    (app)/                  layout = coque de l'application + requireOrg()
      dashboard/
      invoices/  new/  [id]/  [id]/edit/
      clients/   [id]/
      products/
      settings/  company/  invoicing/  account/
    i/[token]/              page publique d'une facture (+ pdf/route.ts)
    api/invoices/[id]/pdf/route.ts
    api/invoices/export/route.ts
    dev/ui/                 vitrine du design system (en développement uniquement)
    layout.tsx  globals.css  not-found.tsx  global-error.tsx  robots.ts  sitemap.ts  manifest.ts
  components/
    ui/                     composants shadcn re-thémés
    layout/                 AppSidebar, MobileTopBar, MobileBottomNav, PageHeader, CommandMenu
    shared/                 Amount, StatusBadge, KpiCard, EmptyState, ConfirmDialog, DataTable…
  features/
    dashboard/  invoices/  clients/  products/  settings/  auth/
      components/  queries.ts  actions.ts  schemas.ts
  domain/                   money.ts  totals.ts  amount-in-words.ts  invoice-status.ts  numbering.ts  dates.ts
  server/                   (serveur uniquement) supabase/  auth.ts  email/  pdf/  local-store/ [phase 2 seulement]
  lib/                      utils.ts (cn), env.ts (variables d'environnement validées par Zod), format.ts
  config/                   site.ts  navigation.ts  countries.ts
  proxy.ts
supabase/                   config.toml  migrations/  seed.sql  tests/ (pgTAP)
tests/                      e2e/ (Playwright)  integration/  fixtures/ (données de démo + cas de calcul de référence)
docs/                       PLAN.md  design/
```

---

## 7. Modèle de données (Postgres / Supabase)

### 7.1 Tables

```
organizations      id, name, legal_form, email, phone, website, address, city, country_code,
                   tax_id (NINEA/NCC/IFU/NIU), trade_register (RCCM), logo_path, signature_path,
                   currency ('XOF'|'XAF'), default_tax_rate numeric(5,2) = 18.00,
                   invoice_prefix = 'FAC', payment_terms_days = 30,
                   default_notes, default_terms, footer, bank_details, mobile_money jsonb,
                   timezone = 'Africa/Dakar', created_at, updated_at

memberships        org_id, user_id, role ('owner'|'admin'|'member'), created_at       PK (org_id, user_id)
profiles           id (= auth.users.id), full_name, phone, avatar_url, created_at

clients            id, org_id, kind ('company'|'individual'), name, contact_name, email, phone,
                   address, city, country_code, tax_id, trade_register, notes,
                   archived_at, created_at, updated_at

products           id, org_id, name, description, unit, unit_price bigint ≥ 0, tax_rate,
                   archived_at, created_at, updated_at

invoices           id, org_id, client_id, number (NULL tant que brouillon), status,
                   issue_date, due_date (≥ issue_date), currency,
                   discount_type ('percent'|'amount'|NULL), discount_value,
                   subtotal, discount_amount, tax_amount, total, amount_paid    ← bigint, écrits par la base
                   balance_due                                                  ← colonne générée (total − amount_paid)
                   notes, terms, footer,
                   client_snapshot jsonb, company_snapshot jsonb                ← figés à l'émission
                   public_token (unique, aléatoire 128 bits),
                   sent_at, viewed_at, paid_at, cancelled_at,
                   created_by, created_at, updated_at                           UNIQUE (org_id, number)

invoice_items      id, invoice_id, org_id, position, product_id, description, unit,
                   quantity numeric(12,3) > 0, unit_price bigint ≥ 0, tax_rate numeric(5,2),
                   line_total bigint (calculé)

payments           id, org_id, invoice_id, amount bigint > 0, paid_on date, method,
                   reference, note, created_by, created_at

invoice_events     id, org_id, invoice_id, type, data jsonb, actor_id, created_at
                   (créée, émise, envoyée par email, partagée, vue par le client, paiement, annulée…)

document_sequences org_id, doc_type ('invoice' ; plus tard 'quote', 'credit_note'), year, last_value
                   PK (org_id, doc_type, year)
```

- Énumérations : `invoice_status` = `draft | sent | partially_paid | paid | cancelled` ; `payment_method` = `cash | bank_transfer | wave | orange_money | mtn_momo | moov_money | cheque | card | other`.
- **« En retard » n'est pas stocké** : ce statut est dérivé (voir §8.3), il ne peut donc jamais être périmé.
- Index : `(org_id, status, due_date)`, `(org_id, issue_date desc)`, `(org_id, client_id)`, `invoice_items(invoice_id)`, `payments(invoice_id)`, index trigramme (`pg_trgm`) sur `clients.name` pour la recherche.

### 7.2 Vues, fonctions et triggers

| Objet | Rôle |
|---|---|
| Vue `invoice_list` (`security_invoker = on`) | Factures + nom du client + `display_status` (dont « en retard », calculé dans le fuseau de l'entreprise). `security_invoker` garantit que la RLS s'applique à travers la vue. |
| `create_organization(...)` | Crée l'entreprise **et** l'adhésion « owner » dans une seule transaction. C'est le seul moyen de créer une adhésion (sinon un utilisateur pourrait s'ajouter à une autre entreprise). |
| `save_invoice_draft(invoice jsonb, items jsonb)` | Crée ou met à jour un brouillon et remplace ses lignes dans **une seule transaction**. |
| `issue_invoice(id)` | Verrouille la facture, vérifie qu'elle est complète, attribue le numéro, fige les copies client et entreprise, passe le statut à « envoyée », journalise. |
| `record_payment(...)` / `delete_payment(id)` | Ajoute ou retire un paiement ; refuse le trop-perçu ; met à jour le montant payé et le statut. |
| `cancel_invoice(id, reason)` | Annule une facture émise qui n'a reçu aucun paiement. |
| `duplicate_invoice(id)` | Crée un nouveau brouillon à partir d'une facture existante. |
| `get_public_invoice(token)` | `SECURITY DEFINER` ; seule fonction accessible aux visiteurs anonymes. Renvoie uniquement le document et enregistre la première consultation. |
| `dashboard_summary(from, to)`, `monthly_revenue(months)` | Agrégats du tableau de bord, calculés en base. |

**Triggers** : `updated_at` sur toutes les tables ; modification des lignes → recalcul des totaux du brouillon parent ; paiements → `amount_paid`, statut et `paid_at` ; gardes d'immuabilité (refus de modifier le contenu d'une facture non brouillon, de la supprimer ou de toucher à ses lignes).

### 7.3 Row Level Security

- RLS **activée sur toutes les tables**, aucune politique pour le rôle `anon`.
- Règle commune : `org_id in (select private.user_org_ids())`. La fonction est en `SECURITY DEFINER` avec un `search_path` vide, dans un schéma `private` que l'API n'expose pas ; elle n'est évaluée qu'une fois par requête (recommandation de performance de Supabase).
- `organizations` : lecture par les membres, modification par `owner`/`admin`, aucune création ni suppression directe.
- `memberships` : chacun lit ses propres adhésions ; aucune écriture directe.
- `document_sequences` : aucun accès direct (fonctions uniquement).
- `invoice_events` : lecture par les membres ; écriture uniquement par fonctions et triggers.
- Droit d'exécution des fonctions retiré à `anon` et `public`, sauf pour `get_public_invoice`.
- **Storage** : bucket public `org-assets` pour les logos (ils doivent apparaître sur le lien public et le PDF), écriture limitée au dossier `{org_id}/` par ses membres, PNG/JPEG de 1 Mo maximum. Bucket **privé** `org-private` pour le cachet et la signature (risque de contrefaçon), servis par URL signée ou côté serveur.

---

## 8. Règles métier

### 8.1 Argent et TVA

- Montants : **entiers en FCFA** (`bigint` en base, `number` en TypeScript, exact jusqu'à 9 × 10¹⁵). Quantités : jusqu'à 3 décimales. Taux : 2 décimales (19,25 %).
- Arrondi **au franc, demi vers le haut**, identique en SQL (`round()` sur `numeric`) et en TypeScript (arithmétique entière ; jamais de `× 0.18` en virgule flottante).
- Algorithme, identique côté navigateur et côté base :

```
1. total_ligne  = arrondi(quantité × prix_unitaire)                                (HT)
2. sous_total   = Σ total_ligne
3. remise       = en % ? arrondi(sous_total × % / 100) : min(montant, sous_total)
4. pour chaque taux de TVA t :
     base_t     = Σ total_ligne des lignes au taux t
     remise_t   = part de la remise au prorata de base_t (méthode des plus forts restes : Σ remise_t = remise)
     tva_t      = arrondi((base_t − remise_t) × t / 100)
5. total_tva    = Σ tva_t
6. total_ttc    = sous_total − remise + total_tva
```

- **Cas de référence n° 1** (il fera partie des tests) :

| Ligne | Qté | PU (FCFA) | TVA | Total HT |
|---|---|---|---|---|
| Création de logo | 1 | 250 000 | 18 % | 250 000 |
| Cartes de visite | 500 | 75 | 18 % | 37 500 |
| Formation (exonérée) | 2,5 | 60 000 | 0 % | 150 000 |

  Sous-total 437 500 − remise de 10 % (43 750) = 393 750 HT ; TVA 18 % sur 258 750 = 46 575 ; **total TTC 440 325 FCFA**, soit « quatre cent quarante mille trois cent vingt-cinq francs CFA ».

- Les mêmes cas de référence (`tests/fixtures/totals-cases.json`) sont exécutés contre la fonction TypeScript **et** contre la fonction SQL : la moindre divergence fait échouer la CI.
- Affichage `1 250 000 FCFA` par un formateur maison (espace insécable U+00A0) plutôt que par `Intl` : rendu identique sur le serveur et dans le navigateur (pas d'erreur d'hydratation), et dans le PDF (l'espace fine insécable produite par `Intl` manque dans certaines polices PDF).

### 8.2 Numérotation

- Format `{PRÉFIXE}-{AAAA}-{NNNN}` → `FAC-2026-0001`, compteur **par entreprise et par année**.
- Le numéro est attribué **à l'émission**, pas à la création du brouillon : supprimer un brouillon ne crée jamais de trou.
- Implémentation : `INSERT … ON CONFLICT DO UPDATE … RETURNING` sur `document_sequences`, dans la transaction d'émission (verrou de ligne). Pas de `SEQUENCE` Postgres, qui peut sauter des valeurs.
- Ordre chronologique : la date d'émission ne peut être ni antérieure à celle de la dernière facture émise, ni postérieure à aujourd'hui.

### 8.3 Cycle de vie et statuts

```
                 émettre (email, WhatsApp, lien, ou « marquer comme envoyée »)
   Brouillon ──────────────────────────────────────────────► Envoyée
      │ supprimer                                              │ paiement partiel            solde réglé
      ▼                                                        ├──────────► Partiellement payée ──────► Payée
   (supprimé, aucun numéro consommé)                           │
                                                               └── annuler (si aucun paiement) ──► Annulée

« En retard » = (Envoyée ou Partiellement payée) ET échéance < aujourd'hui (fuseau de l'entreprise)
```

| Statut affiché | Couleur | Règle |
|---|---|---|
| Brouillon | gris | Modifiable, supprimable, sans numéro ; PDF marqué « BROUILLON » |
| Envoyée | bleu | Émise, numérotée, verrouillée |
| Partiellement payée | ambre | 0 < montant payé < total |
| Payée | vert | Montant payé = total |
| En retard | rouge | Dérivé (voir le schéma) |
| Annulée | gris barré | Conservée, exclue des totaux |

Autres règles : au moins une ligne et un total supérieur à 0 pour émettre ; trop-perçu refusé ; supprimer un paiement recalcule le statut ; un client qui a des factures est archivé, pas supprimé ; changer la devise ou la TVA par défaut ne touche que les nouvelles factures.

### 8.4 Définitions du tableau de bord

| Indicateur | Définition |
|---|---|
| Nombre de factures | Factures émises sur la période (selon la date d'émission), hors brouillons et annulées ; les brouillons sont comptés à part |
| Montant facturé | Σ des totaux TTC de ces factures |
| Montant encaissé | Σ des paiements reçus sur la période (selon la date de paiement) |
| Montant en attente | Σ des restes à payer de toutes les factures envoyées ou partiellement payées, à date |
| Dont en retard | Même calcul, limité aux factures en retard |
| Délai moyen de paiement | Moyenne de (date du dernier paiement − date d'émission) pour les factures soldées sur la période |

Périodes proposées : ce mois, 30 derniers jours, ce trimestre, cette année, 12 derniers mois.

### 8.5 Montant en lettres

« Arrêtée la présente facture à la somme de : un million deux cent cinquante mille francs CFA TTC. » Règles du français couvertes par les tests : *quatre-vingts* / *quatre-vingt-un* / *quatre-vingt mille*, *deux cents* / *deux cent un* / *deux cents millions*, *mille* invariable, *millions* et *milliards* au pluriel, *vingt et un*, *soixante et onze*.

---

## 9. Sécurité

### 9.1 Menaces et parades

| Menace | Parade |
|---|---|
| Voir ou modifier les données d'une autre entreprise | RLS sur toutes les tables + DAL qui exige l'entreprise courante + identifiants UUID + réponse 404 ; **matrice de tests pgTAP** (l'utilisateur A contre les données de B, pour chaque table et chaque opération) |
| Contourner le proxy (cf. la faille CVE-2025-29927 du middleware Next.js) | Le proxy ne fait que rafraîchir la session et rediriger ; **chaque page, action et route vérifie elle-même la session** |
| Appeler directement une Server Action | Ce sont des points d'entrée publics : authentification et validation Zod à chaque appel |
| Falsifier des montants | Totaux recalculés en base, contraintes `CHECK` ; le navigateur n'envoie que des quantités, des prix et des taux |
| Modifier une facture émise | Triggers d'immuabilité, couverts par des tests |
| Fuite de clés | Seules l'URL et la clé *publishable* sont publiques ; la clé *secret* ne vit que dans des modules `server-only`, jamais dans le traitement d'une requête utilisateur ordinaire ; variables d'environnement validées au démarrage |
| Lien public deviné ou abusé | Jeton aléatoire de 128 bits, révocable et régénérable, lecture seule via `get_public_invoice`, page non indexée (`noindex`), limitation de débit |
| Fichier malveillant envoyé | PNG/JPEG uniquement (pas de SVG), taille maximale, chemins préfixés par l'entreprise ; bucket privé pour le cachet et la signature |
| Redirection ouverte après connexion | Paramètre `next` limité aux chemins internes |
| Robots, force brute, faux comptes | Limites de Supabase Auth, confirmation par email, CAPTCHA (Cloudflare Turnstile) à l'inscription |
| XSS, clickjacking | Échappement par React, pas de `dangerouslySetInnerHTML`, en-têtes CSP et `frame-ancestors 'none'` |
| Envoi d'emails abusif | Quota par entreprise et par jour, expéditeur fixe, `reply-to` = email de l'entreprise |
| Perte de données | Supabase Pro (sauvegardes quotidiennes), suppression logique, export CSV |
| Dépendances vulnérables | Framework maintenu (D1), `npm audit` en CI, Dependabot |

### 9.2 En-têtes HTTP

`Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `frame-ancestors 'none'`.

### 9.3 Durcissement de Supabase

Security Advisor et Performance Advisor sans alerte ; `search_path` fixé sur toutes les fonctions `SECURITY DEFINER` ; vues en `security_invoker` ; confirmation de l'email obligatoire ; politique de mot de passe (longueur, complexité, et protection contre les mots de passe compromis sur le plan Pro) ; liste blanche des URLs de redirection ; **SMTP personnalisé obligatoire** (le SMTP par défaut de Supabase n'envoie qu'aux membres de l'équipe du projet, à raison de 2 emails par heure).

---

## 10. Système de design (synthèse des 3 captures)

### 10.1 Ce qu'on reprend de chaque capture

| Capture | On reprend | On adapte |
|---|---|---|
| **1 — Landing « Invoicer »** | Identité violet/prune, titres en serif, cartes crème à ombre douce, badges jaune pâle, bandeau prune « comment ça marche » avec frise dorée, tableau avec onglets de statut et compteurs, en-tête de tableau lavande, KPI blancs sur bandeau prune, pied de page prune très sombre | Textes en français, montants en FCFA ; aucun faux logo ni faux témoignage |
| **2 — « Créer une facture »** | Formulaire à gauche et aperçu en direct à droite, interrupteur « Afficher l'aperçu », champs avec étiquette posée sur la bordure et icône, lignes en cartes repliables, bouton « Ajouter une ligne », remise optionnelle, barre d'actions (PDF / Enregistrer le brouillon / Envoyer), sidebar claire avec recherche (Ctrl/⌘ K), interrupteur de mode sombre et carte utilisateur, document présenté comme une feuille | Bleu → violet de la marque |
| **3 — Liste sombre + version mobile** | Bandeau de 4 KPI, filtres en puces supprimables, tableau dense avec badges à icône, menu « ⋯ » par ligne, pagination « 25 par page », palette du mode sombre, déclinaison mobile | Sur mobile, tableaux transformés en cartes plutôt qu'en défilement horizontal |

### 10.2 Couleurs (mesurées sur les captures)

| Token | Valeur | Usage |
|---|---|---|
| `primary` | `#A530D8` | Boutons principaux, liens, focus. Texte blanc dessus : contraste 5,2:1 (conforme AA) |
| `primary-hover` | `#9224C1` | Survol et pression (à ajuster en phase 1) |
| `plum-950` | `#240C2D` | Pied de page, fond de marque sombre |
| `plum-900` | `#451557` | Bandeau KPI du tableau de bord |
| `plum-800` | `#631E81` | Sections marketing (« comment ça marche ») |
| `violet-ink` | `#3C0055` | Icônes sur fond lavande |
| `lavender-50` | `#F9EAFC` | Bandeaux légers |
| `lavender-100` | `#F3E7F9` | En-têtes de tableau |
| `lavender-200` | `#EDD5F6` | Élément de navigation actif, fonds d'icônes |
| `lavender-300` | `#DBABED` | Bandeau des témoignages |
| `cream` | `#FFFCF9` | Cartes marketing, feuille de facture |
| `gold-100` | `#F3F0D2` | Badges et annotations |
| `gold-500` | `#CFB71B` | Puces de la frise |
| `bronze` | `#A57854` | Badge sur fond prune |
| Neutres clairs (capture 2) | `#FFFFFF` / `#F9F9F9` / `#F3F3F3` / `#E1E1E1` | Panneaux / sidebar / zone d'aperçu / bordures |
| Neutres sombres (capture 3) | `#15181B` / `#212427` / `#333336` / `#C6C9C9` | Fond / surfaces / survol et élément actif / texte secondaire |

Statuts (fond / texte, contraste AA) : Brouillon `#F2F4F7` / `#475467` · Envoyée `#EFF8FF` / `#175CD3` · Partiellement payée `#FFFAEB` / `#B54708` · Payée `#ECFDF3` / `#067647` · En retard `#FEF3F2` / `#B42318` · Annulée `#F9FAFB` / `#667085` (barré).

### 10.3 Typographie

- **Titres** : *Fraunces* (serif très proche de la capture 1, Google Fonts) pour les titres de page et les sections marketing.
- **Interface** : *Plus Jakarta Sans* (proche des captures 1 et 2) pour tout le reste, avec **chiffres tabulaires** pour les montants (support à vérifier en phase 1, repli sur Inter).
- Montants à la manière de la capture 3 : nombre en gras, « FCFA » plus petit et atténué.
- Chargement par `next/font` : polices auto-hébergées, sous-ensemble latin étendu, aucun appel externe.

### 10.4 Formes et densité

Rayons : 10 px (champs, boutons), 16 px (cartes, panneaux), arrondi complet (badges). Ombres très douces, légèrement teintées de prune. Bordures de 1 px. Tableaux denses sur desktop (lignes d'environ 44 px), cibles tactiles d'au moins 44 px sur mobile.

### 10.5 Composants clés

`FloatingField` (étiquette sur la bordure + icône), `MoneyInput` (FCFA, clavier numérique, séparateurs automatiques), `PhoneInput` (indicatif du pays), `DatePicker` (en français), `ClientCombobox` (recherche + création rapide), `LineItemsEditor`, `InvoiceDocument` (la feuille de facture), `StatusBadge`, `Amount`, `KpiCard` / `KpiBand`, `DataTable` (onglets, recherche, puces de filtres, pagination), `EmptyState`, `ConfirmDialog`, `PageHeader`, `CommandMenu` (Ctrl/⌘ K), squelettes de chargement.

### 10.6 Responsive (mobile-first)

- La sidebar devient une barre supérieure avec tiroir, plus une **barre de navigation en bas d'écran** avec un bouton central « + Nouvelle facture ».
- Les tableaux deviennent des **cartes** sous 768 px.
- La création de facture passe en onglets « Formulaire / Aperçu », avec une **barre d'action fixée en bas** qui affiche le total TTC.
- Graphiques chargés à la demande. Objectif : LCP < 2,5 s en 4G simulée.

### 10.7 Accessibilité

Primitives Radix (clavier, ARIA), contrastes AA, focus visible, étiquette sur chaque champ, `lang="fr"`, respect de `prefers-reduced-motion`.

### 10.8 Esquisses

Tableau de bord :

```
┌ Bonjour Awa                        [Ce mois ▾]            [+ Nouvelle facture] ┐
│ ┌─────────────── bandeau prune « Vue d'ensemble » ──────────────────────────┐ │
│ │ [Factures 54]  [Facturé 12,4 M]  [Encaissé 8,1 M]  [En attente 4,3 M]    │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
│ ┌ Facturé vs encaissé — 12 mois ─────────────┐ ┌ À relancer ─────────────────┐ │
│ │ ▇ ▅ ▇ ▆ ▇ █ ▆ ▇ █ ▇ ▆ █                     │ │ FAC-2026-0031 · 320 000  ▸  │ │
│ └─────────────────────────────────────────────┘ └─────────────────────────────┘ │
│ ┌ Dernières factures ─────────────────────────────────────────────────────────┐ │
└──────────────────────────────────────────────────────────────────────────────────┘
```

Création de facture (desktop) :

```
┌ Factures › Nouvelle facture ──────────────────┬ Aperçu   [PDF] [Brouillon] [Envoyer ▸] ┐
│ Nouvelle facture        [Afficher l'aperçu ●] │  ┌────────────── FACTURE ─────────────┐ │
│ ┌ Informations ─────────────────────────────┐ │  │ [logo]    N° attribué à l'émission │ │
│ │ (Client ▾) (Date d'émission) (Échéance ▾) │ │  │ Émetteur              Client       │ │
│ └───────────────────────────────────────────┘ │  │ Désignation  Qté  PU   TVA  Total  │ │
│ ┌ Lignes ───────────────────────────────────┐ │  │ …                                  │ │
│ │ ▾ Ligne 1 : désignation · qté · PU · TVA  │ │  │ Total HT · TVA 18 % · Total TTC    │ │
│ │ + Ajouter une ligne                       │ │  │ Arrêtée la présente facture à…     │ │
│ └───────────────────────────────────────────┘ │  │ Wave · Orange Money · RIB          │ │
│ ☐ Remise (% ou montant)   Notes   Conditions  │  └────────────────────────────────────┘ │
└───────────────────────────────────────────────┴─────────────────────────────────────────┘
```

---

## 11. Routes et pages

| Route | Page | Accès | Phases (interface → branchement) |
|---|---|---|---|
| `/` | Landing | public | 5 |
| `/legal/*` | Mentions légales, confidentialité, CGU | public | 5 |
| `/login`, `/signup`, `/forgot-password`, `/reset-password` | Authentification | visiteurs non connectés | 4 |
| `/auth/confirm`, `/auth/callback` | Vérification de l'email, OAuth | — | 4 |
| `/onboarding` | Création de l'entreprise | connecté sans entreprise | 1 → 4 |
| `/dashboard` | Tableau de bord | membre | 1 → 2 → 3 |
| `/invoices` | Liste des factures | membre | 1 → 2 → 3 |
| `/invoices/new`, `/invoices/[id]/edit` | Création / édition d'un brouillon | membre | 1 → 2 → 3 |
| `/invoices/[id]` | Détail, paiements, historique, actions | membre | 1 → 2 → 3 |
| `/clients`, `/clients/[id]` | Clients, fiche client | membre | 1 → 2 → 3 |
| `/products` | Catalogue | membre | 1 → 2 → 3 |
| `/settings/company`, `/settings/invoicing`, `/settings/account` | Paramètres | membre (owner/admin pour l'entreprise) | 1 → 2 → 3/4 |
| `/i/[token]` | Facture publique (+ PDF) | public, avec jeton | 1 → 2 → 3 |
| `/api/invoices/[id]/pdf` | PDF | membre | 2 |
| `/api/invoices/export` | Export CSV | membre | 2 |
| `/dev/ui` | Vitrine du design system | développement uniquement | 1 |

---

## 12. Phases d'implémentation

Chaque phase se termine par un **point de contrôle** : récapitulatif, captures desktop et mobile (prises avec Playwright), résultats des tests, instructions pour tester toi-même, puis commit étiqueté `phase-N`. **Je n'enchaîne jamais sur la phase suivante sans ton feu vert.** Les tailles (S, M, L) indiquent l'effort relatif.

### Phase 0 — Fondations (S)

Objectif : un projet vide mais professionnel, prêt à recevoir le code.

- [x] Captures d'inspiration copiées dans `docs/design/inspiration/`.
- [ ] Installer **Node.js 24 LTS** (via `winget`, version épinglée dans `.nvmrc` et `engines`). Node est absent de la machine aujourd'hui ; Git est déjà installé.
- [ ] `git init`, `.gitignore`, dépôt GitHub privé.
- [ ] Créer l'application avec `create-next-app` (TypeScript, App Router, Tailwind 4, dossier `src/`, alias `@/*`, Turbopack), versions figées.
- [ ] shadcn/ui (`init` + composants de base), lucide-react, next-themes, sonner.
- [ ] Qualité : TypeScript strict (+ `noUncheckedIndexedAccess`), ESLint, Prettier + plugin Tailwind, scripts `lint`, `typecheck`, `test`, `test:e2e`.
- [ ] Vitest (+ Testing Library) et Playwright installés, avec un test témoin chacun.
- [ ] `src/lib/env.ts` (variables d'environnement validées par Zod), `src/config/site.ts`, `src/config/countries.ts`.
- [ ] `CLAUDE.md` (conventions du §17) et `README.md` (installation, scripts).
- **Terminé quand** : `npm run dev`, `lint`, `typecheck`, `test` et `build` passent.
- **J'ai besoin de toi** : ton accord pour installer Node.js ; un compte GitHub.

### Phase 1 — Design system et pages connectées (L)

Objectif : toutes les pages de l'application, fidèles au style des captures, sur données de démonstration (en lecture seule).

- [ ] Tokens du §10 en variables CSS (clair et sombre), polices, rayons, ombres ; composants shadcn re-thémés.
- [ ] Composants partagés du §10.5, et page `/dev/ui` pour tous les vérifier d'un coup d'œil.
- [ ] Formatage FCFA et calcul des totaux (versions testées dès maintenant, car les données de démo et la feuille de facture en dépendent).
- [ ] Coque de l'application : sidebar desktop (logo, recherche Ctrl/⌘ K, navigation, aide, paramètres, mode sombre, carte utilisateur) ; sur mobile, barre supérieure, tiroir et navigation en bas d'écran ; `PageHeader` avec fil d'Ariane.
- [ ] `InvoiceDocument`, la feuille de facture : logo, numéro, émetteur et client, lignes, TVA ventilée, total TTC, montant en lettres, moyens de paiement, notes, cachet et signature, mentions légales.
- [ ] Pages : tableau de bord, liste des factures, création/édition, détail, clients et fiche client, produits, paramètres (3 onglets), onboarding, page publique de facture, 404, états vides, squelettes de chargement.
- [ ] Données de démo réalistes et reproductibles (`tests/fixtures/`) : une douzaine de clients (Dakar, Abidjan, Douala, Cotonou…), une quarantaine de factures sur 12 mois, paiements Wave, Orange Money et virement, une dizaine de produits. Les pages les lisent déjà via `features/*/queries.ts`.
- [ ] Vérification visuelle sur desktop (1440 px) et mobile (390 px), en clair et en sombre.
- **Terminé quand** : chaque route s'affiche sans erreur dans la console, en clair et en sombre, sur desktop et mobile, et tu as validé le rendu.
- **J'ai besoin de toi** : tes retours visuels ; ton logo si tu en as un (sinon un logotype provisoire).

### Phase 2 — Interactivité sur données locales (L)

Objectif : l'application fonctionne de bout en bout, sans base de données.

- [ ] Compléter le domaine pur, **tests écrits en premier** : statuts, numérotation, dates (fuseaux, échéances), montant en lettres, cas de référence du §8.1.
- [ ] Schémas Zod partagés : client, produit, facture et lignes, paiement, paramètres.
- [ ] Magasin local côté serveur (`server/local-store`, sauvegarde JSON dans `.data/`, ignoré par Git) derrière les fonctions de `queries.ts` et `actions.ts`.
- [ ] Server Actions : clients et produits (créer, modifier, archiver) ; brouillons (créer, modifier, supprimer) ; émettre ; enregistrer ou supprimer un paiement ; annuler ; dupliquer ; paramètres.
- [ ] Formulaire de facture : react-hook-form + `useFieldArray`, totaux en direct, création rapide de client, autocomplétion des produits, alerte « modifications non enregistrées », raccourcis clavier.
- [ ] Listes pilotées par l'URL (nuqs) : onglets de statut avec compteurs, recherche, puces de filtres, tri, pagination.
- [ ] PDF (`@react-pdf/renderer`, polices embarquées, filigrane « BROUILLON ») ; export CSV (séparateur `;` et BOM UTF-8 pour Excel en français) ; lien public ; bouton WhatsApp (`wa.me`) ; dialogue d'envoi par email (simulé jusqu'à la phase 4).
- [ ] Tableau de bord calculé ; menu Ctrl/⌘ K (recherche de factures et de clients, actions rapides).
- [ ] `notFound()` pour les identifiants inconnus ; `loading.tsx` et `error.tsx` par section.
- [ ] Premiers tests Playwright : visite de toutes les routes, et parcours « créer un client → créer une facture → émettre → paiement partiel → payée ».
- **Terminé quand** : tous les parcours fonctionnent à la souris et au clavier, sur desktop et mobile ; tests unitaires et E2E au vert.

### Phase 3 — Base de données Supabase et tests (L)

Objectif : persistance réelle, sécurité par la RLS, et preuve par les tests.

- [ ] Outillage : Supabase CLI en dépendance de dev ; pile locale via **Docker Desktop + WSL2** (absents aujourd'hui ; la machine a largement la mémoire nécessaire). À défaut, repli sur un projet Supabase « dev » dans le cloud.
- [ ] Migrations SQL versionnées : extensions, énumérations, tables, contraintes, index, vues, fonctions, triggers, RLS, buckets et politiques de Storage, droits (`revoke` pour `anon`).
- [ ] `seed.sql` généré à partir des mêmes données de démo ; types TypeScript générés (`supabase gen types`).
- [ ] Remplacement du magasin local par Supabase dans `queries.ts` et `actions.ts` (signatures inchangées), puis suppression du magasin local.
- [ ] Clients Supabase (serveur et navigateur) et `proxy.ts` qui rafraîchit la session. **Connexion de développement temporaire** (utilisateur de démo, en développement uniquement) pour travailler sous RLS avant la phase 4. Jamais de clé secrète pour contourner la RLS.
- [ ] Envoi du logo et du cachet directement du navigateur vers Storage (protégé par RLS), sans passer par une Server Action.
- [ ] Tests pgTAP (`supabase test db`) : matrice d'isolation entre entreprises, immuabilité, numérotation (suite continue, remise à zéro annuelle, indépendance entre entreprises), paiements et statuts, accès anonyme limité à `get_public_invoice`.
- [ ] Tests d'intégration Vitest sur la base locale : fonctions d'accès aux données et **parité des calculs TypeScript/SQL** sur les cas de référence.
- [ ] Security Advisor et Performance Advisor sans alerte.
- **Terminé quand** : tous les tests (unitaires, pgTAP, intégration, E2E) passent sur la base locale.
- **J'ai besoin de toi** : un compte Supabase ; ton accord pour installer WSL2 et Docker Desktop (droits administrateur et un redémarrage).

### Phase 4 — Authentification (M)

Objectif : de vrais comptes, de vraies sessions, et la création de l'entreprise au premier lancement.

- [ ] Configuration de Supabase Auth : email + mot de passe, confirmation obligatoire, politique de mot de passe, URLs de redirection, **SMTP via Resend** (indispensable), modèles d'emails en français ; Google OAuth et CAPTCHA Turnstile en option.
- [ ] Pages de connexion, d'inscription, de mot de passe oublié et de réinitialisation ; routes `auth/confirm` et `auth/callback` ; déconnexion.
- [ ] `proxy.ts` : redirections entre espaces visiteur et connecté, paramètre `next` sécurisé, filtre limité aux routes de l'application et de l'authentification (la landing reste statique).
- [ ] DAL : `requireUser()` et `requireOrg()`, mis en cache le temps d'une requête et appelés par les layouts, pages, actions et routes.
- [ ] Onboarding : `create_organization` → réglages essentiels (nom ; pays, qui préremplit devise, TVA et identifiant fiscal ; logo) → tableau de bord. Redirection automatique tant que l'entreprise n'existe pas.
- [ ] Compte : profil, changement d'email et de mot de passe, suppression (avec rappel de l'obligation de conservation et proposition d'export).
- [ ] Envoi réel des factures par email (Resend, PDF joint, `reply-to` de l'entreprise).
- [ ] Suppression de la connexion de développement temporaire.
- [ ] Tests E2E : inscription avec confirmation (boîte mail locale fournie par Supabase), connexion, mot de passe oublié, redirections, tentative d'ouvrir la facture d'une autre entreprise → 404.
- **Terminé quand** : deux comptes de test ne voient jamais les données l'un de l'autre, ni par l'interface ni par l'API.
- **J'ai besoin de toi** : un nom de domaine (pour l'envoi d'emails) et un compte Resend ; des identifiants Google si tu veux la connexion Google.

### Phase 5 — Landing page (M)

Objectif : une vitrine fidèle à la capture 1, rapide et bien référencée.

- [ ] Sections : navigation ; hero (titre en serif, bouton « Créer ma première facture », vraie capture de l'application) ; bandeau « Conçu pour les entrepreneurs, de Dakar à Douala » (pas de faux logos) ; 4 avantages ; « comment ça marche » en 3 étapes (bandeau prune, frise dorée) ; aperçu produit annoté (TVA 18 % automatique, montant en lettres, WhatsApp, mobile money) ; tarifs en FCFA ; FAQ ; dernier appel à l'action ; pied de page.
- [ ] Témoignages : section prête mais **masquée tant qu'il n'y a pas de vrais témoignages**.
- [ ] Pages légales (modèles à faire valider par un juriste).
- [ ] SEO : métadonnées, image Open Graph générée, `sitemap`, `robots`, données structurées, `lang="fr"` ; manifeste web (ajout à l'écran d'accueil du téléphone).
- [ ] Performance : rendu statique, images optimisées ; Lighthouse mobile ≥ 90 en performance, accessibilité et SEO.
- **Terminé quand** : tu as validé la landing visuellement et elle atteint les scores visés.
- **J'ai besoin de toi** : le nom définitif (D4), la grille tarifaire, les informations légales de l'éditeur du service.

### Phase 6 — Passage de bout en bout, sécurité, déploiement, re-test (M)

Objectif : prouver que tout fonctionne, puis mettre en production.

- [ ] **Audit de sécurité** suivant le §9 : revue de la RLS et des fonctions SQL, advisors, en-têtes et CSP, limitation de débit (Upstash) sur le lien public, l'envoi d'emails et l'authentification, redirections, envois de fichiers, dépendances, revue de chaque Server Action.
- [ ] Suite complète : tests unitaires, pgTAP, intégration, E2E desktop et mobile, scan d'accessibilité axe, Lighthouse.
- [ ] Production : projet Supabase **Pro** à Paris (migrations, Auth, SMTP, Storage) ; projet Vercel **Pro** (le plan gratuit Hobby interdit l'usage commercial), fonctions à Paris (`cdg1`), variables d'environnement par environnement, domaine et DNS (SPF, DKIM, DMARC) ; Sentry, Vercel Analytics, Speed Insights.
- [ ] CI sur GitHub Actions : lint, typecheck, tests unitaires, pgTAP (Supabase lancé dans la CI), build ; E2E sur chaque déploiement de prévisualisation ; application contrôlée des migrations.
- [ ] **Déploiement puis re-test** : tests de fumée Playwright sur l'URL de production avec un compte de test dédié, et recette manuelle (email reçu, PDF, lien WhatsApp sur un vrai téléphone Android, navigation en 3G simulée).
- [ ] Exploitation : sauvegardes vérifiées, procédure de retour arrière (rollback instantané Vercel, migrations correctives), alertes.
- **Terminé quand** : la liste de contrôle de mise en production est entièrement cochée.
- **J'ai besoin de toi** : les abonnements Vercel Pro et Supabase Pro, et l'accès au DNS du domaine.

---

## 13. Stratégie de tests

| Niveau | Outil | Ce qu'on teste | Introduit en |
|---|---|---|---|
| Unitaire | Vitest | Domaine (argent, TVA, montant en lettres, statuts, numérotation, dates), schémas Zod, export CSV | Phases 1–2 |
| Composants | Vitest + Testing Library | Éditeur de lignes, `MoneyInput`, validation du formulaire de facture | Phase 2 |
| Base de données | pgTAP | RLS (matrice A/B), triggers, fonctions, accès anonyme | Phase 3 |
| Intégration | Vitest + Supabase local | Accès aux données, parité des calculs TypeScript/SQL | Phase 3 |
| Bout en bout | Playwright (+ axe) | Parcours critiques, desktop et mobile | Phases 2 → 6 |
| Production | Playwright (tests de fumée) | Parcours critiques sur l'URL réelle | Phase 6 |

Parcours E2E critiques :

1. Inscription → confirmation → création de l'entreprise.
2. Nouveau client → nouvelle facture → émission → envoi par email.
3. Paiement partiel puis solde → statuts et tableau de bord à jour.
4. Facture échue → statut « En retard ».
5. Lien public et PDF consultables sans être connecté.
6. Tentative d'accès à une autre entreprise → 404.
7. Brouillon supprimé → aucun trou dans la numérotation.
8. Parcours complet sur mobile (390 px).

---

## 14. Environnements, déploiement et coûts

| Environnement | Application | Base de données | Emails |
|---|---|---|---|
| Local | `next dev` | Supabase local (Docker) | Boîte mail locale de Supabase |
| Prévisualisation | Vercel Preview (une par branche) | Projet Supabase « dev » | Resend (mode test) |
| Production | Vercel Pro, fonctions à Paris (`cdg1`) | Supabase Pro, Paris (`eu-west-3`) | Resend, domaine vérifié |

Variables d'environnement : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` (serveur uniquement), `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `EMAIL_FROM`, puis `SENTRY_DSN`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `TURNSTILE_SECRET_KEY`.

Coûts mensuels indicatifs au lancement : Vercel Pro ≈ 20 $ par membre, Supabase Pro ≈ 25 $, Resend gratuit jusqu'à 3 000 emails par mois puis ≈ 20 $, Sentry et Upstash gratuits au départ, domaine ≈ 10 à 15 $ par an. **Total ≈ 45 à 50 $ par mois.** Pendant le développement, tout est gratuit. Attention : un projet Supabase gratuit se met en pause après une semaine d'inactivité et n'a pas de sauvegardes, il ne convient donc pas à la production.

---

## 15. Risques et parades

| Risque | Impact | Parade |
|---|---|---|
| Conformité fiscale selon le pays (FNE, e-MECeF…) | Élevé selon le pays | Choix du pays de lancement (D2), avis d'un expert-comptable, intégrations planifiées après le MVP |
| Erreur de calcul monétaire | Élevé | Entiers, base qui fait autorité, cas de référence testés côté TypeScript et SQL |
| Fuite de données entre entreprises | Critique | RLS + DAL + matrice de tests en CI |
| Framework sans correctifs de sécurité | Élevé | D1 (Next 16) |
| Emails classés en spam | Moyen | Domaine authentifié (SPF, DKIM, DMARC) ; WhatsApp comme canal alternatif |
| Connexion lente ou instable | Moyen | Rendu côté serveur, peu de JavaScript, squelettes de chargement ; PWA plus tard |
| Dérive du périmètre | Moyen | MVP figé (§3.2), le reste au §16 |
| Dépendance à Supabase | Faible | Postgres standard, migrations SQL dans le repo |

---

## 16. Après le MVP (priorité indicative)

1. Facturation électronique certifiée par pays (FNE en Côte d'Ivoire, e-MECeF au Bénin, Burkina Faso, Sénégal selon son calendrier).
2. Devis et factures proforma, convertibles en facture (`document_sequences` gère déjà plusieurs types de documents).
3. Avoirs (correction légale d'une facture émise).
4. Relances automatiques (email, WhatsApp) et factures récurrentes (tâches planifiées Vercel Cron).
5. Paiement en ligne par mobile money (CinetPay, PayDunya, FedaPay, Wave…) avec rapprochement automatique par webhooks.
6. Abonnement payant au SaaS (plans en FCFA).
7. Plusieurs utilisateurs par entreprise et rôles (invitations) : la table `memberships` est prête.
8. Exports comptables (journal des ventes, état de TVA).
9. Mode hors ligne (PWA), WhatsApp Business API, SMS.
10. Multi-devises, interface en anglais, API publique.

---

## 17. Conventions de code (contenu du futur `CLAUDE.md`)

- Interface en **français** ; code, base de données, routes et messages de commit en **anglais**.
- Argent : entiers FCFA uniquement ; tout calcul passe par `src/domain/` ; jamais de `parseFloat` ni de `* 0.18` sur un montant.
- Dates métier au type `date` ; « aujourd'hui » se calcule dans le fuseau de l'entreprise.
- Données : uniquement via `features/*/queries.ts` et `actions.ts` (modules serveur) ; aucun composant n'interroge Supabase directement.
- Toute mutation = Server Action + validation Zod + `requireOrg()` + revalidation + résultat typé.
- RLS toujours active ; la clé secrète ne sert jamais à contourner une politique.
- Une migration SQL par changement de schéma ; jamais de modification manuelle en production.
- Pas de logique métier ni de politique RLS sans test.
- Composants shadcn/ui re-thémés ; aucune couleur codée en dur en dehors des tokens.

---

## 18. Journal des décisions

| Date | Décision | Statut |
|---|---|---|
| 18/10/2026 | Plan initial rédigé ; captures copiées dans `docs/design/inspiration/` ; couleurs mesurées sur les captures (§10.2) | Fait |
| — | D1 à D7 (§2) | En attente de validation |

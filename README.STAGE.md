# README Stage - Backend Security Project

## Contexte
Ce document est dedie a la presentation academique du projet.
Le README principal reste oriente produit/professionnel.

## Objectif du Projet
Construire une API backend NestJS securisee pour un site vitrine de restaurant.

## Perimetre Fonctionnel
- Inscription (`register`) avec `nom`, `prenom`, `telephone`, `email`, `password`
- Connexion (`login`)
- Renouvellement de session (`refresh`)
- Deconnexion (`logout`)
- Mot de passe oublie et reinitialisation (`forgot-password` / `reset-password`)
- Gestion utilisateurs (lecture, modification, suppression) avec roles (`admin`, `employee`)
- Gestion des categories de carte (`categories`)
- Gestion des plats (`menu-items`) relies aux categories
- **Reservations client** (bookings): creation, suivi, modification statut (confirmer/annuler)
- **Demandes d'evenements** (event-requests): formulaire complet pour les evenements prives
- **Dashboard admin**: vue d'ensemble avec KPIs et listes recentes

## Realisations Techniques
- Stack: NestJS + TypeORM + PostgreSQL
- Migrations SQL pour faire evoluer le schema de maniere controlee
- Validation des donnees avec DTO + `class-validator` + sanitization (XSS protection)
- Configuration centralisee via variables d'environnement + validation Joi
- Documentation API via Swagger (tags et schemas DTO)
- Relations SQL: `menu_items.categoryId -> categories.id`, `bookings.userId -> users.id`, `eventRequests.userId -> users.id`
- Extension du modele `users` avec `nom`, `prenom`, `telephone` et `role` (enum: admin, employee, customer)
- Seeder idempotent pour le peuplement initial de la carte + seeding optional d'admin via `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`
- Deux nouveaux modules complets: `bookings` et `event-requests` avec validations specifiques
- Module `dashboard` pour agreger KPIs et metriques d'administration
- Routes admin protegees par `JwtAuthGuard` + `RolesGuard` + `@Roles()`

## Seeder (Donnees de la Carte)

Le projet integre un seeder lance via `npm run seed:run` independamment du demarrage de l'API.

### Fonctionnement
- Logique d'**upsert** par nom : chaque item est insere s'il est absent, ou mis a jour uniquement si un champ surveille a change.
- Correspondance aux anciens noms pour gerer les renommages sans perte de donnees.
- Ordre des categories preserve via `displayOrder`.
- Trois niveaux de prix (`price`, `priceGourmand`, `priceTresGourmand`) pour les formules verre / demi-bouteille / bouteille.

### Pourquoi les donnees de la carte sont-elles ecrites en dur dans le seed ?

Ce projet est un site **vitrine** pour un restaurant reel. La carte est un contenu **metier stable et controle**, pas une donnee generee par les utilisateurs. L'ecrire directement dans le seed presente plusieurs avantages :

- **Reproductibilite** : tout nouvel environnement (dev, staging, prod) obtient automatiquement la carte complete apres `migration:run` + `seed:run`, sans saisie manuelle.
- **Tracabilite Git** : chaque modification de prix, de description ou de disponibilite est versionnee aux cotes du code et du schema, offrant un historique complet.
- **Idempotence** : le seed peut etre rejoue autant de fois que necessaire sans creer de doublons ni ecraser des donnees utilement.
- **Separation des responsabilites** : le schema evolue via les migrations, la carte via le seed, et les donnees dynamiques (reservations, comptes utilisateurs) via l'API — chaque couche a son outil.

## Securite Mise en Place
- Hash des mots de passe avec Argon2
- Refresh token stocke sous forme hashee et rotation a chaque refresh
- Token de reset hashe, expire, et usage unique
- Anti-enumeration sur forgot-password
- Journal d'audit securite (`security_events`)
- Lockout progressif par compte + remise a zero des echecs apres fenetre temporelle
- Rate limiting global et sur routes sensibles
- Helmet + CSP stricte avec relaxation pour Swagger
- Swagger active en developpement uniquement
- Parametres anti-abus configurables via env
- **Validation XSS**: tous les champs texte de DTOs valident `@Matches(/^[^<>]*$/)` + `@Transform(trim)`
- **Gestion d'acces**: `JwtAuthGuard`, `RolesGuard`, `@Roles()` decorator pour proteger les routes admin
- **Validations au niveau metier**: transitions d'etat explicites sur bookings (pending→confirmed/cancelled) et event-requests (statuts terminaux immutables)
- **Messages d'erreur explicites**: `BadRequestException` et `NotFoundException` avec details contextuels pour le frontend
- **CORS securise**: `allowedHeaders: ['Authorization', 'Content-Type']` pour les tokens Bearer

## Resultats de Tests
- Tests unitaires passes: 14 suites, 33 tests
- Fichiers critiques testes:
  - `src/auth/auth.service.spec.ts`
  - `src/users/users.service.spec.ts`
  - `src/users/users.controller.spec.ts`
  - `src/bookings/bookings.service.spec.ts`
  - `src/bookings/bookings.controller.spec.ts`
  - `src/event-requests/event-requests.service.spec.ts`
  - `src/event-requests/event-requests.controller.spec.ts`
  - `src/dashboard/dashboard.service.spec.ts`
  - `src/dashboard/dashboard.controller.spec.ts`
- Build valide et typecheck clean

## Couverture (Etat Actuel)
- `auth.service.ts`: ~75%
- `users.service.ts`: ~85%
- `users.controller.ts`: 100%
- `bookings`: modules/specs generes par NestJS, logique metier complete (CRUD, status updates, stats)
- `event-requests`: modules/specs generes par NestJS, logique metier complete (CRUD, validation participants, transitions d'etat)
- `dashboard`: agrege donnees de bookings et event-requests
- Couverture globale plus basse car modules/bootstrap/migrations sont inclus dans le calcul
- Tests unitaires valent les logiques critiques (access control, validations); E2E tests possibles pour les workflows admin

## Conformite Donnees (RGPD/CNIL - niveau projet)
- Donnees collectees limitees au necessaire fonctionnel et securitaire
- Aucun mot de passe en clair
- Hashes/tokens traites avec bonnes pratiques
- Donnees d'evenements et reservations associes aux utilisateurs avec acces control (owner ou admin)
- Possibilite de deletion de reservations/demandes par l'utilisateur ou admin

## Nouvelles Routes de Gestion (Phase 2)

### Bookings (`/bookings`)
- `POST /bookings` — creer une reservation
- `GET /bookings` — lister mes reservations (user) ou toutes (admin)
- `GET /bookings/admin/all` — admin: liste complete des reservations
- `GET /bookings/:id` — details d'une reservation
- `PATCH /bookings/:id` — modifier une reservation (user/admin)
- `PATCH /bookings/:id/status` — admin-only: confirmer/annuler une reservation avec validation d'etat
- `DELETE /bookings/:id` — supprimer une reservation
- `GET /bookings/stats` — admin: KPIs (total, upcoming, today, by status)
- `GET /bookings/admin/stats` — admin: statistiques avancees (today total, pending count, confirmed guests today sum)

### Event Requests (`/event-requests`)
- `POST /event-requests` — soumettre une demande d'evenement
- `GET /event-requests` — lister mes demandes (user) ou toutes (admin)
- `GET /event-requests/admin/all` — admin & employee: liste complete
- `GET /event-requests/:id` — details d'une demande
- `PATCH /event-requests/:id` — modifier une demande avec validation de transitions d'etat
- `DELETE /event-requests/:id` — supprimer une demande

### Dashboard (`/dashboard`)
- `GET /dashboard/overview` — admin: vue d'ensemble avec KPIs, statuts, dernieres operations

## Prototype Frontend

**Fichier**: `public/admin-dashboard.html`

Prototype HTML/CSS/vanilla JavaScript servant de dashboard administrateur temporaire:
- Champ d'authentification (Bearer token manuel)
- Section KPIs: total users, bookings, event requests, metriques journalieres
- Section statuts: count by status pour bookings et event requests
- Section listes: 10 dernieres reservations et demandes d'evenements
- Accessible via `http://localhost:3010/admin-dashboard.html` ou fichier local (`file://`)

Note: Ce prototype sera remplace par une application React/Vite dans une phase ulterieure.
- Reste a formaliser: politique de retention documentee et runbook operationnel production

## Limites et Ameliorations
- Protection DDoS infra a renforcer (WAF/reverse proxy/edge rate limit)
- Strategie CSRF a formaliser selon le mode d'authentification front
- Gestion centralisee des secrets en production (secret manager)
- Ajouter le module `reservations` (entity, DTO, endpoints, validation metier)
- Ajouter tests unitaires `categories` et `menu-items`

## Slide 1 Minute (Oral)
- Objectif: securiser une API NestJS d'authentification et de gestion utilisateurs.
- Realisations: auth complete, roles persistants, reset password, audit securite, categories et menu-items.
- Securite: Argon2, rotation refresh token, anti-enumeration, lockout progressif, CSP, throttling.
- Tests: 22 tests unitaires passes, forte couverture sur services critiques.
- Suite: module reservations, tests categories/menu-items, WAF, secret manager, politique CSRF et retention logs.

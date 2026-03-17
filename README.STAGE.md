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
- Gestion utilisateurs (lecture, modification, suppression)
- Gestion des categories de carte (`categories`)
- Gestion des plats (`menu-items`) relies aux categories
- Reservation client: prevue comme prochaine brique

## Realisations Techniques
- Stack: NestJS + TypeORM + PostgreSQL
- Migrations SQL pour faire evoluer le schema de maniere controlee
- Validation des donnees avec DTO + `class-validator`
- Configuration centralisee via variables d'environnement + validation Joi
- Documentation API via Swagger (tags et schemas DTO)
- Relations SQL: `menu_items.categoryId -> categories.id`
- Extension du modele `users` avec `nom`, `prenom` et `telephone`
- Seeder idempotent pour le peuplement initial de la carte

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
- Helmet + CSP stricte
- Swagger active en developpement uniquement
- Parametres anti-abus configurables via env

## Resultats de Tests
- Tests unitaires passes: 22/22
- Fichiers critiques testes:
  - `src/auth/auth.service.spec.ts`
  - `src/users/users.service.spec.ts`
  - `src/users/users.controller.spec.ts`
- Build valide apres ajout des modules `categories` et `menu-items`

## Couverture (Etat Actuel)
- `auth.service.ts`: ~75%
- `users.service.ts`: ~85%
- `users.controller.ts`: 100%
- Couverture globale plus basse car modules/bootstrap/migrations sont inclus dans le calcul
- `categories`/`menu-items`: fonctionnel en API, tests unitaires a ajouter

## Conformite Donnees (RGPD/CNIL - niveau projet)
- Donnees collectees limitees au necessaire fonctionnel et securitaire
- Aucun mot de passe en clair
- Hashes/tokens traites avec bonnes pratiques
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

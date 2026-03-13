# README Stage - Backend Security Project

## Contexte
Ce document est dedie a la presentation academique du projet.
Le README principal reste oriente produit/professionnel.

## Objectif du Projet
Construire une API backend NestJS securisee pour un site vitrine de restaurant.

## Perimetre Fonctionnel
- Inscription (`register`)
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

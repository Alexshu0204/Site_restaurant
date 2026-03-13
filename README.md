# Le General API

Backend API for a restaurant showcase website with authentication, users management, categories, and menu items.

## Tech Stack

- NestJS
- TypeORM
- PostgreSQL
- JWT (access + refresh)
- Argon2
- Swagger

## Features

- Authentication: register, login, refresh, logout
- Password recovery: forgot-password and reset-password
- Security events audit trail (`security_events`)
- Users CRUD with role/owner protection
- Categories CRUD
- Menu items CRUD linked to categories

## Security

- Password hashing with Argon2
- Refresh token rotation and hashed storage
- Reset token hashing + expiration + single-use behavior
- Anti-enumeration on forgot-password
- Progressive account lockout with env-driven thresholds
- Throttling on sensitive auth endpoints
- Helmet + strict CSP
- Swagger enabled in development only

## Setup

```bash
npm install
```

## Environment

Core variables:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `JWT_REFRESH_SECRET`
- `JWT_REFRESH_EXPIRES_IN`

Auth anti-abuse policy variables:

- `AUTH_LOGIN_THROTTLE_LIMIT` (default: `20`)
- `AUTH_LOGIN_THROTTLE_TTL_MS` (default: `60000`)
- `AUTH_FORGOT_THROTTLE_LIMIT` (default: `5`)
- `AUTH_FORGOT_THROTTLE_TTL_MS` (default: `60000`)
- `AUTH_REFRESH_THROTTLE_LIMIT` (default: `10`)
- `AUTH_REFRESH_THROTTLE_TTL_MS` (default: `60000`)
- `AUTH_FAILED_ATTEMPT_RESET_WINDOW_MS` (default: `1800000`)
- `AUTH_LOCKOUT_TIER1_ATTEMPTS` (default: `10`)
- `AUTH_LOCKOUT_TIER1_MINUTES` (default: `5`)
- `AUTH_LOCKOUT_TIER2_ATTEMPTS` (default: `15`)
- `AUTH_LOCKOUT_TIER2_MINUTES` (default: `10`)
- `AUTH_LOCKOUT_TIER3_ATTEMPTS` (default: `20`)
- `AUTH_LOCKOUT_TIER3_MINUTES` (default: `60`)
- `AUTH_LOCKOUT_TIER4_ATTEMPTS` (default: `30`)
- `AUTH_LOCKOUT_TIER4_MINUTES` (default: `300`)

## Run

```bash
npm run start
npm run start:dev
npm run start:dev:clean
npm run start:prod
```

## Seeder

```bash
npm run seed:run
```

## Migrations

```bash
npm run migration:generate
npm run migration:run
npm run migration:revert
```

## Tests

```bash
npm run test
npm run test:cov
```

Focused suites:

```bash
npm test -- auth/auth.service.spec.ts
npm test -- users/users.service.spec.ts users/users.controller.spec.ts
```

## API Docs

- Swagger URL (development): `/docs`
- Current tags: `auth`, `users`, `categories`, `menu-items`

## Notes

- `menu_items.imageUrl` and `menu_items.description` are nullable.
- Price is stored in centimes (`int`).
- `README.STAGE.md` contains the academic presentation version.

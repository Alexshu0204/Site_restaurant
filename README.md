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

- **Authentication**: register, login, refresh, logout
- **Registration**: requires `nom`, `prenom`, `telephone`, `email`, and `password`
- **Password recovery**: forgot-password and reset-password
- **Security events**: audit trail (`security_events`)
- **Users**: CRUD with role/owner protection and admin/employee roles
- **Categories**: CRUD (admin/employee management)
- **Menu items**: CRUD with category relations (admin/employee mutations, public read)
- **Bookings**: create, list, update, delete with status management
  - Admin routes: `GET /bookings/admin/all`, `GET /bookings/stats`, `GET /bookings/admin/stats`, `PATCH /bookings/:id/status`
  - Status management for `pending`, `confirmed`, `cancelled` with state validation
- **Event Requests**: full CRUD for large event planning
  - Admin route: `GET /event-requests/admin/all` (admin & employee)
  - Status workflow: `InquiryReceived` → `QuoteSent` → `AwaitingClientConfirmation` → `Confirmed`/`Declined`/`Cancelled`
- **Dashboard**: admin overview with KPIs and recent records
  - Endpoint: `GET /dashboard/overview` (admin only)
  - HTML prototype: `/admin-dashboard.html`

## Project Structure

```text
le-general-v2/
|-- docker-compose.yml
|-- eslint.config.mjs
|-- nest-cli.json
|-- package.json
|-- README.md
|-- README.STAGE.md
|-- tsconfig.build.json
|-- tsconfig.json
|-- coverage/
|   |-- lcov-report/
|   `-- src/
|-- scripts/
|   `-- start-dev-clean.ps1
|-- src/
|   |-- app.controller.spec.ts
|   |-- app.controller.ts
|   |-- app.module.ts
|   |-- app.service.ts
|   |-- main.ts
|   |-- auth/
|   |   |-- decorators/
|   |   |-- dto/
|   |   |-- entities/
|   |   |-- guards/
|   |   |-- strategies/
|   |   |-- auth.controller.ts
|   |   |-- auth.module.ts
|   |   |-- auth.service.spec.ts
|   |   `-- auth.service.ts
|   |-- bookings/
|   |   |-- dto/
|   |   |-- entities/
|   |   |-- bookings.controller.spec.ts
|   |   |-- bookings.controller.ts
|   |   |-- bookings.module.ts
|   |   |-- bookings.service.spec.ts
|   |   `-- bookings.service.ts
|   |-- categories/
|   |   |-- dto/
|   |   |-- entities/
|   |   |-- categories.controller.spec.ts
|   |   |-- categories.controller.ts
|   |   |-- categories.module.ts
|   |   |-- categories.service.spec.ts
|   |   `-- categories.service.ts
|   |-- common/
|   |   `-- filters/
|   |-- database/
|   |   |-- migrations/
|   |   |-- data-source.ts
|   |   `-- typeorm-debug.service.ts
|   |-- event-requests/
|   |   |-- dto/
|   |   |-- entities/
|   |   |-- event-requests.controller.spec.ts
|   |   |-- event-requests.controller.ts
|   |   |-- event-requests.module.ts
|   |   |-- event-requests.service.spec.ts
|   |   `-- event-requests.service.ts
|   |-- menu-items/
|   |   |-- dto/
|   |   |-- entities/
|   |   |-- menu-items.controller.spec.ts
|   |   |-- menu-items.controller.ts
|   |   |-- menu-items.module.ts
|   |   |-- menu-items.service.spec.ts
|   |   `-- menu-items.service.ts
|   |-- seed/
|   |   |-- run-seed.ts
|   |   |-- seed.module.ts
|   |   `-- seed.service.ts
|   `-- users/
|       |-- dto/
|       |-- entities/
|       |-- guards/
|       |-- users.controller.spec.ts
|       |-- users.controller.ts
|       |-- users.module.ts
|       |-- users.service.spec.ts
|       `-- users.service.ts
`-- test/
	|-- app.e2e-spec.ts
	`-- jest-e2e.json
```

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

The seeder populates the database with all restaurant categories and menu items. It uses an idempotent upsert strategy: running it multiple times is safe — it only inserts rows that don't exist yet, or updates rows whose tracked fields have changed.

### Why are menu items hardcoded in the seed?

This is a showcase site for a real restaurant. The menu is curated, stable content — it is not generated by users. Hardcoding it in the seed file serves several purposes:

- **Reproducibility**: any fresh environment (dev, staging, prod) gets the full, correct menu automatically after running migrations and the seed, with no manual re-entry.
- **Version control**: changes to the menu (prices, descriptions, availability) are tracked in Git alongside the schema and code, giving a full audit trail.
- **Idempotence**: the upsert logic detects field-level changes and only writes what is necessary, making repeated runs side-effect-free.
- **Separation of concerns**: schema changes go through migrations, menu content goes through the seed, and dynamic data (reservations, user accounts) goes through the API — each layer has its own tool.

Data managed by the seed: **categories** (with `displayOrder`) and **menu items** (name, description, `price` / `priceGourmand` / `priceTresGourmand`, availability, image URL).

## Admin & Employee Routes

Routes marked `/admin/*` are protected with `JwtAuthGuard` + `RolesGuard` + `@Roles('admin', 'employee')`, except where noted:

- `GET /bookings/admin/all` — all bookings (admin only)
- `GET /bookings/stats` — KPI stats (admin only)
- `GET /bookings/admin/stats` — enhanced stats: today's total, pending count, confirmed guests today (admin only)
- `PATCH /bookings/:id/status` — update booking status (admin only)
- `GET /event-requests/admin/all` — all event requests (admin & employee)
- `GET /dashboard/overview` — aggregated KPIs and recent records (admin only)

### Error Handling

Administrative operations include explicit error messages for state transitions:

- Booking: cannot confirm/cancel non-existent, already-set, or cancelled reservations
- Event Request: cannot modify terminal states (`confirmed`, `declined`, `cancelled`); prevents duplicate status assignments

## CORS Configuration

CORS is configured to allow:

- Origins: `http://localhost:3010` (development), `http://localhost:5173` (Vite), `null` (file:// protocol for local HTML files)
- Methods: `GET`, `HEAD`, `PUT`, `PATCH`, `POST`, `DELETE`, `OPTIONS`
- Headers: `Authorization` (Bearer tokens), `Content-Type`
- Credentials: enabled

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
- Current tags: `auth`, `users`, `categories`, `menu-items`, `bookings`, `event-requests`, `dashboard`

## Notes

- `menu_items.imageUrl` and `menu_items.description` are nullable.
- Price is stored in centimes (`int`).
- User profile fields `nom`, `prenom`, and `telephone` are stored in `users` and required during registration.
- `README.STAGE.md` contains the academic presentation version.

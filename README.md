# OpenRouter Monorepo

This repository is a Bun + Turborepo monorepo with backend services, a dashboard frontend, and shared packages for the database layer, UI components, and repo-wide tooling.

## Workspace Layout

### Apps

- `apps/api-backend`: lightweight API backend entrypoint
- `apps/primary-backend`: main backend service built with Elysia
- `apps/dashboard-frontend`: Bun + React dashboard frontend

### Packages

- `packages/db`: Prisma schema, migrations, and generated database client
- `packages/ui`: shared React UI components
- `packages/eslint-config`: shared ESLint configuration
- `packages/typescript-config`: shared TypeScript configuration

## File Structure

```text
.
├── apps
│   ├── api-backend
│   │   ├── index.ts
│   │   └── package.json
│   ├── dashboard-frontend
│   │   ├── build.ts
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── APITester.tsx
│   │   │   ├── App.tsx
│   │   │   ├── frontend.tsx
│   │   │   ├── index.css
│   │   │   ├── index.html
│   │   │   ├── index.tsx
│   │   │   ├── components/ui
│   │   │   └── lib/utils.ts
│   │   └── styles
│   │       └── globals.css
│   └── primary-backend
│       ├── package.json
│       └── src
│           ├── index.ts
│           └── modules
│               ├── apiKeys
│               ├── auth
│               ├── models
│               └── payments
├── packages
│   ├── db
│   │   ├── generated/prisma
│   │   ├── prisma
│   │   │   ├── migrations
│   │   │   └── schema.prisma
│   │   ├── index.ts
│   │   └── prisma.config.ts
│   ├── eslint-config
│   ├── typescript-config
│   └── ui
│       └── src
│           ├── button.tsx
│           ├── card.tsx
│           └── code.tsx
├── package.json
├── bun.lock
└── turbo.json
```

## Requirements

- Bun `1.2.18` or newer
- Node.js `18+`

## Install

```sh
bun install
```

## Common Commands

Run from the repository root:

```sh
# Start all workspace dev tasks configured in Turbo
bun run dev

# Build all packages/apps with a build script
bun run build

# Run lint tasks across the repo
bun run lint

# Run TypeScript checks across the repo
bun run check-types

# Format TypeScript, TSX, and Markdown files
bun run format
```

## App-Specific Commands

### Dashboard Frontend

```sh
cd apps/dashboard-frontend
bun run dev
```

### Primary Backend

```sh
cd apps/primary-backend
bun run dev
```

## Notes

- The repo uses Bun workspaces with Turborepo for task orchestration.
- Database schema and migrations live in `packages/db/prisma`.
- Generated Prisma client files are committed under `packages/db/generated/prisma`.

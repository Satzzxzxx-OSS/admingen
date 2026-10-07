# CLI Quickstart (`create-admingen`)

The fastest way to scaffold a production-ready AdminGen app is via our official CLI tool: **`create-admingen`**.

It interactively configures your database, generates type-safe Drizzle schemas, and provides a running Elysia server with pre-seeded demo data in seconds.

---

## Interactive Scaffolding

Run the CLI directly in your terminal using Bun (or Node / npx):

::: code-group

```bash [Bun (Recommended)]
bunx create-admingen my-admin
```

```bash [Node / npx]
npx create-admingen my-admin
```

```bash [pnpm]
pnpm create admingen my-admin
```

:::

You will be prompted to select your database:
* **SQLite (Recommended):** Runs via Bun's native `bun:sqlite` driver. Zero external setup required.
* **PostgreSQL:** Relational Postgres setup with a ready-to-run `docker-compose.yml` included.

---

## Non-Interactive & CI Flags

You can bypass interactive prompts by passing CLI flags:

### 1. Instant SQLite App
```bash
bunx create-admingen my-app --sqlite -y
```

### 2. PostgreSQL App (with Docker Compose)
```bash
bunx create-admingen my-app --postgres -y
```

### 3. Blank SQLite (Without Seed Data)
```bash
bunx create-admingen my-app --sqlite --no-seed -y
```

---

## What Gets Generated

Your scaffolded project includes a lean, production-ready structure:

```
my-admin/
├── src/
│   ├── index.ts        # Elysia server mounting AdminGen on port 3000
│   ├── schema.ts       # Drizzle tables with foreign keys and relations
│   └── seed.ts         # Pre-seeded teams, users, and posts (if enabled)
├── package.json        # Dependencies: Elysia, Drizzle ORM, AdminGen
├── tsconfig.json       # Type-safe TypeScript configuration
├── README.md           # Getting started instructions
└── .gitignore          # Ignores node_modules, sqlite.db, etc.
```

---

## Next Steps

Once scaffolded, start your local development server:

```bash
cd my-admin
bun install
bun dev
```

Open your browser to:

👉 **`http://localhost:3000/admin`**  
🔑 Default demo credentials: **`admin`** / **`admin`**

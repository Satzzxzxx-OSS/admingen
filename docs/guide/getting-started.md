# Getting Started

AdminGen is an instant, headless admin panel for **Bun**, **ElysiaJS**, and **Drizzle ORM**. It automatically introspects your database models at runtime and mounts a modern, dark-mode single-page application directly inside your Elysia server.

---

## Prerequisites

- [Bun](https://bun.sh) runtime (v1.1+ recommended)
- An [ElysiaJS](https://elysiajs.com) application
- A database managed with [Drizzle ORM](https://orm.drizzle.team) (SQLite or PostgreSQL)

---

## 1. Installation

Install AdminGen and the official Drizzle adapter in your project:

```bash
bun add @sorvien/admingen @sorvien/admingen-adapter-drizzle
```

Ensure peer dependencies are installed:

```bash
bun add elysia drizzle-orm
```

---

## 2. Quick Setup

Mount AdminGen into your Elysia server with `createDrizzleAdapter`:

```ts
// src/index.ts
import { Elysia } from 'elysia';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import { AdminGen } from '@sorvien/admingen';
import { createDrizzleAdapter } from '@sorvien/admingen-adapter-drizzle';
import * as schema from './schema';

// 1. Initialize Database
const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite, { schema });

// 2. Create the Adapter
const adapterResult = createDrizzleAdapter({
  schema,
});

// 3. Mount AdminGen
const app = new Elysia()
  .decorate('db', db)
  .use(AdminGen({
    adapterResult,
  }))
  .listen(3000);

console.log('⚡ Admin Panel running at http://localhost:3000/admin');
```

---

## 3. Accessing the Dashboard

Start your development server:

```bash
bun run --watch src/index.ts
```

Open your browser to:

👉 **`http://localhost:3000/admin`**

By default, AdminGen operates in **zero-config mode**:
- Schema is introspected automatically.
- All tables appear in the navigation sidebar.
- Tables, foreign keys, and dates are mapped to interactive data tables.
- Authentication is bypassed in development so you can immediately inspect data.

---

## 4. Next Steps

- [Configure SQLite Database](/guide/sqlite)
- [Configure PostgreSQL Database](/guide/postgres)
- [Add Pluggable Authentication](/guide/auth)

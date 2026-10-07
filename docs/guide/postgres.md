# PostgreSQL Recipe

AdminGen fully supports PostgreSQL with Drizzle ORM. You can connect to local Postgres, Docker, Supabase, Neon, or AWS RDS.

---

## 1. Installation

Install the `postgres` driver along with Drizzle ORM:

```bash
bun add postgres drizzle-orm
bun add @sorvien/admingen @sorvien/admingen-adapter-drizzle
```

---

## 2. Defining Your Schema

Define your tables using `drizzle-orm/pg-core`:

```ts
// src/schema.ts
import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const organizations = pgTable('organizations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const members = pgTable('members', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  fullName: text('full_name').notNull(),
  organizationId: integer('organization_id').references(() => organizations.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const organizationsRelations = relations(organizations, ({ many }) => ({
  members: many(members),
}));

export const membersRelations = relations(members, ({ one }) => ({
  organization: one(organizations, {
    fields: [members.organizationId],
    references: [organizations.id],
  }),
}));
```

---

## 3. Server Setup

Initialize the Postgres connection and pass the client to Drizzle:

```ts
// src/index.ts
import { Elysia } from 'elysia';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { AdminGen } from '@sorvien/admingen';
import { createDrizzleAdapter } from '@sorvien/admingen-adapter-drizzle';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/myapp';
const client = postgres(connectionString);
const db = drizzle(client, { schema });

const adapterResult = createDrizzleAdapter({
  schema,
});

const app = new Elysia()
  .decorate('db', db)
  .use(AdminGen({
    adapterResult,
  }))
  .listen(3000);

console.log('⚡ PostgreSQL Admin Panel running at http://localhost:3000/admin');
```

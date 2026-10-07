# SQLite Recipe

SQLite is the fastest way to use AdminGen. Using Bun's built-in `bun:sqlite` driver, AdminGen reads and writes SQLite databases with sub-millisecond query execution and zero external database services.

---

## 1. Defining Your Schema

Create your database schema using `drizzle-orm/sqlite-core`:

```ts
// src/schema.ts
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const teams = sqliteTable('teams', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
});

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role', { enum: ['admin', 'member', 'guest'] }).default('member'),
  teamId: integer('team_id').references(() => teams.id),
});

export const teamsRelations = relations(teams, ({ many }) => ({
  users: many(users),
}));

export const usersRelations = relations(users, ({ one }) => ({
  team: one(teams, {
    fields: [users.teamId],
    references: [teams.id],
  }),
}));
```

---

## 2. Server Setup

Initialize the SQLite database and mount AdminGen:

```ts
// src/index.ts
import { Elysia } from 'elysia';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import { AdminGen } from '@sorvien/admingen';
import { createDrizzleAdapter } from '@sorvien/admingen-adapter-drizzle';
import * as schema from './schema';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite, { schema });

const adapterResult = createDrizzleAdapter({
  schema,
});

const app = new Elysia()
  .decorate('db', db)
  .use(AdminGen({
    adapterResult,
  }))
  .listen(3000);

console.log('⚡ SQLite Admin Panel running at http://localhost:3000/admin');
```

---

## 3. Automatic Relational Lookups

AdminGen automatically detects foreign keys like `teamId` pointing to `teams.id`:
- In the **Data Table**, it fetches and displays the related team name instead of raw IDs.
- In **Create / Edit Forms**, the `teamId` field renders as a searchable dropdown select dynamically populated with available teams.

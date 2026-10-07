# 🗺️ AdminGen Roadmap & Architecture Vision

> **The Django Admin / Filament for modern TypeScript.**  
> An instant, embedded admin panel built for Bun + Elysia + Drizzle that introspects database schemas at runtime, runs in `<40MB` RAM, and requires zero manual dashboard coding.

Live progress is tracked using [GitHub Milestones](https://github.com/sorvien/admingen/milestones).

---

## 📍 Milestones Overview

| Milestone | Target Horizon | Status | Primary Focus |
| :--- | :--- | :--- | :--- |
| **[v0.2.0](https://github.com/sorvien/admingen/milestone/1)** | Next 2–3 weeks | 🟡 In Progress | UI Polish, Data Table UX & Notifications |
| **[v0.3.0](https://github.com/sorvien/admingen/milestone/2)** | Next 4–6 weeks | ⚪ Scheduled | Extensibility, Lifecycle Hooks & DB Parity |
| **[v1.0.0](https://github.com/sorvien/admingen/milestone/3)** | 2–3 months | ⚪ Planning | Production Readiness, Docs Hub & Official Launch |

---

## 🟢 Milestone 1: v0.2.0 — UI Polish & Table UX

*Focus: Elevating the frontend experience from a functional MVP to a modern, snappy, and responsive admin dashboard.*

- [ ] **Modern Toast Notifications ([#59](https://github.com/sorvien/admingen/issues/59))**
  - Replace raw browser `alert()` and `confirm()` with non-blocking toast notifications (Sonner) and Shadcn `AlertDialog` confirmation modals for destructive actions.
- [ ] **Batch & Bulk Actions ([#60](https://github.com/sorvien/admingen/issues/60))**
  - Multi-row selection checkboxes in resource tables.
  - Floating action toolbar for bulk delete with confirmation modal.
- [ ] **Column Visibility Toggle ([#61](https://github.com/sorvien/admingen/issues/61))**
  - Dropdown menu in table toolbars to show/hide columns dynamically for wide tables.
  - Persist column preferences per resource in `localStorage`.
- [ ] **Keyboard Shortcuts Cheatsheet ([#62](https://github.com/sorvien/admingen/issues/62))**
  - Cheatsheet modal triggered by pressing `?` key.
  - Global navigation shortcuts (`Cmd+K` / `Ctrl+K` for command palette and quick resource switching).
- [ ] **Faceted Filters ([#63](https://github.com/sorvien/admingen/issues/63))**
  - Filter dropdowns in table toolbars for enum and boolean columns.

---

## 🟡 Milestone 2: v0.3.0 — Extensibility & DB Parity

*Focus: Giving developers the programmatic hooks and database support needed to run AdminGen in real production applications.*

- [ ] **Lifecycle Hooks ([#64](https://github.com/sorvien/admingen/issues/64))**
  - Pluggable hooks for schema mutations:
    ```ts
    AdminGen({
      adapterResult,
      hooks: {
        users: {
          beforeCreate: async (ctx, data) => ({ ...data, password: hash(data.password) }),
          afterCreate: async (ctx, record) => sendWelcomeEmail(record.email),
          beforeDelete: async (ctx, id) => preventDeletingAdmin(id),
          afterDelete: async (ctx, record) => purgeCache(record.id),
        }
      }
    })
    ```
- [ ] **MySQL / MariaDB Dialect Introspection ([#65](https://github.com/sorvien/admingen/issues/65))**
  - Extend `@sorvien/admingen-adapter-drizzle` to support `drizzle-orm/mysql2` with full introspection parity alongside SQLite and PostgreSQL.
- [ ] **Custom Row Actions**
  - Define custom server-backed action buttons in table rows (e.g. *"Reset Password"*, *"Resend Verification"*, *"Ban User"*).
- [ ] **Role-Based Access Control (RBAC)**
  - Support granular permissions per resource (e.g. `roles: { admin: ['read', 'write', 'delete'], editor: ['read', 'write'], viewer: ['read'] }`).

---

## 🟣 Milestone 3: v1.0.0 — Production Readiness & Launch

*Focus: A rock-solid, production-grade 1.0 release ready for wide community adoption and production workloads.*

- [ ] **Dedicated Documentation Site**
  - Modern documentation hub (`admingen.dev`) built with Starlight / VitePress.
  - Quickstart guides, architecture recipes for SQLite/Postgres/MySQL, and auth provider cookbooks.
- [ ] **Overview Dashboard & Metric Widgets**
  - Customizable homepage metrics (e.g. summary cards for total users, recent signups, revenue charts).
- [ ] **File & Media Upload Handling**
  - Pluggable media upload field supporting local storage and S3 / Cloudflare R2 object storage.
- [ ] **CLI Quickstart**
  - `bunx admingen init` command that automatically detects Drizzle configuration in an existing Elysia app and sets up AdminGen in seconds.

---

## 🔮 Future Explorations (Post-1.0)

- **Framework Adapters:** Extend core adapter layer to support **Hono** backends.
- **ORM Adapters:** Potential Prisma adapter (`@sorvien/admingen-adapter-prisma`).
- **Audit Logging:** Built-in audit trail recording who modified which record and when.
- **Rich Text Fields:** Tiptap / Markdown WYSIWYG editor integration.

---

## 🤝 Contributing

Want to help us reach the next milestone? Check out our open issues:
- View all [Good First Issues](https://github.com/sorvien/admingen/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
- Read our [Contributing Guide](file:///Users/omarghandour/Desktop/proj/admingen/CONTRIBUTING.md)

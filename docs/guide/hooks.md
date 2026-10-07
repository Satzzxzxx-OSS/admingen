# Lifecycle Hooks

Resource lifecycle hooks allow you to intercept, transform, validate, and react to CRUD operations across your AdminGen resources.

Hooks can be synchronous or asynchronous. Any errors thrown within a hook are cleanly propagated as HTTP errors back to the client.

---

## Hook Lifecycle Overview

| Hook | Timing | Purpose | Return Value |
| :--- | :--- | :--- | :--- |
| **`beforeChange`** | Before DB `insert` or `update` | Sanitize, format, or validate data before write | Returns transformed record object `T` |
| **`afterChange`** | After DB `insert` or `update` | Invalidate caches, dispatch webhooks, audit | `void` |
| **`beforeDelete`** | Before DB `delete` | Guard records, enforce business rules | `boolean` (return `false` to abort) |
| **`afterDelete`** | After DB `delete` | Cleanup external assets, audit logs | `void` |

---

## Configuration

Configure hooks per-resource inside `createDrizzleAdapter`:

```ts
import { createDrizzleAdapter } from '@sorvien/admingen-adapter-drizzle';
import * as schema from './schema';

export const adapterResult = createDrizzleAdapter({
  schema,
  config: {
    resources: [
      {
        slug: 'users',
        hooks: {
          // 1. Intercept & format data before create or update
          beforeChange: async ({ data, operation, id }) => {
            return {
              ...data,
              email: data.email?.trim().toLowerCase(),
            };
          },

          // 2. React after database persistence succeeds
          afterChange: async ({ record, operation, id }) => {
            if (operation === 'update') {
              await redis.del(`user:cache:${id}`);
            }
          },

          // 3. Prevent deletion of protected records
          beforeDelete: async ({ id }) => {
            const SYSTEM_ADMIN_ID = 1;
            // Return false to cancel deletion
            return id !== SYSTEM_ADMIN_ID;
          },

          // 4. Audit trail logging after deletion
          afterDelete: async ({ id }) => {
            await auditLogger.log({
              action: 'user.deleted',
              recordId: id,
              timestamp: new Date(),
            });
          },
        },
      },
    ],
  },
});
```

---

## Hook Signatures & Context

### `beforeChange`
Invoked immediately before a record is created or updated.

```ts
beforeChange?: (ctx: {
  data: T;
  operation: 'create' | 'update';
  id?: string | number;
}) => Promise<T> | T;
```

> [!TIP] Security Boundary
> AdminGen automatically re-verifies the returned object against your resource schema, preventing `beforeChange` from accidentally injecting unmapped database columns or invalid properties.

### `afterChange`
Invoked immediately after database writes succeed and returns the persisted record.

```ts
afterChange?: (ctx: {
  record: T;
  operation: 'create' | 'update';
  id?: string | number;
}) => Promise<void> | void;
```

### `beforeDelete`
Invoked before deleting a row. Return `false` to safely abort the deletion and preserve the row.

```ts
beforeDelete?: (ctx: {
  id: string | number;
}) => Promise<void | boolean> | void | boolean;
```

### `afterDelete`
Invoked only when a row was actually removed from the database.

```ts
afterDelete?: (ctx: {
  id: string | number;
}) => Promise<void> | void;
```

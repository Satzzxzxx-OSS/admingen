# Schema Configuration & API Reference

This page documents the type mapping and configuration options available in AdminGen.

---

## AdminGen Options

Passed to `AdminGen(options)`:

```ts
export interface AdminGenOptions {
  /** The adapter result produced by createDrizzleAdapter */
  adapterResult: AdapterResult;

  /** Route prefix where AdminGen is mounted. Defaults to '/admin' */
  adminPath?: string;

  /** Optional auth provider to verify user sessions */
  authProvider?: AuthProvider;

  /** Elysia beforeHandle hook for custom request filtering */
  beforeHandle?: (context: any) => any;

  /** Enable verbose diagnostic logs */
  debug?: boolean;
}
```

---

## Field Type Mapping

When `createDrizzleAdapter({ schema })` runs, it introspects your Drizzle tables and maps column data types to AdminGen field types:

| Drizzle Column Type | AdminGen Field Type | Rendered Component |
| :--- | :--- | :--- |
| `text()`, `varchar()`, `char()` | `text` | Text Input |
| Multi-line `text()` | `textarea` | Resizable Textarea |
| `integer()`, `serial()`, `real()`, `numeric()` | `number` | Numeric Input with step controls |
| `boolean()` | `boolean` | Switch / Toggle Badge |
| `timestamp()`, `date()` | `date` | Date Picker & Relative Timestamp |
| `json()`, `jsonb()` | `json` | Interactive JSON syntax editor |
| `references(() => otherTable.id)` | `relationship` | Dynamic Searchable Select Dropdown |
| Enum fields with predefined values | `select` | Dropdown Select |

---

## Overrides & Customization

You can customize individual field behaviors, labels, and lifecycle hooks by providing custom config overrides to `createDrizzleAdapter`:

```ts
const adapterResult = createDrizzleAdapter({
  schema,
  config: {
    resources: [
      {
        slug: 'users',
        label: 'App Members',
        hooks: {
          beforeChange: async ({ data, operation, id }) => {
            return { ...data, email: data.email?.toLowerCase() };
          },
          afterChange: async ({ record, operation, id }) => {
            console.log(`User ${operation}d:`, record.id);
          },
          beforeDelete: async ({ id }) => {
            return id !== 1; // cancel if ID is 1
          },
          afterDelete: async ({ id }) => {
            console.log(`User deleted:`, id);
          },
        },
      },
    ],
  },
});
```

For full details, see the [Lifecycle Hooks Guide](/guide/hooks).

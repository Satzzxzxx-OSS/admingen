# Authentication & Access Control

AdminGen features a pluggable authentication architecture. By default, it operates in **zero-config mode** (auth disabled for development). In production, you can connect your existing auth system in a few lines of code.

---

## The AuthProvider Interface

To secure your admin panel, provide an `authProvider` to `AdminGen()`:

```ts
import type { AuthProvider, AuthUser } from '@sorvien/admingen';

const authProvider: AuthProvider = {
  async authenticate(ctx) {
    // 1. Verify session cookie, JWT, or token from ctx
    // 2. Return AuthUser if valid, or null if unauthenticated
    return {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
    };
  },
};
```

When `authProvider` returns `null`:
- Direct API calls (`/admin/api/*`) are rejected with `401 Unauthorized`.
- The UI redirects the user to the login screen.

---

## Recipe 1: Cookie-Based Authentication

Here is a complete login & logout setup using standard HTTP-only cookies:

```ts
import { Elysia } from 'elysia';
import { AdminGen } from '@sorvien/admingen';

const authProvider = {
  authenticate: async (ctx: any) => {
    const token = ctx.cookie?.admin_session?.value || ctx.cookie?.admin_session;
    if (token === 'valid_secret_session_token') {
      return { id: 1, name: 'Admin', email: 'admin@example.com' };
    }
    return null;
  },
};

const app = new Elysia()
  // Login Endpoint
  .post('/admin/api/_auth/login', ({ body, cookie, set }: any) => {
    const { email, password } = body || {};
    if (email === 'admin@example.com' && password === 'supersecret') {
      cookie.admin_session.set({
        value: 'valid_secret_session_token',
        httpOnly: true,
        path: '/',
      });
      return { success: true };
    }
    set.status = 401;
    return 'Invalid credentials';
  })
  // Logout Endpoint
  .post('/admin/api/_auth/logout', ({ cookie }: any) => {
    cookie.admin_session.remove();
    return { success: true };
  })
  // Mount AdminGen
  .use(AdminGen({
    adapterResult,
    authProvider,
  }));
```

---

## Recipe 2: Better-Auth Integration

If you use [Better-Auth](https://better-auth.com), integrate it directly:

```ts
import { auth } from './auth'; // Your Better-Auth instance

const authProvider = {
  authenticate: async (ctx: any) => {
    const session = await auth.api.getSession({
      headers: ctx.headers,
    });

    if (session?.user && session.user.role === 'admin') {
      return {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      };
    }

    return null;
  },
};
```

import { Elysia } from 'elysia';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import { cors } from '@elysiajs/cors';
import { AdminGen } from '@sorvien/admingen';
import { createDrizzleAdapter } from '@sorvien/admingen-adapter-drizzle';
import * as schema from './schema';
import { runSeed } from './seed';

// 1. Initialize SQLite Database
const sqlite = new Database('sqlite.db');
runSeed(sqlite);
const db = drizzle(sqlite, { schema });

// 2. Demo Auth Provider
const authProvider = {
  authenticate: async (ctx: any) => {
    const token = ctx.cookie?.auth?.value || ctx.cookie?.auth;
    if (token === 'admin_token') {
      return { id: 1, name: 'Admin User', email: 'admin@example.com' };
    }
    return null;
  },
};

// 3. Mount AdminGen on Elysia
const app = new Elysia()
  .use(cors())
  .decorate('db', db)
  .get('/', ({ set }: any) => {
    set.redirect = '/admin';
  })
  .post('/admin/api/_auth/login', ({ body, cookie, set }: any) => {
    const { email, password } = body || {};
    if ((email === 'admin' || email === 'admin@example.com') && (password === 'admin' || password === 'admin123')) {
      cookie.auth.set({
        value: 'admin_token',
        httpOnly: true,
        path: '/',
      });
      return { success: true };
    }
    set.status = 401;
    return 'Invalid credentials. Use admin / admin';
  })
  .post('/admin/api/_auth/logout', ({ cookie }: any) => {
    cookie.auth.remove();
    return { success: true };
  })
  .use(AdminGen({
    adapterResult: createDrizzleAdapter({ schema }),
    authProvider,
  }))
  .listen(3000);

console.log(`
┌─────────────────────────────────────────────────────────────┐
│ ⚡ AdminGen Server Live                                      │
│                                                             │
│ ➜ Admin Panel: http://localhost:3000/admin                   │
│ ➜ Demo Login:  admin / admin                                │
└─────────────────────────────────────────────────────────────┘
`);

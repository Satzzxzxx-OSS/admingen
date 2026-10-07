import { Database } from 'bun:sqlite';

export function runSeed(sqlite: Database) {
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT DEFAULT 'member',
      team_id INTEGER REFERENCES teams(id)
    );
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      author_id INTEGER REFERENCES users(id)
    );
  `);

  const countRow = sqlite.query('SELECT count(*) as count FROM users').get() as { count: number };
  if (!countRow || countRow.count === 0) {
    sqlite.run(`
      INSERT INTO teams (name) VALUES ('Core Engineering'), ('Product & Design'), ('Operations');
      INSERT INTO users (name, email, role, team_id) VALUES 
        ('Alice Johnson', 'alice@example.com', 'admin', 1),
        ('Bob Smith', 'bob@example.com', 'member', 2),
        ('Charlie Brown', 'charlie@example.com', 'guest', 3);
      INSERT INTO posts (title, content, author_id) VALUES 
        ('Welcome to AdminGen', 'This is an instant, ultra-fast admin panel powered by Elysia and Drizzle.', 1),
        ('Sub-40MB Memory', 'Running with sub-millisecond responses on Bun runtime.', 2),
        ('Interactive Data Tables', 'Dynamic tables with server-side pagination, sorting, and filtering.', 3);
    `);
  }
}

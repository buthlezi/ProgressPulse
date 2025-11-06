import * as SQLite from 'expo-sqlite';

const DB_NAME = 'progresspulse.db';
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDb() {
  if (!dbPromise) dbPromise = SQLite.openDatabaseAsync(DB_NAME);
  return dbPromise;
}

export async function run(sql: string, ...params: any[]) {
  const db = await getDb();
  await db.runAsync(sql, ...params);
}

export async function all<T = any>(sql: string, ...params: any[]): Promise<T[]> {
  const db = await getDb();
  return (await db.getAllAsync(sql, ...params)) as T[];
}

export async function initDb() {
  const db = await getDb();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS entries (
      id TEXT PRIMARY KEY NOT NULL,
      text TEXT NOT NULL,
      date TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      deletedAt TEXT,
      isDirty INTEGER NOT NULL
    );
  `);
}

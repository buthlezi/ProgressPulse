// lib/entries.ts
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import { all, run } from './db';

export type Entry = {
  id: string;
  text: string;
  date: string; // YYYY-MM-DD
  createdAt: string; // ISO
  updatedAt: string; // ISO
  deletedAt?: string | null;
  isDirty: 0 | 1;
};

const nowISO = () => new Date().toISOString();

export async function addEntry(text: string, dateISO: string) {
  const id = uuid();
  const ts = nowISO();
  await run(
    `INSERT INTO entries (id, text, date, createdAt, updatedAt, deletedAt, isDirty)
     VALUES (?, ?, ?, ?, ?, NULL, 1);`,
    [id, text, dateISO, ts, ts],
  );
  return id;
}

export async function listEntries(): Promise<Entry[]> {
  return all<Entry>(
    `SELECT * FROM entries
     WHERE deletedAt IS NULL
     ORDER BY date DESC, createdAt DESC;`,
  );
}

export async function updateEntry(id: string, text: string) {
  const ts = nowISO();
  await run(`UPDATE entries SET text = ?, updatedAt = ?, isDirty = 1 WHERE id = ?;`, [
    text,
    ts,
    id,
  ]);
}

export async function softDeleteEntry(id: string) {
  const ts = nowISO();
  await run(`UPDATE entries SET deletedAt = ?, updatedAt = ?, isDirty = 1 WHERE id = ?;`, [
    ts,
    ts,
    id,
  ]);
}

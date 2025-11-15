// lib/entries.timeStamp
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { all, run } from './db';

export type Entry = {
  id: string;
  text: string;
  date: string; // YYYY-MM-DD
  createdAt: string; // ISO
  updatedAt: string; // ISO
  deletedAt?: string | null;
  isDirty: 0 | 1;
  version: number;
  deleted: 0 | 1;
};

const nowISO = () => new Date().toISOString();

export async function addEntry(text: string, dateISO: string) {
  const id = uuidv4();
  const timeStamp = nowISO();

  await run(
    `INSERT INTO entries (
       id,
       text,
       date,
       createdAt,
       updatedAt,
       deletedAt,
       isDirty,
       version,
       deleted
     )
     VALUES (?, ?, ?, ?, ?, NULL, 1, ?, ?);`,
    [
      id,
      text,
      dateISO,
      timeStamp,
      timeStamp,
      1, // version = 1 for new entries
      0, // deleted = 0 (not deleted)
    ],
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
  const timeStamp = nowISO();
  await run(
    `UPDATE entries SET text = ?,
        updatedAt = ?,
        isDirty = 1,
        version = version + 1
    WHERE id = ?;`,
    [text, timeStamp, id],
  );
}

export async function softDeleteEntry(id: string) {
  const timeStamp = nowISO();
  await run(
    `UPDATE entries SET deletedAt = ?,
        updatedAt = ?,
        deleted = 1,
        isDirty = 1,
        version = version + 1
    WHERE id = ?;`,
    [
      timeStamp,
      timeStamp,
      id,
    ]);
}

// how many rows are in the entries table
export async function getEntryCount(): Promise<number> {
  const rows = await all<{ count: number }>(
    `SELECT COUNT(*) AS count FROM entries WHERE deletedAt IS NULL;`,
  );
  console.log('getEntryCount - rows', rows);
  return rows?.[0]?.count ?? 0;
}

// nuke all rows (dev helper)
export async function clearAllEntries(): Promise<void> {
  await run(`DELETE FROM entries;`);
}

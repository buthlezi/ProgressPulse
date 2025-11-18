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

// what is sent to the backend for each dirty entry
export type EntrySyncPayload = {
  id: string;
  text: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  deletedAt: string | null;
  version: number; // meaning: "my view of the row’s version"
}

// What the backend sends back for each updated entry

export type SyncChangePayload = EntrySyncPayload;   // client → server
export type SyncUpdatePayload = EntrySyncPayload;   // server → client canonical version

export type SyncRequest = {
  lastSyncAt: string | null;
  changes: SyncChangePayload[];
}

export type SyncResponse = {
  newLastSyncAt: string;
  updates: SyncUpdatePayload[];
}

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

const SYNC_META_ID = 'entries';

async function ensureSyncMetaTable() {
  await run(
    `CREATE TABLE IF NOT EXISTS sync_meta (
      id TEXT PRIMARY KEY NOT NULL,
      lastSyncAt TEXT
    );`,
  );
}

async function getLastSyncAt(): Promise<string | null> {
  await ensureSyncMetaTable();
  const rows = await all<{ lastSyncAt: string | null }>(
    `SELECT lastSyncAt FROM sync_meta WHERE id = ?;`,
    [SYNC_META_ID],
  );
  if (!rows || rows.length === 0) {
    return null;
  };
  return rows[0]?.lastSyncAt ?? null;
}

async function setLastSyncAt(lastSyncAt: string): Promise<void> {
  await ensureSyncMetaTable();
  await run(
    `INSERT INTO sync_meta (id, lastSyncAt)
     VALUES (?, ?)
     ON CONFLICT(id) DO UPDATE SET lastSyncAt = excluded.lastSyncAt;
     `,
    [SYNC_META_ID, lastSyncAt],
  );
}

async function getDirtyEntries(): Promise<Entry[]> {
  const rows = await all<Entry>(
    `SELECT * FROM entries
     WHERE isDirty = 1;`,
  );

  return rows ?? [];
}

async function upsertEntryFromServer(update: SyncUpdatePayload) {
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
     VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       text = excluded.text,
       date = excluded.date,
       createdAt = excluded.createdAt,
       updatedAt = excluded.updatedAt,
       deletedAt = excluded.deletedAt,
       isDirty = 0,
       version = excluded.version,
       deleted = excluded.deleted;
       `,
    [
      update.id,
      update.text,
      update.date,
      update.createdAt,
      update.updatedAt,
      update.deletedAt ? update.deletedAt : null,
      update.version,
      update.deleted,
    ],
  );

  // Optional: if you prefer to hard-delete locally when server says deleted:
  // if (update.deleted) {
  //   await run(`DELETE FROM entries WHERE id = ?;`, [update.id]);
  // }

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

// TODO: replace with your real API base URL or import from config
const SYNC_API_URL = 'https://your-api.example.com/sync';

async function callSyncApi(body: SyncRequest): Promise<SyncResponse> {
  // Add auth headers here if needed (e.g. Authorization: Bearer <token>)
  const res = await fetch(SYNC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Sync API failed (${res.status}): ${text}`);
  }

  const json = (await res.json()) as SyncResponse;
  return json;
}

export async function syncEntries(): Promise<void> {
  // 1) Read lastSyncAt and dirty entries
  const lastSyncAt = await getLastSyncAt();
  const dirtyEntries = await getDirtyEntries();

  const changes: SyncChangePayload[] = dirtyEntries.map((entry) => ({
    id: entry.id,
    text: entry.text,
    date: entry.date,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
    deleted: entry.deleted === 1,
    deletedAt: entry.deletedAt ?? null,
    version: entry.version,
  }));

  // 2) Call backend
  const response = await callSyncApi({
    lastSyncAt,
    changes,
  });

  // 3) Apply udates and update meta in a transaction-ish way
  // it the run/all helper supports transactions, we can wrap this
  for (const update of response.updates) {
    await upsertEntryFromServer(update);
  }

  // 4) Clear dirty flags for any remaining entries
  await run(
    `UPDATE entries SET isDirty = 0
     WHERE isDirty = 1;`,
  );

  // 5) Update lastSyncAt
  await setLastSyncAt(response.newLastSyncAt);
}

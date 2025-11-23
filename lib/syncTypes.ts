// what is sent to the backend for each dirty entry
type EntrySyncPayload = {
  id: string;
  text: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  deletedAt: string | null;
  version: number; // meaning: "my view of the row’s version"
};

// What the backend sends back for each updated entry

export type SyncChangePayload = EntrySyncPayload; // client → server
export type SyncUpdatePayload = EntrySyncPayload; // server → client canonical version

export type SyncRequest = {
  lastSyncAt: string | null; // ISO timeStamp of last successful sync
  changes: SyncChangePayload[]; // dirty entries from client
};

export type SyncResponse = {
  newLastSyncAt: string; // ISO timeStamp to store in the client
  updates: SyncUpdatePayload[]; // server-side truth of updated entries
};

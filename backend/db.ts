import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { SyncChangePayload, SyncUpdatePayload } from '../lib/syncTypes';

const TABLE_NAME = process.env.ENTRIES_TABLE ?? 'ProgressPulseEntries';
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

type EntryItem = {
  id: string;
  text: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  deletedAt: string | null;
  version: number;
};

// --- Apply client changes (very simple last-write-wins for now) ---

export async function applyClientChanges(changes: SyncChangePayload[]): Promise<void> {
  const now = new Date().toISOString();

  for (const change of changes) {
    const item: EntryItem = {
      id: change.id,
      text: change.text,
      date: change.date,
      createdAt: change.createdAt,
      // server decides updatedAt (so it’s monotonic on the backend)
      updatedAt: now,
      deleted: change.deleted,
      deletedAt: change.deleted ? change.deletedAt ?? now : null,
      // for MVP, just trust the client’s version
      // (later we can bump / enforce optimistic concurrency)
      version: change.version,
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      }),
    );
  }
}

// --- Read entries changed since lastSyncAt ---

export async function getEntriesChangedSince(
  lastSyncAt: string | null,
): Promise<SyncUpdatePayload[]> {
  // MVP: Scan + filter. Fine for a single-user journal.
  // Later we can add a GSI on updatedAt.
  const params: any = {
    TableName: TABLE_NAME,
  };

  if (lastSyncAt) {
    params.FilterExpression = 'updatedAt > :lastSyncAt';
    params.ExpressionAttributeValues = {
      ':lastSyncAt': lastSyncAt,
    };
  }

  const result = await docClient.send(new ScanCommand(params));
  const items = (result.Items ?? []) as EntryItem[];

  return items.map<SyncUpdatePayload>((item) => ({
    id: item.id,
    text: item.text,
    date: item.date,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    deleted: item.deleted,
    deletedAt: item.deletedAt ?? null,
    version: item.version,
  }));
}

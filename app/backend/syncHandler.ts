import { SyncRequest, SyncResponse, SyncUpdatePayload } from "@/lib/syncTypes";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";

// TODO: implement these with your real DB
async function applyClientChanges(_changes: SyncRequest['changes']): Promise<void> {
  // For each change:
  // - If deleted: mark as deleted / soft delete in DB
  // - Else: upsert entry & bump version / updatedAt
}

async function getEntriesChangedSince(_lastSyncAt: string | null): Promise<SyncUpdatePayload[]> {
  // Query DB for entries where updatedAt > lastSyncAt
  // and map to SyncUpdatePayload[]
  return [];
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing body' }),
      };
    }

    const parsed = JSON.parse(event.body) as SyncRequest;

    const { lastSyncAt, changes } = parsed;

    // 1) Apply client changes to the server DB
    await applyClientChanges(changes);

    // 2) Load all entries changed since lastSyncAt
    const updates = await getEntriesChangedSince(lastSyncAt);

    // 3)  Compute newLastSyncAt as current server time
    const newLastSyncAt = new Date().toISOString();

    const response: SyncResponse = {
      newLastSyncAt,
      updates,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(response),
      headers: {
        'Content-Type': 'application/json',
      },
    };

  } catch (error) {
    console.error('[sync] Error in handler', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};

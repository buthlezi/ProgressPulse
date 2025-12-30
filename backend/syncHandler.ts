import { SyncRequest, SyncResponse } from '../lib/syncTypes';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { applyClientChanges, getEntriesChangedSince } from './db';
import { requireUser } from './auth';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  // Handle preflight CORS request
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: 'Missing body' }),
      };
    }

    const parsed = JSON.parse(event.body) as SyncRequest;

    const { lastSyncAt, changes } = parsed;
    const { userId } = await requireUser(event);

    // 1) Apply client changes to the server DB
    await applyClientChanges(userId, changes);

    // 2) Load server updates since lastSyncAt
    const updates = await getEntriesChangedSince(userId, lastSyncAt);

    // 3)  Compute newLastSyncAt as current server time
    const newLastSyncAt = new Date().toISOString();

    const response: SyncResponse = {
      newLastSyncAt,
      updates,
    };

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(response),
    };
  } catch (error: any) {
    console.error('[sync] Error in handler', error);

    const statusCode = error?.statusCode ?? 500;

    return {
      statusCode,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        message: statusCode === 401 ? 'Unauthorized' : 'Internal server error',
      }),
    };
  }
};

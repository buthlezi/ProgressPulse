import { SyncRequest, SyncResponse } from '../lib/syncTypes';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { applyClientChanges, getEntriesChangedSince } from './db';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Progresspulse-Secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const SECRET_HEADER = 'x-progresspulse-secret';

const unauthorized = () => {
  return {
    statusCode: 401,
    body: JSON.stringify({ message: 'Unauthorized' }),
    headers: CORS_HEADERS,
  };
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

  const expected = process.env.SYNC_SECRET;
  const provided = event.headers?.[SECRET_HEADER] ?? event.headers?.[SECRET_HEADER.toLowerCase()];

  if (!expected) {
    console.error('[sync] SYNC_SECRET is not set');
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: 'Server misconfiguration' }),
    };
  }

  if (provided !== expected) {
    return unauthorized();
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

    const { userId, lastSyncAt, changes } = parsed;

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
  } catch (error) {
    console.error('[sync] Error in handler', error);

    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

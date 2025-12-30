import { createRemoteJWKSet, jwtVerify } from 'jose';

const REGION = 'eu-west-1';
const USER_POOL_ID = 'eu-west-1_QXx8z3uxF';
const CLIENT_ID = '41th1hn5fqt9cve32ilr8k4ots';

const ISSUER = `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`;
const JWKS = createRemoteJWKSet(new URL(`${ISSUER}/.well-known/jwks.json`));

export async function requireUser(event: any) {
  const raw =
    event.headers?.authorization ?? event.headers?.Authorization ?? event.headers?.AUTHORIZATION;

  if (!raw || !raw.startsWith('Bearer ')) {
    const err: any = new Error('Missing or invalid Authorization header');
    err.statusCode = 401;
    throw err;
  }

  const token = raw.slice('Bearer '.length).trim();

  const { payload } = await jwtVerify(token, JWKS, {
    issuer: ISSUER,
    audience: CLIENT_ID,
  });

  return { userId: payload.sub as string, claims: payload };
}

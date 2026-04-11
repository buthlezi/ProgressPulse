// // lib/auth.ts
// import { fetchAuthSession, signOut as amplifySignOut } from 'aws-amplify/auth';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import * as SecureStore from 'expo-secure-store';

const client = new CognitoIdentityProviderClient({ region: 'eu-west-1' });

export async function login(email: string, password: string) {
  try {
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: '41th1hn5fqt9cve32ilr8k4ots',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });
    const response = await client.send(command);
    // console.log("LOGIN_OK", response.AuthenticationResult);

    await SecureStore.setItemAsync('accessToken', response.AuthenticationResult?.AccessToken ?? '');
    await SecureStore.setItemAsync('idToken', response.AuthenticationResult?.IdToken ?? '');
    await SecureStore.setItemAsync(
      'refreshToken',
      response.AuthenticationResult?.RefreshToken ?? '',
    );

    const user = {
      // email,
      id: response.AuthenticationResult?.IdToken
        ? JSON.parse(atob(response.AuthenticationResult.IdToken.split('.')[1])).sub
        : null,
      email: response.AuthenticationResult?.IdToken
        ? JSON.parse(atob(response.AuthenticationResult.IdToken.split('.')[1])).email
        : null,
      verified: response.AuthenticationResult?.IdToken
        ? JSON.parse(atob(response.AuthenticationResult.IdToken.split('.')[1])).email_verified
        : null,
    };

    console.log('USER', user);
    return { response, user };
  } catch (error: any) {
    console.log('LOGIN_ERROR_RAW', error);
    console.log('LOGIN_ERROR_NAME', error?.name);
    console.log('LOGIN_ERROR_MESSAGE', error?.message);
    console.log('LOGIN_ERROR_CAUSE', error?.cause);
    console.log('LOGIN_ERROR_STACK', error?.stack);
    throw error;
  }
}

export async function logout() {
  try {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('idToken');
    await SecureStore.deleteItemAsync('refreshToken');
  } catch (error) {
    console.warn('Logout failed', error);
  }
}

export async function getAccessToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync('accessToken');
  } catch (error) {
    console.warn('[auth] getAccessToken failed', error);
    return null;
  }
}

export async function getIdToken() {
  try {
    return await SecureStore.getItemAsync('idToken');
  } catch (error) {
    console.warn('[auth] getIdToken failed', error);
    return null;
  }
}

export async function restoreSession() {
  try {
    const idToken = await getIdToken();
    if (idToken) {
      const payload = JSON.parse(atob(idToken.split('.')[1]));
      const user = {
        id: payload.sub,
        email: payload.email,
        verified: payload.email_verified,
      };
      console.log('RESTORE_SESSION_USER', user);
      return user;
    } else {
      console.log('RESTORE_SESSION_NO_TOKEN');
      return null;
    }
  } catch (error) {
    console.warn('Restore session failed', error);
    return null;
  }
}

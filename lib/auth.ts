// lib/auth.ts
import { fetchAuthSession, signOut as amplifySignOut } from 'aws-amplify/auth';
import {CognitoIdentityProviderClient, InitiateAuthCommand} from '@aws-sdk/client-cognito-identity-provider';
import * as SecureStore from 'expo-secure-store';

const client = new CognitoIdentityProviderClient({region: 'eu-west-1'});

export async function login(email: string, password: string) {

  try {
    const command = new InitiateAuthCommand({
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: "41th1hn5fqt9cve32ilr8k4ots",
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password
            }
        })
        const response = await client.send(command)
        console.log("LOGIN_OK", response.AuthenticationResult);

        await SecureStore.setItemAsync('accessToken', response.AuthenticationResult?.AccessToken ?? '');
        await SecureStore.setItemAsync('idToken', response.AuthenticationResult?.IdToken ?? '');
        await SecureStore.setItemAsync('refreshToken', response.AuthenticationResult?.RefreshToken ?? '');
        return response.AuthenticationResult;
      }
    catch (error: any) { 
    console.log("LOGIN_ERROR_RAW", error);     
    console.log("LOGIN_ERROR_NAME", error?.name);
    console.log("LOGIN_ERROR_MESSAGE", error?.message);
    console.log("LOGIN_ERROR_CAUSE", error?.cause);
    console.log("LOGIN_ERROR_STACK", error?.stack);
    throw error;
  }
}

export async function logout() {
  await amplifySignOut();
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
  const session = await fetchAuthSession();
  return session.tokens?.idToken?.toString() ?? null;
}

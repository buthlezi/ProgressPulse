// lib/amplify.ts
import { Amplify } from "aws-amplify";
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultStorage } from 'aws-amplify/utils'

// v6 requirement: explicit storage for React Native
// Using a robust wrapper to ensure compatibility with Amplify's KeyValueStorage interface
// const localStorage = {
//   setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
//   getItem: (key: string) => AsyncStorage.getItem(key),
//   removeItem: (key: string) => AsyncStorage.removeItem(key),
//   clear: () => AsyncStorage.clear(),
// };

cognitoUserPoolsTokenProvider.setKeyValueStorage(defaultStorage);

let configured = false;

export function ensureAmplifyConfigured() {
  if (configured) return;
  try {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: "eu-west-1_QXx8z3uxF",
          userPoolClientId: "41th1hn5fqt9cve32ilr8k4ots",
          loginWith: {
            email: true
          }
        },
      },
    });
    console.log("AMPLIFY_CONFIG", Amplify.getConfig());

    configured = true;
    console.log("AMPLIFY_CONFIG_SUCCESS");
  } catch (error) {
    console.error("AMPLIFY_CONFIG_ERROR", error);
  }
};



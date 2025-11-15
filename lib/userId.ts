// lib/userId.ts
import * as SecureStore from 'expo-secure-store';

// MUST come before importing uuid in React Native/Expo:
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const KEY = 'pp_user_id';

export async function getOrCreateUserId(): Promise<string> {
  let id = await SecureStore.getItemAsync(KEY);
  if (!id) {
    id = uuidv4();
    await SecureStore.setItemAsync(KEY, id);
  }
  return id;
}

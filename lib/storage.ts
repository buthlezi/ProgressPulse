// lib/storage.ts
import { Platform } from 'react-native';

type Getter = (key: string) => Promise<string | null>;
type Setter = (key: string, value: string) => Promise<void>;
type Remover = (key: string) => Promise<void>;

let getItemAsync: Getter;
let setItemAsync: Setter;
let removeItemAsync: Remover;

if (Platform.OS === 'web') {
  getItemAsync = async (key) =>
    typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  setItemAsync = async (key, value) => {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
  };
  removeItemAsync = async (key) => {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
  };
} else {
  // Lazy-load to avoid bundlers trying to resolve the native module on web
  let SecureStore: any;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    SecureStore = require('expo-secure-store');
  } catch {
    SecureStore = null;
  }

  if (SecureStore?.getItemAsync) {
    console.log('[storage] backend = expo-secure-store');
    getItemAsync = (key) => SecureStore.getItemAsync(key);
    setItemAsync = (key, value) => SecureStore.setItemAsync(key, value);
    removeItemAsync = (key) => SecureStore.deleteItemAsync(key);
  } else {
    // Soft fallback to avoid crashes if the module isn’t available
    console.warn('[storage] expo-secure-store unavailable; using memory fallback.');
    const mem = new Map<string, string>();
    getItemAsync = async (key) => (mem.has(key) ? mem.get(key)! : null);
    setItemAsync = async (key, value) => {
      mem.set(key, value);
    };
    removeItemAsync = async (key) => {
      mem.delete(key);
    };
  }
}

export const storage = { getItemAsync, setItemAsync, removeItemAsync };

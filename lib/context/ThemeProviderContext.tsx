import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { THEMES, ThemeName } from '../themes';
// import * as SecureStore from 'expo-secure-store';
import { storage } from '../../lib/storage';

const STORAGE_KEY = 'pp.theme.v1';

type Theme = {
  theme: ThemeName;
  setThemeName: (theme: ThemeName) => void;
  colors: (typeof THEMES)[ThemeName];
  isReady: boolean;
};

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProviderContext({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('Indigo Pop');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const storedTheme = await storage.getItemAsync(STORAGE_KEY);
        if (storedTheme && storedTheme in THEMES) {
          setThemeName(storedTheme as ThemeName);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (isReady) {
      storage.setItemAsync(STORAGE_KEY, themeName).catch((error) => console.log(error));
    }
  }, [themeName, isReady]);

  const colors = useMemo(() => THEMES[themeName], [themeName]);
  const value = useMemo(
    () => ({
      theme: themeName,
      setThemeName,
      colors,
      isReady,
    }),
    [themeName, colors, isReady],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Convenience hook if you only need colors
export function useThemeColors() {
  return useTheme().colors;
}

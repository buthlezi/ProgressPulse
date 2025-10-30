import React, { createContext, useContext, useMemo, useState } from 'react';
import { THEMES, ThemeName } from '../themes';

type Theme = {
  theme: ThemeName;
  setThemeName: (theme: ThemeName) => void;
  colors: (typeof THEMES)[ThemeName];
};

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('Indigo Pop');
  const colors = useMemo(() => THEMES[themeName], [themeName]);
  const value = useMemo(
    () => ({
      theme: themeName,
      setThemeName,
      colors,
    }),
    [themeName, colors],
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

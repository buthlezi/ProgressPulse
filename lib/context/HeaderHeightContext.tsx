import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type HeaderHeight = {
  headerHeight: number;
  setHeaderHeight: (height: number) => void;
};

const headerHeightContext = createContext<HeaderHeight | null>(null);

export function HeaderHeightProvider({ children }: { children: ReactNode }) {
  const [headerHeight, setHeaderHeight] = useState(56);
  const value = useMemo(
    () => ({
      headerHeight,
      setHeaderHeight,
    }),
    [headerHeight],
  );
  return <headerHeightContext.Provider value={value}>{children}</headerHeightContext.Provider>;
}

export function useHeaderHeight() {
  const context = useContext(headerHeightContext);
  if (!context) throw new Error('useHeaderHeight must be used within a HeaderHeightProvider');
  return context;
}

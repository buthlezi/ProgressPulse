import {createContext, useContext, useMemo, useState, ReactNode} from "react";

type Drawer = {
  open: boolean;
  toggle: () => void;
  close: () => void
};

const drawerContext = createContext<Drawer | null>(null);

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({
    open,
    toggle: () => setOpen(v => !v),
    close: () => setOpen(false),
  }), [open]);
  return <drawerContext.Provider value={value}>{children}</drawerContext.Provider>;
}

export function useDrawer() {
  const context = useContext(drawerContext);
  if (!context) throw new Error("useDrawer must be used within a DrawerProvider");
  return context;
}

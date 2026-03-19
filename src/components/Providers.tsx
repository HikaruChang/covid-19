'use client';

import { ReactNode, useState, useMemo, createContext, useContext } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '@/lib/theme';

interface AppContextValue {
  loading: boolean;
  setLoading: (v: boolean) => void;
  error: string | null;
  setError: (v: string | null) => void;
}

const AppContext = createContext<AppContextValue>({
  loading: false,
  setLoading: () => { },
  error: null,
  setError: () => { },
});

export function useAppContext() {
  return useContext(AppContext);
}

export default function Providers({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const value = useMemo(
    () => ({ loading, setLoading, error, setError }),
    [loading, error]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContext.Provider value={value}>{children}</AppContext.Provider>
    </ThemeProvider>
  );
}

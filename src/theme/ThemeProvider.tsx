import { colorScheme } from 'nativewind';
import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';

import { useSessionStore } from '@/store/session';

import { themes, type Theme, type ThemeName } from './tokens';

type ThemeContextValue = {
  theme: Theme;
  name: ThemeName;
  isDark: boolean;
  setTheme: (name: ThemeName) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Owns the app's theme.
 *
 * The user picks it explicitly and it persists — the OS colour scheme is
 * never read (PORTING_PLAN.md §8.8). NativeWind is kept in step so utility
 * classes and StyleSheet values always agree on which theme is active.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const name = useSessionStore((s) => s.theme);
  const setTheme = useSessionStore((s) => s.setTheme);
  const toggleTheme = useSessionStore((s) => s.toggleTheme);

  useEffect(() => {
    colorScheme.set(name);
  }, [name]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: themes[name],
      name,
      isDark: name === 'dark',
      setTheme,
      toggleTheme,
    }),
    [name, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}

/** Shorthand for the common case of only needing the token tree. */
export function useTokens(): Theme {
  return useTheme().theme;
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ThemeName } from '@/theme/tokens';

/**
 * Session preferences that outlive a single screen.
 *
 * Both of the persisted values are deliberate:
 *
 *  - `theme` is user-owned, not system-derived (PORTING_PLAN.md §8.8). The OS
 *    colour scheme is never consulted.
 *  - `balanceHidden` survives a restart (§8.12). This differs from the source
 *    design system, which documents masking as session-only; the product
 *    ruling overrides it.
 *
 * Masking is global rather than per screen: hiding on Home hides on Wallets
 * too, which is why it lives here and not in either screen.
 */
type SessionState = {
  theme: ThemeName;
  balanceHidden: boolean;
  /** Whether the user has enabled biometric confirmation (§8.13). */
  biometricsEnabled: boolean;
  /** False until persisted state has been read back from disk. */
  hasHydrated: boolean;

  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
  setBalanceHidden: (hidden: boolean) => void;
  toggleBalanceHidden: () => void;
  setBiometricsEnabled: (enabled: boolean) => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      // The app is a light, white-paper surface by default.
      theme: 'light',
      balanceHidden: false,
      biometricsEnabled: false,
      hasHydrated: false,

      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setBalanceHidden: (balanceHidden) => set({ balanceHidden }),
      toggleBalanceHidden: () => set((s) => ({ balanceHidden: !s.balanceHidden })),
      setBiometricsEnabled: (biometricsEnabled) => set({ biometricsEnabled }),
    }),
    {
      name: 'nippyy.session',
      storage: createJSONStorage(() => AsyncStorage),
      // `hasHydrated` is runtime-only and must never be written to disk.
      partialize: (s) => ({
        theme: s.theme,
        balanceHidden: s.balanceHidden,
        biometricsEnabled: s.biometricsEnabled,
      }),
      onRehydrateStorage: () => () => {
        useSessionStore.setState({ hasHydrated: true });
      },
    }
  )
);

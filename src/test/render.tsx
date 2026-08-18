import { render, type RenderOptions } from '@testing-library/react-native';
import type { ReactElement, ReactNode } from 'react';
import { SafeAreaProvider, type Metrics } from 'react-native-safe-area-context';

import { useSessionStore } from '@/store/session';
import { ThemeProvider } from '@/theme/ThemeProvider';
import type { ThemeName } from '@/theme/tokens';

/**
 * Fixed insets so anything positioned against the safe area (the tab bar, the
 * Screen container) lays out deterministically rather than at whatever the
 * host reports. Modelled on a notched phone.
 */
const METRICS: Metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <SafeAreaProvider initialMetrics={METRICS}>
      <ThemeProvider>{children}</ThemeProvider>
    </SafeAreaProvider>
  );
}

/**
 * Renders inside the app's providers with the theme set explicitly.
 *
 * `render` is asynchronous in React Native Testing Library 14, so every call
 * site must await this.
 */
export function renderWithTheme(
  ui: ReactElement,
  { theme = 'light' as ThemeName, ...options }: { theme?: ThemeName } & RenderOptions = {}
) {
  useSessionStore.setState({ theme, hasHydrated: true });
  return render(ui, { wrapper: Wrapper, ...options });
}

/** Collapses RN's nested style arrays into one object for assertions. */
export const flattenStyle = (style: unknown) =>
  Object.assign({}, ...[style].flat(Infinity).filter(Boolean)) as Record<string, unknown>;

export * from '@testing-library/react-native';

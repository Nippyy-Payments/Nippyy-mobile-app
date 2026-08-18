import { render, type RenderOptions } from '@testing-library/react-native';
import type { ReactElement, ReactNode } from 'react';

import { useSessionStore } from '@/store/session';
import { ThemeProvider } from '@/theme/ThemeProvider';
import type { ThemeName } from '@/theme/tokens';

function Wrapper({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
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

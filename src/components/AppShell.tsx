import { Platform, StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';

import { useTokens } from '@/theme/ThemeProvider';

/**
 * The one place the app is constrained on wide viewports.
 *
 * This is a mobile design, and this phase is mobile-only. On web a desktop
 * browser would otherwise stretch every screen, so the app is capped to a
 * mobile column and centred on the `chrome.desk` surface. On native it is a
 * pass-through — there is nothing to constrain.
 *
 * Deliberately not a breakpoint: no layout inside the app branches on width.
 * When larger-screen support arrives it starts here (PORTING_PLAN.md §6).
 */
export function AppShell({ children }: { children: ReactNode }) {
  const { colors, layout } = useTokens();

  if (Platform.OS !== 'web') {
    return <View style={styles.fill}>{children}</View>;
  }

  return (
    <View style={[styles.fill, styles.desk, { backgroundColor: colors.chrome.desk }]}>
      <View
        style={[
          styles.fill,
          styles.column,
          { maxWidth: layout.maxWidth, backgroundColor: colors.surface.page },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  desk: { alignItems: 'center' },
  column: { width: '100%' },
});

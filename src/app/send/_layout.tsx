import { Stack } from 'expo-router';

import { useTheme } from '@/theme/ThemeProvider';

/**
 * The send flow.
 *
 * Full-screen: it sits outside the tab group, so the tab bar is simply not
 * present rather than being hidden by a flag.
 *
 * `gestureEnabled` is never set to false here or anywhere else — iOS
 * swipe-back must work on every pushed screen in this flow.
 */
export default function SendLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.surface.page },
        gestureEnabled: true,
      }}
    />
  );
}

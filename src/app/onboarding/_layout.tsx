import { Stack } from 'expo-router';

import { useTheme } from '@/theme/ThemeProvider';

/**
 * Onboarding. Full-screen: outside the tab group, so there is no tab bar to
 * hide. The swipe-back gesture stays enabled throughout.
 */
export default function OnboardingLayout() {
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

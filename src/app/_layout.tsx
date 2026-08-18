import '../../global.css';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AppShell } from '@/components/AppShell';
import { useSessionStore } from '@/store/session';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { fontMap } from '@/theme/fonts';

void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontMap);
  const hasHydrated = useSessionStore((s) => s.hasHydrated);

  // Designed text never renders in the system font. A load failure is raised
  // rather than silently degrading, which is the whole point of loading the
  // exact families.
  if (fontError) throw fontError;

  // Hold the splash until the typefaces resolve AND persisted preferences are
  // read back, so the app never flashes the wrong theme.
  const ready = fontsLoaded && hasHydrated;

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={styles.fill}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AppShell>
              <ThemedStack />
            </AppShell>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

/**
 * The navigator. Screen options come from tokens, and the real OS status bar
 * follows the chosen theme (PORTING_PLAN.md §8.19) — the design's mock status
 * bar, notch and bezel are not ported.
 */
function ThemedStack() {
  const { theme, isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.surface.page },
          // iOS swipe-back must work on every pushed screen. This is never
          // set to false, here or in any nested layout.
          gestureEnabled: true,
        }}
      >
        {/* The tab group. Everything below is pushed above it, which is why
            those screens have no tab bar — there is no flag hiding it. */}
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="send" />
        <Stack.Screen name="recipients" />
        <Stack.Screen name="money" />
        <Stack.Screen name="account" />
        <Stack.Screen name="transaction/[id]" />
        <Stack.Screen name="gallery" />

        {/* Modal presentation, so back and the dismiss gesture both work
            without any custom handling. */}
        <Stack.Screen name="wallet-picker" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });

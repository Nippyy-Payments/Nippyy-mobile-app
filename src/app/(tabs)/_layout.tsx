import { useRouter } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';

import { TabBar } from '@/components/navigation/TabBar';

/**
 * The four root tabs.
 *
 * The bar itself is the designed component, not a platform tab bar. Screens
 * that must not show it — send, onboarding, review, PIN entry — are not
 * hidden with a flag; they live outside this group entirely, so there is
 * nothing to hide.
 */
export default function TabsLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} onSend={() => router.push('/send')} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="wallets" options={{ title: 'Wallets' }} />
      <Tabs.Screen name="activity" options={{ title: 'History' }} />
      <Tabs.Screen name="menu" options={{ title: 'Account' }} />
    </Tabs>
  );
}

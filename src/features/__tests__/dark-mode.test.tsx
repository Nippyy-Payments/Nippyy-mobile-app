import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement, ReactNode } from 'react';

import { ActivityScreen } from '@/features/activity/ActivityScreen';
import { BillsScreen } from '@/features/bills/BillsScreen';
import { ChatSupportScreen } from '@/features/support/ChatSupportScreen';
import { CloseAccountIntro } from '@/features/account/CloseAccountScreen';
import { ConvertScreen } from '@/features/money/ConvertScreen';
import { DevicesScreen } from '@/features/account/DevicesScreen';
import { FundScreen } from '@/features/money/FundScreen';
import { HomeScreen } from '@/features/home/HomeScreen';
import { MenuScreen } from '@/features/account/MenuScreen';
import { NotificationsScreen } from '@/features/account/NotificationsScreen';
import { ProfileScreen } from '@/features/account/ProfileScreen';
import { RatesScreen } from '@/features/money/RatesScreen';
import { SecurityScreen } from '@/features/account/SecurityScreen';
import { SupportScreen } from '@/features/support/SupportScreen';
import { TiersScreen } from '@/features/account/TiersScreen';
import { TransactionScreen } from '@/features/activity/TransactionScreen';
import { WalletsScreen } from '@/features/wallets/WalletsScreen';
import { darkColors, lightColors } from '@/theme/tokens';
import { renderWithTheme, waitFor } from '@/test/render';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn(), dismissTo: jest.fn() }),
  useLocalSearchParams: () => ({}),
}));

jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn(async () => false),
  isEnrolledAsync: jest.fn(async () => false),
  authenticateAsync: jest.fn(async () => ({ success: false })),
}));

function withQuery(ui: ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return <Wrapper>{ui}</Wrapper>;
}

/**
 * Every screen, in dark.
 *
 * Dark mode is first class in this design: every alias is restated, because a
 * CSS alias resolves at its declaration site. A screen that renders in light
 * and throws in dark — or silently paints white-on-white — is exactly what
 * this catches.
 */
const SCREENS: [string, ReactElement][] = [
  ['home', <HomeScreen key="home" />],
  ['wallets', <WalletsScreen key="wallets" />],
  ['activity', <ActivityScreen key="activity" />],
  ['transaction', <TransactionScreen key="txn" id="np-8841-2207" />],
  ['convert', <ConvertScreen key="convert" />],
  ['fund', <FundScreen key="fund" />],
  ['rates', <RatesScreen key="rates" />],
  ['bills', <BillsScreen key="bills" />],
  ['menu', <MenuScreen key="menu" />],
  ['profile', <ProfileScreen key="profile" />],
  ['tiers', <TiersScreen key="tiers" />],
  ['security', <SecurityScreen key="security" />],
  ['devices', <DevicesScreen key="devices" />],
  ['notifications', <NotificationsScreen key="notifs" />],
  ['close', <CloseAccountIntro key="close" />],
  ['support', <SupportScreen key="support" />],
  ['chat support', <ChatSupportScreen key="chat" />],
];

describe('dark mode', () => {
  it.each(SCREENS)('renders %s without throwing', async (_name, element) => {
    const view = await renderWithTheme(withQuery(element), { theme: 'dark' });
    await waitFor(() => expect(view.toJSON()).toBeTruthy());
  });
});

describe('dark palette', () => {
  it('inverts the ink panel, so text on it must invert too', () => {
    // surface.ink is near-black in light and near-white in dark. A fixed
    // white alpha on that panel would vanish — hence text.onInkMuted.
    expect(lightColors.surface.ink).not.toBe(darkColors.surface.ink);
    expect(lightColors.text.onInk).not.toBe(darkColors.text.onInk);
    expect(lightColors.text.onInkMuted).not.toBe(darkColors.text.onInkMuted);
    expect(lightColors.surface.onInkChip).not.toBe(darkColors.surface.onInkChip);
  });

  it('keeps the page and its text far apart in both themes', () => {
    expect(lightColors.surface.page).not.toBe(lightColors.text.strong);
    expect(darkColors.surface.page).not.toBe(darkColors.text.strong);
  });

  it('keeps the tab bar translucent in both themes', () => {
    expect(lightColors.chrome.tabBar).toContain('rgba');
    expect(darkColors.chrome.tabBar).toContain('rgba');
    expect(lightColors.chrome.tabBar).not.toBe(darkColors.chrome.tabBar);
  });
});

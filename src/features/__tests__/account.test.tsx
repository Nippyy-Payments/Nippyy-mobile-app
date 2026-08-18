import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement, ReactNode } from 'react';

import { ChatSupportScreen } from '@/features/support/ChatSupportScreen';
import { CloseAccountConfirm, CloseAccountIntro } from '@/features/account/CloseAccountScreen';
import { DevicesScreen } from '@/features/account/DevicesScreen';
import { MenuScreen } from '@/features/account/MenuScreen';
import { NotificationsScreen } from '@/features/account/NotificationsScreen';
import { SecurityScreen } from '@/features/account/SecurityScreen';
import { SupportScreen } from '@/features/support/SupportScreen';
import { TiersScreen } from '@/features/account/TiersScreen';
import { CURRENT_TIER, TIERS, tierLimitLine } from '@/features/account/tiers';
import { MENU_GROUPS } from '@/features/account/menu';
import { useSessionStore } from '@/store/session';
import { fireEvent, renderWithTheme, waitFor } from '@/test/render';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({}),
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

beforeEach(() => {
  mockPush.mockClear();
  useSessionStore.setState({ biometricsEnabled: false, hasHydrated: true, theme: 'light' });
});

describe('tier data', () => {
  it('quotes naira limits from the app, not the deck', () => {
    // §8.1 — the app wins over the Handoff deck's sterling monthly caps.
    for (const tier of TIERS) {
      expect(tier.deposit.startsWith('₦')).toBe(true);
      expect(tier.withdrawal.startsWith('₦')).toBe(true);
    }
    expect(TIERS.map((tier) => tier.balanceCap)).toContain('Unlimited');
  });

  it('summarises a tier in one line', () => {
    expect(tierLimitLine(TIERS[0]!)).toBe('Deposit ₦50,000 · balance cap ₦300,000');
  });
});

describe('menu data', () => {
  it('gives every row exactly one destination', () => {
    for (const group of MENU_GROUPS) {
      for (const item of group.items) {
        // A row either pushes a screen or opens a tab — never both, never neither.
        expect(Boolean(item.to) !== Boolean(item.href)).toBe(true);
      }
    }
  });

  it('marks only the close-account row as destructive', () => {
    const danger = MENU_GROUPS.flatMap((group) => group.items).filter((item) => item.danger);
    expect(danger.map((item) => item.label)).toEqual(['Close account']);
  });
});

describe('MenuScreen', () => {
  it('labels dark mode On or Off, never "following the system"', async () => {
    // §8.8 — the theme is user-owned, so the design's original label is untrue.
    const { getByText, queryByText } = await renderWithTheme(withQuery(<MenuScreen />), {
      theme: 'light',
    });

    expect(getByText('Off')).toBeTruthy();
    expect(queryByText(/following the system/i)).toBeNull();
  });

  it('reads On when dark', async () => {
    const { getByText } = await renderWithTheme(withQuery(<MenuScreen />), { theme: 'dark' });
    expect(getByText('On')).toBeTruthy();
  });

  it('opens an in-app destination through the router', async () => {
    const { getByTestId } = await renderWithTheme(withQuery(<MenuScreen />));

    fireEvent.press(getByTestId('menu-Account tiers'));
    expect(mockPush).toHaveBeenCalledWith('/account/tiers');
  });
});

describe('TiersScreen', () => {
  it('marks the current, next and locked tiers', async () => {
    const { getByText } = await renderWithTheme(withQuery(<TiersScreen />));

    expect(getByText('Current')).toBeTruthy();
    expect(getByText('Next step')).toBeTruthy();
    expect(getByText('Locked')).toBeTruthy();
  });

  it('shows the limits for the tier the account is on', async () => {
    const current = TIERS.find((tier) => tier.number === CURRENT_TIER);
    const { getByTestId } = await renderWithTheme(withQuery(<TiersScreen />));

    expect(getByTestId(`tier-${current?.number}`)).toBeTruthy();
  });
});

describe('SecurityScreen', () => {
  it('drives the biometric preference that gates confirmation', async () => {
    const { getByRole } = await renderWithTheme(withQuery(<SecurityScreen />));

    expect(useSessionStore.getState().biometricsEnabled).toBe(false);
    fireEvent.press(getByRole('switch'));

    await waitFor(() => expect(useSessionStore.getState().biometricsEnabled).toBe(true));
  });

  it('routes to devices rather than swapping a local view', async () => {
    const { getByTestId } = await renderWithTheme(withQuery(<SecurityScreen />));

    fireEvent.press(getByTestId('devices-row'));
    expect(mockPush).toHaveBeenCalledWith('/account/security/devices');
  });
});

describe('DevicesScreen', () => {
  it('marks the current device and makes it inert', async () => {
    const { getByText, getByTestId } = await renderWithTheme(withQuery(<DevicesScreen />));

    expect(getByText('This device')).toBeTruthy();
    expect(getByTestId('device-0').props.accessibilityRole).toBeUndefined();
  });
});

describe('NotificationsScreen', () => {
  it('groups notifications by recency', async () => {
    const { getByText } = await renderWithTheme(withQuery(<NotificationsScreen />));

    await waitFor(() => expect(getByText('Today')).toBeTruthy());
    expect(getByText('Earlier')).toBeTruthy();
  });

  it('is a state, not a route, when there is nothing to show', async () => {
    // §8.11 — one route, two states.
    const { getByText, queryByText } = await renderWithTheme(
      withQuery(<NotificationsScreen empty />)
    );

    expect(getByText('Nothing yet')).toBeTruthy();
    expect(queryByText('Mark read')).toBeNull();
  });
});

describe('CloseAccount', () => {
  it('warns about the balance before anything else', async () => {
    const { getByText } = await renderWithTheme(withQuery(<CloseAccountIntro />));
    await waitFor(() => expect(getByText('Move your money first')).toBeTruthy());
  });

  it('quotes the real balance rather than a placeholder', async () => {
    const { getByText } = await renderWithTheme(withQuery(<CloseAccountIntro />));
    await waitFor(() => expect(getByText(/3,624,097/)).toBeTruthy());
  });

  it('keeps the destructive action disabled until CLOSE is typed', async () => {
    const { getByTestId } = await renderWithTheme(withQuery(<CloseAccountConfirm />));

    expect(getByTestId('close-account').props.accessibilityState.disabled).toBe(true);

    fireEvent.changeText(getByTestId('close-confirmation'), 'CLOSE');
    await waitFor(() =>
      expect(getByTestId('close-account').props.accessibilityState.disabled).toBe(false)
    );
  });

  it('does not accept a near miss', async () => {
    const { getByTestId } = await renderWithTheme(withQuery(<CloseAccountConfirm />));

    fireEvent.changeText(getByTestId('close-confirmation'), 'CLOS');
    await waitFor(() =>
      expect(getByTestId('close-account').props.accessibilityState.disabled).toBe(true)
    );
  });
});

describe('Support', () => {
  it('marks external destinations as links and in-app ones as buttons', async () => {
    const { getByTestId } = await renderWithTheme(withQuery(<SupportScreen />));

    expect(getByTestId('support-chat').props.accessibilityRole).toBe('button');
    expect(getByTestId('support-mail').props.accessibilityRole).toBe('link');
    expect(getByTestId('social-twitter').props.accessibilityRole).toBe('link');
  });

  it('offers a way through even though chat is not live', async () => {
    const { getByText, getByTestId } = await renderWithTheme(withQuery(<ChatSupportScreen />));

    expect(getByText('Coming soon')).toBeTruthy();
    expect(getByTestId('chat-email')).toBeTruthy();
    expect(getByTestId('chat-twitter')).toBeTruthy();
  });
});

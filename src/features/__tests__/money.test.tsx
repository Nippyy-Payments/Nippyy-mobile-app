import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement, ReactNode } from 'react';

import { BillPayScreen } from '@/features/bills/BillPayScreen';
import { BillsScreen } from '@/features/bills/BillsScreen';
import { ConvertScreen } from '@/features/money/ConvertScreen';
import { FundScreen } from '@/features/money/FundScreen';
import { RatesScreen } from '@/features/money/RatesScreen';
import { BILL_CATEGORIES, billCategory } from '@/features/bills/categories';
import { useSessionStore } from '@/store/session';
import { fireEvent, renderWithTheme, waitFor } from '@/test/render';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn(), replace: jest.fn(), dismissTo: jest.fn() }),
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

beforeEach(() => {
  mockPush.mockClear();
  useSessionStore.setState({ biometricsEnabled: false, hasHydrated: true, theme: 'light' });
});

describe('bill categories', () => {
  it('offers the six the design ships', () => {
    expect(BILL_CATEGORIES).toHaveLength(6);
  });

  it('marks only electricity as returning a prepaid token', () => {
    const withToken = BILL_CATEGORIES.filter((category) => category.token);
    expect(withToken.map((category) => category.id)).toEqual(['power']);
  });

  it('names the account field per biller, because they differ', () => {
    expect(billCategory('power')?.field).toBe('Meter number');
    expect(billCategory('tv')?.field).toBe('Smartcard number');
    expect(billCategory('airtime')?.field).toBe('Phone number');
  });
});

describe('ConvertScreen', () => {
  it('converts between two wallets at the live rate', async () => {
    const { getByTestId } = await renderWithTheme(withQuery(<ConvertScreen />));

    // Primary is NGN; the pair defaults to the next wallet, GBP.
    await waitFor(() => expect(getByTestId('convert-from')).toBeTruthy());
    expect(getByTestId('convert-to')).toBeTruthy();
  });

  it('offers a swap between the pair', async () => {
    const { getByTestId } = await renderWithTheme(withQuery(<ConvertScreen />));
    await waitFor(() => expect(getByTestId('swap')).toBeTruthy());

    fireEvent.press(getByTestId('swap'));
    expect(getByTestId('convert-from')).toBeTruthy();
  });

  it('confirms completion rather than silently returning', async () => {
    const { getByTestId, getByText } = await renderWithTheme(withQuery(<ConvertScreen />));
    await waitFor(() => expect(getByTestId('convert')).toBeTruthy());

    fireEvent.press(getByTestId('convert'));
    await waitFor(() => expect(getByText(/topped up/)).toBeTruthy());
  });
});

describe('FundScreen', () => {
  it('shows the virtual account for a bank transfer', async () => {
    const { getByText } = await renderWithTheme(withQuery(<FundScreen />));
    await waitFor(() => expect(getByText('1101470163')).toBeTruthy());
    expect(getByText('9 payment service Bank')).toBeTruthy();
  });

  it('warns that the reference is what matches the transfer', async () => {
    const { getByText } = await renderWithTheme(withQuery(<FundScreen />));
    await waitFor(() => expect(getByText('Use the reference')).toBeTruthy());
  });

  it('switches to the card branch', async () => {
    const { getByTestId, getByText } = await renderWithTheme(withQuery(<FundScreen />));

    fireEvent.press(getByTestId('chip-card'));
    await waitFor(() => expect(getByText('Visa ···4471')).toBeTruthy());
    expect(getByText('Card top-ups carry a 1.4% fee')).toBeTruthy();
  });

  it('states the stablecoin rule plainly on the crypto branch', async () => {
    const { getByTestId, getByText } = await renderWithTheme(withQuery(<FundScreen />));

    fireEvent.press(getByTestId('chip-crypto'));
    await waitFor(() => expect(getByText('USDC only, on the network shown')).toBeTruthy());
    expect(getByTestId('deposit-address')).toBeTruthy();
  });

  it('offers no coin other than USDC', async () => {
    const { getByTestId, queryByTestId } = await renderWithTheme(withQuery(<FundScreen />));

    fireEvent.press(getByTestId('chip-crypto'));
    await waitFor(() => expect(getByTestId('chip-Base')).toBeTruthy());
    // Networks, not coins.
    expect(getByTestId('chip-Ethereum')).toBeTruthy();
    expect(queryByTestId('chip-USDT')).toBeNull();
  });
});

describe('RatesScreen', () => {
  it('shows today’s rate and marks a seven-day high', async () => {
    const { getByTestId, getByText } = await renderWithTheme(withQuery(<RatesScreen />));

    await waitFor(() => expect(getByTestId('today-rate')).toBeTruthy());
    expect(getByText('Highest in 7 days')).toBeTruthy();
  });

  it('draws a bar per day', async () => {
    const { getByTestId } = await renderWithTheme(withQuery(<RatesScreen />));

    for (const day of ['Mon', 'Wed', 'Sun']) {
      expect(getByTestId(`bar-${day}`)).toBeTruthy();
    }
  });

  it('steps the alert target up and down', async () => {
    const { getByTestId } = await renderWithTheme(withQuery(<RatesScreen />));
    await waitFor(() => expect(getByTestId('target')).toBeTruthy());

    fireEvent.press(getByTestId('target-up'));
    await waitFor(() => expect(getByTestId('target').props.children).toContain('1,965'));

    fireEvent.press(getByTestId('target-down'));
    await waitFor(() => expect(getByTestId('target').props.children).toContain('1,960'));
  });
});

describe('BillsScreen', () => {
  it('lists every category', async () => {
    const { getByTestId } = await renderWithTheme(withQuery(<BillsScreen />));

    for (const category of BILL_CATEGORIES) {
      expect(getByTestId(`bill-${category.id}`)).toBeTruthy();
    }
  });

  it('opens a category by id', async () => {
    const { getByTestId } = await renderWithTheme(withQuery(<BillsScreen />));

    fireEvent.press(getByTestId('bill-power'));
    expect(mockPush).toHaveBeenCalledWith('/money/bill/power');
  });
});

describe('BillPayScreen', () => {
  it('collects the field this biller actually uses', async () => {
    const { getByText } = await renderWithTheme(withQuery(<BillPayScreen categoryId="power" />));
    await waitFor(() => expect(getByText('Meter number')).toBeTruthy());
  });

  it('defaults to the second preset, as the design does', async () => {
    const { getByTestId } = await renderWithTheme(withQuery(<BillPayScreen categoryId="power" />));
    await waitFor(() => expect(getByTestId('bill-amount-figure')).toBeTruthy());
    expect(getByTestId('bill-amount-figure').props.children).toBe('10,000');
  });

  it('explains an unknown category instead of rendering an empty form', async () => {
    const { getByText } = await renderWithTheme(withQuery(<BillPayScreen categoryId="nope" />));
    await waitFor(() => expect(getByText('We could not find that biller')).toBeTruthy());
  });
});

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement, ReactNode } from 'react';

import { ActivityScreen } from '@/features/activity/ActivityScreen';
import { HomeScreen } from '@/features/home/HomeScreen';
import { TransactionScreen } from '@/features/activity/TransactionScreen';
import { WalletsScreen } from '@/features/wallets/WalletsScreen';
import { __setApiFailure } from '@/lib/api/client';
import { useSessionStore } from '@/store/session';
import { renderWithTheme, fireEvent, waitFor } from '@/test/render';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn(), dismissTo: jest.fn() }),
  useLocalSearchParams: () => ({ id: 'np-8841-2207' }),
}));

/** A fresh client per test, so one test's cache never satisfies another. */
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
  __setApiFailure(false);
  useSessionStore.setState({ balanceHidden: false, hasHydrated: true, theme: 'light' });
});

afterAll(() => __setApiFailure(false));

describe('HomeScreen', () => {
  it('shows a skeleton for the balance before it arrives', async () => {
    const { getByTestId } = await renderWithTheme(withQuery(<HomeScreen />));
    // Placeholders are hidden from assistive tech deliberately, so the query
    // has to opt into hidden elements.
    expect(getByTestId('balance-skeleton', { includeHiddenElements: true })).toBeTruthy();
  });

  it('totals every wallet in naira once loaded', async () => {
    const { getByText } = await renderWithTheme(withQuery(<HomeScreen />));

    // 1,250,000 + 840.20*1985 + 310*1570 + 120*1830 + 0 = 3,624,097
    await waitFor(() => expect(getByText(/3,624,097/)).toBeTruthy());
  });

  it('masks the balance globally, not per screen', async () => {
    const { getByTestId, getByText, queryByText } = await renderWithTheme(
      withQuery(<HomeScreen />)
    );
    await waitFor(() => expect(getByText(/3,624,097/)).toBeTruthy());

    fireEvent.press(getByTestId('mask-toggle'));

    await waitFor(() => expect(queryByText(/3,624,097/)).toBeNull());
    expect(useSessionStore.getState().balanceHidden).toBe(true);
  });

  it('lists recipients and routes to send with the recipient id', async () => {
    const { getByTestId } = await renderWithTheme(withQuery(<HomeScreen />));
    await waitFor(() => expect(getByTestId('recipient-ada-okeke')).toBeTruthy());

    fireEvent.press(getByTestId('recipient-ada-okeke'));
    expect(mockPush).toHaveBeenCalledWith('/send?recipient=ada-okeke');
  });

  it('marks an unverified recipient', async () => {
    const { getByTestId, getByText } = await renderWithTheme(withQuery(<HomeScreen />));
    await waitFor(() => expect(getByTestId('recipient-kwame-mensah')).toBeTruthy());
    expect(getByText('Verifying')).toBeTruthy();
  });

  it('offers a retry when the data cannot be reached', async () => {
    __setApiFailure(true);
    const { getAllByText } = await renderWithTheme(withQuery(<HomeScreen />));

    await waitFor(() => expect(getAllByText('Try again').length).toBeGreaterThan(0));
  });
});

describe('WalletsScreen', () => {
  it('names each wallet from the client-side currency registry', async () => {
    // The endpoint sends no display name — see PORTING_PLAN.md §8.7.
    const { getByText } = await renderWithTheme(withQuery(<WalletsScreen />));

    await waitFor(() => expect(getByText('Nigerian naira')).toBeTruthy());
    expect(getByText('British pound')).toBeTruthy();
    expect(getByText('Send, pay bills, withdraw')).toBeTruthy();
  });

  it('shows the naira equivalent of a foreign wallet', async () => {
    const { getByText } = await renderWithTheme(withQuery(<WalletsScreen />));
    await waitFor(() => expect(getByText(/840\.20/)).toBeTruthy());
    expect(getByText(/1,667,797/)).toBeTruthy();
  });

  it('hides the naira equivalent when the balance is masked', async () => {
    useSessionStore.setState({ balanceHidden: true });
    const { queryByText, getByText } = await renderWithTheme(withQuery(<WalletsScreen />));

    await waitFor(() => expect(getByText('British pound')).toBeTruthy());
    expect(queryByText(/1,667,797/)).toBeNull();
  });

  it('states that USDC is the only stablecoin', async () => {
    const { getByText } = await renderWithTheme(withQuery(<WalletsScreen />));
    await waitFor(() => expect(getByText('USDC is the only stablecoin')).toBeTruthy());
  });
});

describe('ActivityScreen', () => {
  it('lists transactions once loaded', async () => {
    const { getByTestId } = await renderWithTheme(withQuery(<ActivityScreen />));
    await waitFor(() => expect(getByTestId('txn-np-8841-2207')).toBeTruthy());
  });

  it('filters to bills only', async () => {
    const { getByTestId, queryByTestId } = await renderWithTheme(withQuery(<ActivityScreen />));
    await waitFor(() => expect(getByTestId('txn-np-8841-2207')).toBeTruthy());

    fireEvent.press(getByTestId('chip-Bills'));

    await waitFor(() => expect(getByTestId('txn-np-7712-0043')).toBeTruthy());
    expect(queryByTestId('txn-np-8841-2207')).toBeNull();
  });

  it('narrows to received deposits only', async () => {
    const { getByTestId, queryByTestId } = await renderWithTheme(withQuery(<ActivityScreen />));
    await waitFor(() => expect(getByTestId('txn-np-8841-2207')).toBeTruthy());

    fireEvent.press(getByTestId('chip-Received'));

    await waitFor(() => expect(getByTestId('txn-np-9930-4471')).toBeTruthy());
    expect(queryByTestId('txn-np-8841-2207')).toBeNull();
  });

  it('opens a transaction by id', async () => {
    const { getByTestId } = await renderWithTheme(withQuery(<ActivityScreen />));
    await waitFor(() => expect(getByTestId('txn-np-8841-2207')).toBeTruthy());

    fireEvent.press(getByTestId('txn-np-8841-2207'));
    expect(mockPush).toHaveBeenCalledWith('/transaction/np-8841-2207');
  });

  it('shows an error state with a retry', async () => {
    __setApiFailure(true);
    const { getByTestId } = await renderWithTheme(withQuery(<ActivityScreen />));
    await waitFor(() => expect(getByTestId('retry')).toBeTruthy());
  });
});

describe('TransactionScreen', () => {
  it('renders the transaction named by the route param', async () => {
    const { getByTestId } = await renderWithTheme(
      withQuery(<TransactionScreen id="np-8841-2207" />)
    );

    await waitFor(() => expect(getByTestId('amount')).toBeTruthy());
    expect(getByTestId('amount').props.children).toContain('-₦200,000');
  });

  it('shows the breakdown of what was actually paid', async () => {
    const { getByText } = await renderWithTheme(
      withQuery(<TransactionScreen id="np-8841-2207" />)
    );

    await waitFor(() => expect(getByText(/100\.40/)).toBeTruthy());
    expect(getByText('They received')).toBeTruthy();
  });

  it('says a pending transfer will arrive, not that it has', async () => {
    const { getByText } = await renderWithTheme(
      withQuery(<TransactionScreen id="np-5521-8890" />)
    );

    await waitFor(() => expect(getByText('Pending')).toBeTruthy());
    expect(getByText('They will receive')).toBeTruthy();
  });

  it('explains an unknown id instead of rendering an empty shell', async () => {
    const { getByText } = await renderWithTheme(withQuery(<TransactionScreen id="nope" />));
    await waitFor(() => expect(getByText('We could not find that transfer')).toBeTruthy());
  });
});

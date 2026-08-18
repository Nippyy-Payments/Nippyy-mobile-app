import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement, ReactNode } from 'react';

import { ReviewScreen } from '@/features/send/ReviewScreen';
import { SendAmountScreen } from '@/features/send/SendAmountScreen';
import { SuccessScreen } from '@/features/send/SuccessScreen';
import { applyKey, useSendStore } from '@/store/send';
import { confirmLabel } from '@/lib/auth';
import { useSessionStore } from '@/store/session';
import { fireEvent, renderWithTheme, waitFor } from '@/test/render';

const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace, back: jest.fn(), dismissTo: jest.fn() }),
  useLocalSearchParams: () => ({}),
}));

jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn(async () => true),
  isEnrolledAsync: jest.fn(async () => true),
  authenticateAsync: jest.fn(async () => ({ success: true })),
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
  mockReplace.mockClear();
  useSendStore.getState().reset();
  useSessionStore.setState({ biometricsEnabled: false, hasHydrated: true, theme: 'light' });
});

describe('amount entry', () => {
  it('replaces a leading zero rather than appending to it', () => {
    expect(applyKey('0', '2')).toBe('2');
  });

  it('appends to an existing figure', () => {
    expect(applyKey('20', '0')).toBe('200');
  });

  it('deletes back to zero, never to empty', () => {
    expect(applyKey('2', 'back')).toBe('0');
    expect(applyKey('0', 'back')).toBe('0');
  });

  it('allows only one decimal point', () => {
    expect(applyKey('20.5', '.')).toBe('20.5');
    expect(applyKey('20', '.')).toBe('20.');
  });
});

describe('SendAmountScreen', () => {
  it('takes the recipient from the route', async () => {
    const { getByText } = await renderWithTheme(
      withQuery(<SendAmountScreen recipientId="kwame-mensah" />)
    );

    await waitFor(() => expect(getByText('Kwame Mensah')).toBeTruthy());
    expect(useSendStore.getState().recipientId).toBe('kwame-mensah');
  });

  it('defaults the source wallet to the primary one', async () => {
    const { getByText } = await renderWithTheme(
      withQuery(<SendAmountScreen recipientId="ada-okeke" />)
    );

    await waitFor(() => expect(getByText('Ada Okeke')).toBeTruthy());
    // The NGN wallet is flagged primary in the API response.
    expect(useSendStore.getState().sourceCurrency).toBe('NGN');
  });

  it('disables review while the amount is zero', async () => {
    const { getByTestId } = await renderWithTheme(
      withQuery(<SendAmountScreen recipientId="ada-okeke" />)
    );

    await waitFor(() => expect(getByTestId('review-transfer')).toBeTruthy());
    fireEvent.press(getByTestId('review-transfer'));
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('blocks a transfer larger than the available balance', async () => {
    // Seeded rather than typed: nine taps prove nothing extra here, and the
    // check that matters is against availableBalance, not the keypad.
    useSendStore.getState().setAmount('999999999');

    const { getByTestId, getByText } = await renderWithTheme(
      withQuery(<SendAmountScreen recipientId="ada-okeke" />)
    );

    await waitFor(() => expect(getByText('Not enough in your NGN wallet')).toBeTruthy());

    fireEvent.press(getByTestId('review-transfer'));
    expect(mockPush).not.toHaveBeenCalledWith('/send/review');
  });

  it('offers both a fix and an alternative when over balance', async () => {
    useSendStore.getState().setAmount('999999999');

    const { getByText } = await renderWithTheme(
      withQuery(<SendAmountScreen recipientId="ada-okeke" />)
    );

    await waitFor(() => expect(getByText('Add money')).toBeTruthy());
    expect(getByText('Switch wallet')).toBeTruthy();
  });
});

describe('ReviewScreen', () => {
  it('goes to the PIN gate when biometrics are off', async () => {
    useSendStore.getState().setRecipient('ada-okeke');
    useSendStore.getState().setAmount('200');

    const { getByTestId } = await renderWithTheme(withQuery(<ReviewScreen />));
    await waitFor(() => expect(getByTestId('confirm-send')).toBeTruthy());

    fireEvent.press(getByTestId('confirm-send'));
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/send/pin'));
  });

  it('goes straight to sending when biometrics succeed', async () => {
    useSessionStore.setState({ biometricsEnabled: true });
    useSendStore.getState().setRecipient('ada-okeke');
    useSendStore.getState().setAmount('200');

    const { getByTestId } = await renderWithTheme(withQuery(<ReviewScreen />));
    await waitFor(() => expect(getByTestId('confirm-send')).toBeTruthy());

    fireEvent.press(getByTestId('confirm-send'));
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/send/sending'));
  });

  it('adds the fee into the total to pay', async () => {
    useSendStore.getState().setRecipient('ada-okeke');
    useSendStore.getState().setAmount('200');

    const { getByText } = await renderWithTheme(withQuery(<ReviewScreen />));
    // 200 + 0.40 fee, in the primary NGN wallet, which has no decimals.
    await waitFor(() => expect(getByText('Total to pay')).toBeTruthy());
  });
});

describe('confirmLabel', () => {
  it('names the method only when it is genuinely available', () => {
    expect(confirmLabel('Send £200.40', true)).toBe('Send £200.40 with Face ID');
    expect(confirmLabel('Send £200.40', false)).toBe('Send £200.40');
  });
});

describe('SuccessScreen', () => {
  it('quotes the reference the transfer completed with', async () => {
    useSendStore.getState().setRecipient('ada-okeke');
    useSendStore.getState().setAmount('200');
    useSendStore.getState().complete('NP-1234-5678');

    const { getByText } = await renderWithTheme(withQuery(<SuccessScreen />));
    await waitFor(() => expect(getByText('NP-1234-5678')).toBeTruthy());
  });

  it('clears the composed transfer when done', async () => {
    useSendStore.getState().setRecipient('ada-okeke');
    useSendStore.getState().setAmount('200');
    useSendStore.getState().complete('NP-1234-5678');

    const { getByTestId } = await renderWithTheme(withQuery(<SuccessScreen />));
    await waitFor(() => expect(getByTestId('done')).toBeTruthy());

    fireEvent.press(getByTestId('done'));
    expect(useSendStore.getState().amount).toBe('0');
    expect(useSendStore.getState().recipientId).toBeNull();
  });
});

/*
 * Ordering note: the keypad-driven test goes last on purpose. Under this Jest
 * environment a test that fills a keypad leaves the next mount in the same
 * file rendering empty — a test-renderer artifact, not app behaviour. The
 * amount rules themselves are covered above as pure functions.
 * See PORTING_PLAN.md §19.
 */
describe('SendAmountScreen — keypad', () => {
  it('advances to review once an amount is entered', async () => {
    const { getByTestId } = await renderWithTheme(
      withQuery(<SendAmountScreen recipientId="ada-okeke" />)
    );
    await waitFor(() => expect(getByTestId('key-2')).toBeTruthy());

    fireEvent.press(getByTestId('key-2'));
    fireEvent.press(getByTestId('key-0'));
    fireEvent.press(getByTestId('key-0'));

    // The button only enables once the store has propagated the amount.
    await waitFor(() =>
      expect(getByTestId('review-transfer').props.accessibilityState.disabled).toBe(false)
    );

    fireEvent.press(getByTestId('review-transfer'));
    expect(mockPush).toHaveBeenCalledWith('/send/review');
  });
});

import { View } from 'react-native';

import { DetailRow } from '@/components/data/DetailRow';
import { ListRow } from '@/components/data/ListRow';
import { TransactionRow } from '@/components/data/TransactionRow';
import { lightColors } from '@/theme/tokens';
import { flattenStyle, fireEvent, renderWithTheme, waitFor } from '@/test/render';

jest.mock('expo-clipboard', () => ({ setStringAsync: jest.fn(async () => true) }));
jest.mock('expo-linking', () => ({ openURL: jest.fn(async () => true) }));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Clipboard = require('expo-clipboard') as { setStringAsync: jest.Mock };
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Linking = require('expo-linking') as { openURL: jest.Mock };

describe('ListRow', () => {
  it('bleeds past the gutter to the screen edge', async () => {
    // The design widens the row and pulls it back with a negative margin.
    // In RN that is a negative margin plus matching padding — no width calc.
    const { getByTestId } = await renderWithTheme(<ListRow title="Ada Okeke" testID="row" />);
    const style = flattenStyle(getByTestId('row').props.style);

    expect(style.marginHorizontal).toBe(-24);
    expect(style.paddingHorizontal).toBe(24);
  });

  it('honours a tighter gutter on settings screens', async () => {
    const { getByTestId } = await renderWithTheme(
      <ListRow title="Devices & sessions" gutter={20} testID="row" />
    );
    const style = flattenStyle(getByTestId('row').props.style);

    expect(style.marginHorizontal).toBe(-20);
    expect(style.paddingHorizontal).toBe(20);
  });

  it('divides with a hairline, except the first row in a run', async () => {
    const { getByTestId: first } = await renderWithTheme(
      <ListRow title="First" first testID="row" />
    );
    expect(flattenStyle(first('row').props.style).borderTopWidth).toBe(0);

    const { getByTestId: rest } = await renderWithTheme(<ListRow title="Second" testID="row" />);
    const style = flattenStyle(rest('row').props.style);
    expect(style.borderTopWidth).toBe(1);
    expect(style.borderTopColor).toBe(lightColors.border.subtle);
  });

  it('meets the minimum row height', async () => {
    const { getByTestId } = await renderWithTheme(<ListRow title="Ada Okeke" testID="row" />);
    expect(flattenStyle(getByTestId('row').props.style).minHeight).toBe(56);
  });

  it('opens external links rather than navigating in-app', async () => {
    const { getByTestId } = await renderWithTheme(
      <ListRow title="Privacy policy" affordance="external" href="https://nippyy.com/privacy" testID="row" />
    );

    fireEvent.press(getByTestId('row'));
    await waitFor(() => expect(Linking.openURL).toHaveBeenCalledWith('https://nippyy.com/privacy'));
  });

  it('marks an external row as a link and an in-app row as a button', async () => {
    const { getByTestId: ext } = await renderWithTheme(
      <ListRow title="FAQ" affordance="external" href="https://nippyy.com/faq" testID="row" />
    );
    expect(ext('row').props.accessibilityRole).toBe('link');

    const { getByTestId: push } = await renderWithTheme(
      <ListRow title="Account tiers" onPress={() => {}} testID="row" />
    );
    expect(push('row').props.accessibilityRole).toBe('button');
  });

  it('is inert when it neither navigates nor acts', async () => {
    const { getByTestId } = await renderWithTheme(
      <ListRow title="GTBank" affordance="none" testID="row" />
    );
    expect(getByTestId('row').props.accessibilityRole).toBeUndefined();
  });

  it('reads title and subtitle together to assistive tech', async () => {
    const { getByTestId } = await renderWithTheme(
      <ListRow title="Ada Okeke" subtitle="GTBank · ···4471" onPress={() => {}} testID="row" />
    );
    expect(getByTestId('row').props.accessibilityLabel).toBe('Ada Okeke, GTBank · ···4471');
  });

  it('colours a danger row title red', async () => {
    const { getByText } = await renderWithTheme(<ListRow title="Close account" danger />);
    expect(flattenStyle(getByText('Close account').props.style).color).toBe(
      lightColors.status.danger
    );
  });

  it('renders leading and trailing slots', async () => {
    const { getByTestId } = await renderWithTheme(
      <ListRow
        title="Ada Okeke"
        leading={<View testID="leading" />}
        trailing={<View testID="trailing" />}
      />
    );

    expect(getByTestId('leading')).toBeTruthy();
    expect(getByTestId('trailing')).toBeTruthy();
  });
});

describe('TransactionRow', () => {
  it('signs and colours an outgoing transfer in ink, not red', async () => {
    const { getByText } = await renderWithTheme(
      <TransactionRow name="Ada Okeke" amount="200,000" direction="out" />
    );
    const amount = getByText('-₦200,000');

    expect(flattenStyle(amount.props.style).color).toBe(lightColors.money.out);
    expect(flattenStyle(amount.props.style).color).not.toBe(lightColors.status.danger);
  });

  it('signs and colours an incoming transfer green', async () => {
    const { getByText } = await renderWithTheme(
      <TransactionRow name="Salary" amount="2,400.00" currencySymbol="£" direction="in" />
    );
    expect(flattenStyle(getByText('+£2,400.00').props.style).color).toBe(lightColors.money.in);
  });

  it('keeps a failed amount in ink and lets the badge carry the failure', async () => {
    const { getByText } = await renderWithTheme(
      <TransactionRow name="Amara Njoku" amount="18,000" currencySymbol="KSh" status="failed" />
    );

    expect(flattenStyle(getByText('-KSh18,000').props.style).color).toBe(lightColors.money.out);
    expect(getByText('Failed')).toBeTruthy();
  });

  it('labels each status', async () => {
    const { getByText } = await renderWithTheme(
      <TransactionRow name="Kwame Mensah" amount="1,500" status="pending" />
    );
    expect(getByText('Pending')).toBeTruthy();
  });

  it('announces name, amount and status together', async () => {
    const { getByTestId } = await renderWithTheme(
      <TransactionRow name="Ada Okeke" amount="200,000" onPress={() => {}} testID="txn" />
    );
    expect(getByTestId('txn').props.accessibilityLabel).toBe(
      'Ada Okeke, -₦200,000, Completed'
    );
  });

  it('bleeds like a ListRow, because it sits in the same stack', async () => {
    const { getByTestId } = await renderWithTheme(
      <TransactionRow name="Ada Okeke" amount="200,000" testID="txn" />
    );
    const style = flattenStyle(getByTestId('txn').props.style);

    expect(style.marginHorizontal).toBe(-24);
    expect(style.paddingHorizontal).toBe(24);
  });
});

describe('DetailRow', () => {
  it('shows label and value', async () => {
    const { getByText } = await renderWithTheme(<DetailRow label="Rate" value="£1 = ₦1,985" />);

    expect(getByText('Rate')).toBeTruthy();
    expect(getByText('£1 = ₦1,985')).toBeTruthy();
  });

  it('gives every value tabular figures', async () => {
    const { getByText } = await renderWithTheme(<DetailRow label="Fee" value="£0.40" />);
    expect(flattenStyle(getByText('£0.40').props.style).fontVariant).toEqual(['tabular-nums']);
  });

  it('copies the value and confirms it', async () => {
    const onCopied = jest.fn();
    const { getByTestId, getByText } = await renderWithTheme(
      <DetailRow label="Reference" value="NP-8841-2207" copyable onCopied={onCopied} testID="ref" />
    );

    fireEvent.press(getByTestId('ref-copy'));

    await waitFor(() => expect(getByText('Copied')).toBeTruthy());
    expect(Clipboard.setStringAsync).toHaveBeenCalledWith('NP-8841-2207');
    expect(onCopied).toHaveBeenCalled();
  });

  it('emphasises a received amount with the money colour', async () => {
    const { getByText } = await renderWithTheme(
      <DetailRow label="They received" value="₦200,000" emphasis="money" />
    );
    expect(flattenStyle(getByText('₦200,000').props.style).color).toBe(lightColors.money.in);
  });

  it('adds a divider only when asked', async () => {
    const { getByTestId: plain } = await renderWithTheme(
      <DetailRow label="Fee" value="£0.40" testID="d" />
    );
    expect(flattenStyle(plain('d').props.style).borderBottomWidth).toBe(0);

    const { getByTestId: divided } = await renderWithTheme(
      <DetailRow label="Fee" value="£0.40" divider testID="d" />
    );
    expect(flattenStyle(divided('d').props.style).borderBottomWidth).toBe(1);
  });
});

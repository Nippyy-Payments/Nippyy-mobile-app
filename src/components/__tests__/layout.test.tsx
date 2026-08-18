import { View } from 'react-native';

import { Button } from '@/components/core/Button';
import { EmptyState } from '@/components/feedback/EmptyState';
import { InlineAlert } from '@/components/feedback/InlineAlert';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { ScreenTitle } from '@/components/core/ScreenTitle';
import { SectionLabel } from '@/components/core/SectionLabel';
import { lightColors } from '@/theme/tokens';
import { textStyles } from '@/theme/typography';
import { flattenStyle, fireEvent, renderWithTheme } from '@/test/render';

// Jest hoists jest.mock above declarations, so the factory may only close
// over names beginning with "mock".
const mockBack = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ back: mockBack }) }));

beforeEach(() => mockBack.mockClear());

describe('ScreenTitle vs ScreenHeader', () => {
  it('opens a root screen at 34px', async () => {
    const { getByText } = await renderWithTheme(<ScreenTitle>Activity</ScreenTitle>);
    expect(flattenStyle(getByText('Activity').props.style).fontSize).toBe(34);
  });

  it('titles a pushed screen at 20px', async () => {
    const { getByText } = await renderWithTheme(<ScreenHeader title="Review transfer" />);
    expect(flattenStyle(getByText('Review transfer').props.style).fontSize).toBe(20);
  });

  it('keeps the size gap that is the app’s only depth cue', () => {
    expect(textStyles.screenTitle.fontSize).toBeGreaterThan(textStyles.screenHeader.fontSize!);
  });

  it('renders a subhead only when given one', async () => {
    const { queryByText } = await renderWithTheme(<ScreenTitle>Your wallets</ScreenTitle>);
    expect(queryByText(/ready to send/i)).toBeNull();

    const { getByText } = await renderWithTheme(
      <ScreenTitle subhead="What you hold, ready to send home.">Your wallets</ScreenTitle>
    );
    expect(getByText('What you hold, ready to send home.')).toBeTruthy();
  });
});

describe('ScreenHeader', () => {
  it('routes back rather than replacing the platform gesture', async () => {
    const { getByTestId } = await renderWithTheme(<ScreenHeader title="Transfer" testID="hdr" />);

    fireEvent.press(getByTestId('hdr-back'));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('prefers an explicit onBack when one is given', async () => {
    const onBack = jest.fn();
    const { getByTestId } = await renderWithTheme(
      <ScreenHeader title="Devices & sessions" onBack={onBack} testID="hdr" />
    );

    fireEvent.press(getByTestId('hdr-back'));
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(mockBack).not.toHaveBeenCalled();
  });

  it('can omit the back target on a root screen', async () => {
    const { queryByTestId } = await renderWithTheme(
      <ScreenHeader title="Account" showBack={false} testID="hdr" />
    );
    expect(queryByTestId('hdr-back')).toBeNull();
  });

  it('gives the back target an accessible name', async () => {
    const { getByLabelText } = await renderWithTheme(<ScreenHeader title="Transfer" />);
    expect(getByLabelText('Back')).toBeTruthy();
  });

  it('renders a trailing action', async () => {
    const { getByTestId } = await renderWithTheme(
      <ScreenHeader title="Notifications" action={<View testID="action" />} />
    );
    expect(getByTestId('action')).toBeTruthy();
  });
});

describe('SectionLabel', () => {
  it('names a group in muted 13/600', async () => {
    const { getByText } = await renderWithTheme(<SectionLabel>Recent</SectionLabel>);
    const style = flattenStyle(getByText('Recent').props.style);

    expect(style.fontSize).toBe(13);
    expect(style.color).toBe(lightColors.text.muted);
  });

  it('takes a trailing action', async () => {
    const { getByText } = await renderWithTheme(
      <SectionLabel action={<Button variant="ghost" size="sm">See all</Button>}>
        Recent
      </SectionLabel>
    );
    expect(getByText('See all')).toBeTruthy();
  });

  it('accepts a custom node instead of a plain string', async () => {
    const { getByTestId } = await renderWithTheme(
      <SectionLabel>
        <View testID="custom" />
      </SectionLabel>
    );
    expect(getByTestId('custom')).toBeTruthy();
  });
});

describe('EmptyState', () => {
  it('states one heading and one line', async () => {
    const { getByText } = await renderWithTheme(
      <EmptyState
        title="Nothing here yet"
        body="Transfers, deposits and bill payments will show up here."
      />
    );

    expect(getByText('Nothing here yet')).toBeTruthy();
    expect(getByText('Transfers, deposits and bill payments will show up here.')).toBeTruthy();
  });

  it('is never a card — no border, no fill', async () => {
    const { getByTestId } = await renderWithTheme(
      <EmptyState title="Nothing yet" testID="empty" />
    );
    const style = flattenStyle(getByTestId('empty').props.style);

    expect(style.backgroundColor).toBeUndefined();
    expect(style.borderWidth).toBeUndefined();
  });

  it('takes fallback rows when the user has somewhere else to go', async () => {
    const { getByTestId } = await renderWithTheme(
      <EmptyState title="Coming soon">
        <View testID="fallback" />
      </EmptyState>
    );
    expect(getByTestId('fallback')).toBeTruthy();
  });
});

describe('InlineAlert', () => {
  it('tints to match its tone', async () => {
    const { getByTestId } = await renderWithTheme(
      <InlineAlert tone="danger" title="Not enough in your GBP wallet" testID="alert" />
    );
    const style = flattenStyle(getByTestId('alert').props.style);

    expect(style.backgroundColor).toBe(lightColors.status.dangerSoft);
    expect(style.borderColor).toBe(lightColors.status.dangerBorder);
  });

  it('colours the title with the tone, not the body colour', async () => {
    const { getByText } = await renderWithTheme(
      <InlineAlert tone="info" title="Why we ask" testID="alert" />
    );
    expect(flattenStyle(getByText('Why we ask').props.style).color).toBe(
      lightColors.status.infoText
    );
  });

  it('carries the fix alongside the problem', async () => {
    const { getByText } = await renderWithTheme(
      <InlineAlert
        tone="danger"
        title="Not enough in your GBP wallet"
        detail="You have £840.20. Add money or switch wallet."
        actions={
          <>
            <Button size="sm" variant="secondary">
              Add money
            </Button>
            <Button size="sm" variant="ghost">
              Switch wallet
            </Button>
          </>
        }
      />
    );

    expect(getByText('Add money')).toBeTruthy();
    expect(getByText('Switch wallet')).toBeTruthy();
  });

  it('announces itself as an alert', async () => {
    const { getByTestId } = await renderWithTheme(
      <InlineAlert title="Card top-ups carry a 1.4% fee" testID="alert" />
    );
    expect(getByTestId('alert').props.accessibilityRole).toBe('alert');
  });
});

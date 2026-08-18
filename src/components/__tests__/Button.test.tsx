import { View } from 'react-native';

import { Button } from '@/components/core/Button';
import { lightColors } from '@/theme/tokens';
import { flattenStyle, fireEvent, renderWithTheme } from '@/test/render';

describe('Button', () => {
  it('calls onPress when tapped', async () => {
    const onPress = jest.fn();
    const { getByText } = await renderWithTheme(<Button onPress={onPress}>Send money</Button>);

    fireEvent.press(getByText('Send money'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire when disabled', async () => {
    const onPress = jest.fn();
    const { getByText } = await renderWithTheme(
      <Button onPress={onPress} disabled>
        Enter 6 digits
      </Button>
    );

    fireEvent.press(getByText('Enter 6 digits'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not fire while loading', async () => {
    const onPress = jest.fn();
    const { getByText } = await renderWithTheme(
      <Button onPress={onPress} loading>
        Review transfer
      </Button>
    );

    fireEvent.press(getByText('Review transfer'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('exposes disabled and busy to assistive tech', async () => {
    const { getByRole } = await renderWithTheme(<Button loading>Sending</Button>);
    const state = getByRole('button').props.accessibilityState;

    expect(state.disabled).toBe(true);
    expect(state.busy).toBe(true);
  });

  it('replaces the leading icon with a spinner while loading', async () => {
    const { queryByTestId } = await renderWithTheme(
      <Button loading iconLeft={<View testID="leading-icon" />}>
        Sending
      </Button>
    );
    expect(queryByTestId('leading-icon')).toBeNull();
  });

  it('keeps the leading icon when not loading', async () => {
    const { queryByTestId } = await renderWithTheme(
      <Button iconLeft={<View testID="leading-icon" />}>Send money</Button>
    );
    expect(queryByTestId('leading-icon')).not.toBeNull();
  });

  it('fills with brand blue for the one primary action', async () => {
    const { getByTestId } = await renderWithTheme(
      <Button variant="primary" testID="cta">
        Send money
      </Button>
    );

    expect(flattenStyle(getByTestId('cta-surface').props.style).backgroundColor).toBe(
      lightColors.brand.default
    );
  });

  it('renders the quiet variant with red text, as the design intends', async () => {
    // Confirmed in PORTING_PLAN.md §8.9 — "Log out" really is red.
    const { getByText } = await renderWithTheme(<Button variant="quiet">Log out</Button>);
    expect(flattenStyle(getByText('Log out').props.style).color).toBe(
      lightColors.status.dangerText
    );
  });

  it('carries no shadow — elevation is off across this system', async () => {
    const { getByTestId } = await renderWithTheme(<Button testID="cta">Send money</Button>);
    const style = flattenStyle(getByTestId('cta-surface').props.style);

    expect(style.shadowOpacity).toBeUndefined();
    expect(style.elevation).toBeUndefined();
    expect(style.shadowRadius).toBeUndefined();
  });

  it('sizes from tokens rather than literals', async () => {
    const { getByTestId } = await renderWithTheme(
      <Button size="lg" testID="cta">
        Get started
      </Button>
    );
    const style = flattenStyle(getByTestId('cta-surface').props.style);

    expect(style.height).toBe(56);
    expect(style.borderRadius).toBe(16);
  });

  it('fades rather than restyles when disabled', async () => {
    const { getByTestId } = await renderWithTheme(
      <Button disabled testID="cta">
        Enter 6 digits
      </Button>
    );
    expect(flattenStyle(getByTestId('cta-surface').props.style).opacity).toBe(0.5);
  });
});

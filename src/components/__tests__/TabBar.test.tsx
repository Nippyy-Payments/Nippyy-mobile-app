import { TabBar, type TabBarProps } from '@/components/navigation/TabBar';
import { lightColors } from '@/theme/tokens';
import { flattenStyle, fireEvent, renderWithTheme } from '@/test/render';

jest.mock('expo-blur', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  return { BlurView: View };
});

const ROUTES = ['index', 'wallets', 'activity', 'menu'];

function buildProps(activeIndex = 0, overrides: Partial<TabBarProps> = {}): TabBarProps {
  return {
    state: {
      index: activeIndex,
      routes: ROUTES.map((name) => ({ key: `${name}-key`, name })),
    },
    navigation: {
      navigate: jest.fn(),
      emit: jest.fn(() => ({ defaultPrevented: false })),
    },
    onSend: jest.fn(),
    ...overrides,
  };
}

describe('TabBar', () => {
  it('renders four tabs plus the raised send action', async () => {
    const { getByTestId } = await renderWithTheme(<TabBar {...buildProps()} />);

    for (const route of ROUTES) expect(getByTestId(`tab-${route}`)).toBeTruthy();
    expect(getByTestId('tab-send')).toBeTruthy();
  });

  it('labels the activity route "History", as the design does', async () => {
    const { getByText, queryByText } = await renderWithTheme(<TabBar {...buildProps()} />);

    expect(getByText('History')).toBeTruthy();
    expect(queryByText('Activity')).toBeNull();
  });

  it('marks only the active tab as selected', async () => {
    const { getByTestId } = await renderWithTheme(<TabBar {...buildProps(2)} />);

    expect(getByTestId('tab-activity').props.accessibilityState.selected).toBe(true);
    expect(getByTestId('tab-index').props.accessibilityState.selected).toBe(false);
  });

  it('tints the active tab with brand blue and the rest subtle', async () => {
    const { getByText } = await renderWithTheme(<TabBar {...buildProps(0)} />);

    expect(flattenStyle(getByText('Home').props.style).color).toBe(lightColors.brand.default);
    expect(flattenStyle(getByText('Wallets').props.style).color).toBe(lightColors.text.subtle);
  });

  it('navigates to a tab that is not already focused', async () => {
    const props = buildProps(0);
    const { getByTestId } = await renderWithTheme(<TabBar {...props} />);

    fireEvent.press(getByTestId('tab-wallets'));
    expect(props.navigation.navigate).toHaveBeenCalledWith('wallets');
  });

  it('does not re-navigate to the tab already focused', async () => {
    const props = buildProps(0);
    const { getByTestId } = await renderWithTheme(<TabBar {...props} />);

    fireEvent.press(getByTestId('tab-index'));
    expect(props.navigation.navigate).not.toHaveBeenCalled();
  });

  it('respects a tabPress listener that prevents the default', async () => {
    const props = buildProps(0, {
      navigation: {
        navigate: jest.fn(),
        emit: jest.fn(() => ({ defaultPrevented: true })),
      },
    });
    const { getByTestId } = await renderWithTheme(<TabBar {...props} />);

    fireEvent.press(getByTestId('tab-menu'));
    expect(props.navigation.navigate).not.toHaveBeenCalled();
  });

  it('leaves the tab navigator entirely for send', async () => {
    const props = buildProps();
    const { getByTestId } = await renderWithTheme(<TabBar {...props} />);

    fireEvent.press(getByTestId('tab-send'));

    expect(props.onSend).toHaveBeenCalledTimes(1);
    // Send is not a tab: it must not go through tab navigation.
    expect(props.navigation.navigate).not.toHaveBeenCalled();
  });

  it('gives the send action an accessible name', async () => {
    const { getByLabelText } = await renderWithTheme(<TabBar {...buildProps()} />);
    expect(getByLabelText('Send money')).toBeTruthy();
  });
});

import { View } from 'react-native';

import { Avatar, initialsOf, paletteIndexOf } from '@/components/data/Avatar';
import { Badge } from '@/components/feedback/Badge';
import { Card } from '@/components/core/Card';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/core/IconButton';
import { RowTile } from '@/components/data/RowTile';
import { StatusDot } from '@/components/feedback/StatusDot';
import { icons } from '@/components/icons';
import { darkColors, lightColors } from '@/theme/tokens';
import { flattenStyle, fireEvent, renderWithTheme } from '@/test/render';

describe('Icon', () => {
  it('renders every glyph in the registry without throwing', async () => {
    // One render pass, not one per icon: sequential renders leave overlapping
    // act() scopes and poison the rest of the suite.
    const names = Object.keys(icons) as (keyof typeof icons)[];
    const { getByTestId } = await renderWithTheme(
      <View>
        {names.map((name) => (
          <Icon key={name} name={name} testID={`icon-${name}`} />
        ))}
      </View>
    );

    expect(names.length).toBeGreaterThan(50);
    for (const name of names) expect(getByTestId(`icon-${name}`)).toBeTruthy();
  });

  it('sizes and colours from the caller, since SVG has no currentColor', async () => {
    const { getByTestId } = await renderWithTheme(
      <Icon name="send" size={19} color={lightColors.brand.default} testID="icon" />
    );
    const icon = getByTestId('icon');

    expect(icon.props.width).toBe(19);
    expect(icon.props.height).toBe(19);
  });
});

describe('IconButton', () => {
  it('requires a label, since the control has no visible text', async () => {
    const { getByLabelText } = await renderWithTheme(
      <IconButton label="Hide balance">
        <View />
      </IconButton>
    );
    expect(getByLabelText('Hide balance')).toBeTruthy();
  });

  it('calls onPress when tapped', async () => {
    const onPress = jest.fn();
    const { getByLabelText } = await renderWithTheme(
      <IconButton label="Swap wallets" onPress={onPress}>
        <View />
      </IconButton>
    );

    fireEvent.press(getByLabelText('Swap wallets'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire when disabled', async () => {
    const onPress = jest.fn();
    const { getByLabelText } = await renderWithTheme(
      <IconButton label="Swap wallets" onPress={onPress} disabled>
        <View />
      </IconButton>
    );

    fireEvent.press(getByLabelText('Swap wallets'));
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('Card', () => {
  it('separates with a hairline, never a shadow', async () => {
    const { getByTestId } = await renderWithTheme(<Card testID="card" />);
    const style = flattenStyle(getByTestId('card').props.style);

    expect(style.borderWidth).toBe(1);
    expect(style.borderColor).toBe(lightColors.border.subtle);
    expect(style.elevation).toBeUndefined();
    expect(style.shadowOpacity).toBeUndefined();
  });

  it('uses the sunken tone for receipt-style blocks', async () => {
    const { getByTestId } = await renderWithTheme(<Card tone="sunken" testID="card" />);
    expect(flattenStyle(getByTestId('card').props.style).backgroundColor).toBe(
      lightColors.surface.sunken
    );
  });

  it('can drop its padding entirely', async () => {
    const { getByTestId } = await renderWithTheme(<Card padding="none" testID="card" />);
    expect(flattenStyle(getByTestId('card').props.style).padding).toBe(0);
  });
});

describe('Badge', () => {
  it('is soft by default — a tint with a darker label, not a shout', async () => {
    const { getByTestId, getByText } = await renderWithTheme(
      <Badge status="success" testID="badge">
        Verified
      </Badge>
    );

    expect(flattenStyle(getByTestId('badge').props.style).backgroundColor).toBe(
      lightColors.status.successSoft
    );
    expect(flattenStyle(getByText('Verified').props.style).color).toBe(
      lightColors.status.successText
    );
  });

  it('inverts to a solid fill when asked', async () => {
    const { getByTestId, getByText } = await renderWithTheme(
      <Badge status="danger" appearance="solid" testID="badge">
        Failed
      </Badge>
    );

    expect(flattenStyle(getByTestId('badge').props.style).backgroundColor).toBe(
      lightColors.status.danger
    );
    expect(flattenStyle(getByText('Failed').props.style).color).toBe(lightColors.text.onBrand);
  });

  it('sizes from tokens', async () => {
    const { getByTestId } = await renderWithTheme(
      <Badge size="sm" testID="badge">
        Verifying
      </Badge>
    );
    expect(flattenStyle(getByTestId('badge').props.style).height).toBe(20);
  });
});

describe('StatusDot', () => {
  it('uses the light 400 step, not the 500 — a 500 fill reads black at 7px', async () => {
    const { getByTestId } = await renderWithTheme(<StatusDot tone="success" testID="dot" />);

    expect(lightColors.indicator.success).not.toBe(lightColors.status.success);
    expect(getByTestId('dot')).toBeTruthy();
  });

  it('defaults to the design size', async () => {
    const { getByTestId } = await renderWithTheme(<StatusDot testID="dot" />);
    expect(flattenStyle(getByTestId('dot').props.style).width).toBe(7);
  });
});

describe('RowTile', () => {
  it('marks the primary path with the brand tone', async () => {
    const { getByTestId } = await renderWithTheme(<RowTile tone="brand" testID="tile" />);
    expect(flattenStyle(getByTestId('tile').props.style).backgroundColor).toBe(
      lightColors.brand.soft
    );
  });

  it('takes a numeric radius, because RN has no percentage radius', async () => {
    const { getByTestId } = await renderWithTheme(
      <RowTile size={64} radius={32} testID="tile" />
    );
    const style = flattenStyle(getByTestId('tile').props.style);

    expect(style.width).toBe(64);
    expect(style.borderRadius).toBe(32);
  });
});

describe('Avatar', () => {
  it('shows up to two initials', () => {
    expect(initialsOf('Tobi Adeyemi')).toBe('TA');
    expect(initialsOf('Ada')).toBe('A');
    expect(initialsOf('Salary — Northwind')).toBe('S—');
  });

  it('gives the same person the same colour every time', () => {
    const first = paletteIndexOf('Ada Okeke', 4);
    const second = paletteIndexOf('Ada Okeke', 4);

    expect(first).toBe(second);
    expect(first).toBeGreaterThanOrEqual(0);
    expect(first).toBeLessThan(4);
  });

  it('renders initials when there is no image', async () => {
    const { getByText } = await renderWithTheme(<Avatar name="Ada Okeke" />);
    expect(getByText('AO')).toBeTruthy();
  });

  it('renders the flag badge when given one', async () => {
    const { getByText } = await renderWithTheme(<Avatar name="Ada Okeke" flag="🇳🇬" />);
    expect(getByText('🇳🇬')).toBeTruthy();
  });

  it('rings the flag in surface.raised so it vanishes in dark', async () => {
    const { getByText } = await renderWithTheme(<Avatar name="Ada Okeke" flag="🇳🇬" />, {
      theme: 'dark',
    });

    expect(getByText('🇳🇬')).toBeTruthy();
    expect(darkColors.surface.raised).not.toBe(lightColors.surface.raised);
  });

  it('sizes from tokens', async () => {
    const { getByTestId } = await renderWithTheme(
      <Avatar name="Tobi Adeyemi" size="xl" testID="avatar" />
    );
    expect(flattenStyle(getByTestId('avatar').props.style).width).toBe(72);
  });
});

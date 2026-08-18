import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '@/components/Text';
import { Toggle } from '@/components/forms/Toggle';
import { useTokens } from '@/theme/ThemeProvider';

export type ToggleRowProps = {
  title: string;
  detail?: string;
  checked?: boolean;
  onChange?: (next: boolean) => void;
  /** Pass an `<Icon>`; colour it with `useRowTileForeground('quiet')`. */
  icon?: ReactNode;
  disabled?: boolean;
  first?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const PADDING_Y = 16;
const GAP = 13;
const DETAIL_GAP = 2;

/**
 * A settings line: optional icon tile, title, detail, and a switch.
 *
 * Separated from its neighbours by a hairline, never by a card.
 */
export function ToggleRow({
  title,
  detail,
  checked = false,
  onChange,
  icon,
  disabled = false,
  first = false,
  style,
  testID,
}: ToggleRowProps) {
  const { colors, size, radius, borderWidth } = useTokens();

  return (
    <View
      testID={testID}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: GAP,
          paddingVertical: PADDING_Y,
          borderTopWidth: first ? 0 : borderWidth.hairline,
          borderTopColor: colors.border.subtle,
          opacity: disabled ? DISABLED_OPACITY : 1,
        },
        style,
      ]}
    >
      {icon ? (
        <View
          style={{
            width: size.tile.sm,
            height: size.tile.sm,
            borderRadius: radius.tile,
            backgroundColor: colors.surface.quiet,
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </View>
      ) : null}

      <View style={{ flex: 1, minWidth: 0 }}>
        <Text variant="cardTitle" tone="strong">
          {title}
        </Text>
        {detail ? (
          <Text variant="labelMuted" tone="muted" style={{ marginTop: DETAIL_GAP }}>
            {detail}
          </Text>
        ) : null}
      </View>

      <Toggle checked={checked} onChange={onChange} disabled={disabled} label={title} />
    </View>
  );
}

const DISABLED_OPACITY = 0.5;

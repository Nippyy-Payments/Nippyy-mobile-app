import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '@/components/Text';
import { useTokens } from '@/theme/ThemeProvider';
import { tabularNums } from '@/theme/tokens';
import type { TypeVariant } from '@/theme/typography';

export type ChipOption = string | { key: string; label: string };

/**
 * `tone` picks the selected treatment: `ink` for filters, where the chip
 * states a view, and `brand` for preset amounts and reason chips, where the
 * selection is an input and can be cleared by tapping again.
 */
export type ChipTone = 'ink' | 'brand';
export type ChipSize = 'sm' | 'md' | 'lg';

export type ChipGroupProps = {
  options: ChipOption[];
  value?: string | null;
  onChange?: (next: string | null) => void;
  align?: 'start' | 'center';
  /** Renders labels in tabular figures — for preset amounts. */
  numeric?: boolean;
  tone?: ChipTone;
  size?: ChipSize;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const PADDING: Record<ChipSize, number> = { sm: 12, md: 14, lg: 14 };
const TYPE_BY_SIZE: Record<ChipSize, TypeVariant> = {
  sm: 'captionStrong',
  md: 'captionStrong',
  lg: 'label',
};
const GAP = 8;

const keyOf = (option: ChipOption) => (typeof option === 'string' ? option : option.key);
const labelOf = (option: ChipOption) => (typeof option === 'string' ? option : option.label);

/**
 * The pill row for history filters, preset amounts and short reason lists.
 *
 * Selected chips fill; the rest sit outlined on the page. A `brand` chip is
 * deselectable because it represents an input the user can clear; an `ink`
 * filter always leaves one option active.
 */
export function ChipGroup({
  options,
  value,
  onChange,
  align = 'start',
  numeric = false,
  tone = 'ink',
  size = 'md',
  style,
  testID,
}: ChipGroupProps) {
  const { colors, size: sizes, radii, borderWidth } = useTokens();

  return (
    <View
      testID={testID}
      style={[
        {
          flexDirection: 'row',
          flexWrap: 'wrap',
          columnGap: GAP,
          rowGap: GAP,
          justifyContent: align === 'center' ? 'center' : 'flex-start',
        },
        style,
      ]}
    >
      {options.map((option) => {
        const key = keyOf(option);
        const selected = value === key;

        const selectedStyle =
          tone === 'brand'
            ? {
                backgroundColor: colors.brand.soft,
                color: colors.status.infoText,
                borderColor: colors.border.brand,
              }
            : {
                backgroundColor: colors.surface.ink,
                color: colors.text.onInk,
                borderColor: 'transparent',
              };

        const resolved = selected
          ? selectedStyle
          : {
              backgroundColor: 'transparent',
              color: colors.text.body,
              borderColor: colors.border.default,
            };

        return (
          <Pressable
            key={key}
            onPress={() => onChange?.(selected && tone === 'brand' ? null : key)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={labelOf(option)}
            testID={`chip-${key}`}
            style={{
              height: sizes.chip[size],
              paddingHorizontal: PADDING[size],
              borderRadius: radii.pill,
              borderWidth: borderWidth.strong,
              borderColor: resolved.borderColor,
              backgroundColor: resolved.backgroundColor,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              variant={TYPE_BY_SIZE[size]}
              numberOfLines={1}
              style={{
                color: resolved.color,
                ...(numeric ? { fontVariant: [...tabularNums] } : null),
              }}
            >
              {labelOf(option)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

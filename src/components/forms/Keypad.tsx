import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { useTokens } from '@/theme/ThemeProvider';

/** `back` deletes the last character; `.` is only present on decimal pads. */
export type KeypadKey = string;

export type KeypadProps = {
  onKey?: (key: KeypadKey) => void;
  /** Off for OTP and PIN entry, where a decimal point is meaningless. */
  decimal?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const GAP = 4;
const PADDING = 4;
const BACK_GLYPH = 22;
const BACK_STROKE = 2;

/**
 * The numeric pad for amount, OTP and PIN entry.
 *
 * Deliberately chrome-free: transparent keys on the page surface that tint
 * only while pressed.
 *
 * The design lays this out as a CSS grid. Here it is four rows of three
 * `flex: 1` cells — not `flexWrap` with percentage widths, which drifts at
 * odd container widths.
 */
export function Keypad({ onKey, decimal = true, style, testID }: KeypadProps) {
  const { colors, size, radius, typography } = useTokens();

  const rows: (KeypadKey | null)[][] = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    [decimal ? '.' : null, '0', 'back'],
  ];

  return (
    <View
      testID={testID}
      style={[{ rowGap: GAP, paddingHorizontal: PADDING, paddingTop: PADDING }, style]}
    >
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: 'row', columnGap: GAP }}>
          {row.map((key, columnIndex) => {
            if (key === null) {
              return <View key={`spacer-${columnIndex}`} style={{ flex: 1 }} />;
            }

            const isDot = key === '.';
            const isBack = key === 'back';

            return (
              <Pressable
                key={key}
                onPress={() => onKey?.(key)}
                accessibilityRole="button"
                accessibilityLabel={isBack ? 'Delete' : key}
                testID={`key-${key}`}
                style={({ pressed }) => ({
                  flex: 1,
                  height: size.keypadKey,
                  borderRadius: radius.field,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: pressed ? colors.surface.sunken : 'transparent',
                })}
              >
                {isBack ? (
                  <Icon
                    name="backspace"
                    size={BACK_GLYPH}
                    strokeWidth={BACK_STROKE}
                    color={colors.text.muted}
                  />
                ) : (
                  <Text
                    variant={isDot ? 'keypadDot' : 'keypadKey'}
                    style={{
                      color: isDot ? colors.text.muted : colors.text.strong,
                      lineHeight: typography.keypadKey.lineHeight,
                    }}
                  >
                    {key}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

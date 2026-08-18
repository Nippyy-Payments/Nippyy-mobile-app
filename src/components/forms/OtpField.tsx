import { View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '@/components/Text';
import { useTokens } from '@/theme/ThemeProvider';

export type OtpFieldProps = {
  value?: string;
  length?: number;
  /** Renders dots instead of boxes — the 4-digit PIN form. */
  mask?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const BOX_GAP = 8;
const DOT_GAP = 14;

/**
 * A row of code boxes for a 6-digit OTP, or dots for a 4-digit PIN.
 *
 * Display-only: the value comes from the `Keypad`, not from focus. The next
 * empty box carries the brand border, so the caret position is obvious
 * without a caret.
 */
export function OtpField({ value = '', length = 6, mask = false, style, testID }: OtpFieldProps) {
  const { colors, size, radius, borderWidth } = useTokens();

  const characters = String(value).slice(0, length).split('');
  const slots = Array.from({ length }, (_, index) => index);

  if (mask) {
    return (
      <View
        testID={testID}
        accessibilityRole="text"
        accessibilityLabel={`${characters.length} of ${length} digits entered`}
        style={[
          { flexDirection: 'row', columnGap: DOT_GAP, justifyContent: 'center' },
          style,
        ]}
      >
        {slots.map((index) => (
          <View
            key={index}
            testID={`pin-dot-${index}`}
            style={{
              width: size.pinDot,
              height: size.pinDot,
              borderRadius: size.pinDot / 2,
              backgroundColor:
                index < characters.length ? colors.brand.default : colors.control.trackOff,
            }}
          />
        ))}
      </View>
    );
  }

  return (
    <View
      testID={testID}
      accessibilityRole="text"
      accessibilityLabel={`${characters.length} of ${length} digits entered`}
      style={[{ flexDirection: 'row', columnGap: BOX_GAP, justifyContent: 'center' }, style]}
    >
      {slots.map((index) => {
        const filled = index < characters.length;
        const isNext = index === characters.length;

        return (
          <View
            key={index}
            testID={`otp-box-${index}`}
            style={{
              width: size.otpBox.width,
              height: size.otpBox.height,
              borderRadius: radius.field,
              borderWidth: borderWidth.strong,
              borderColor: isNext
                ? colors.border.brand
                : filled
                  ? colors.border.default
                  : colors.border.subtle,
              backgroundColor: filled ? colors.surface.quiet : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text variant="otpDigit" tone="strong">
              {characters[index] ?? ''}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

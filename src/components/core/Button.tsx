import { useEffect, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/Text';
import { useTokens } from '@/theme/ThemeProvider';
import type { TypeVariant } from '@/theme/typography';

/**
 * `primary` is nippyy blue, `ink` is navy for confirm-with-biometrics steps,
 * `secondary` a soft blue fill, `outline` and `ghost` for quiet actions,
 * `danger` for destructive confirmation.
 *
 * `quiet` is a soft fill with RED text. It reads odd next to "Log out", but
 * that is the design's intent and was confirmed — see PORTING_PLAN.md §8.9.
 */
export type ButtonVariant =
  | 'primary'
  | 'ink'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'quiet';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  /**
   * Applied to the pressable. The painted surface is a child (it carries the
   * press animation), and is exposed as `<testID>-surface` so a test can
   * assert its fill, radius and height.
   */
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

const TYPE_BY_SIZE: Record<ButtonSize, TypeVariant> = {
  sm: 'buttonSm',
  md: 'buttonMd',
  lg: 'buttonLg',
};

/** Horizontal padding and inner gap per size, from the design. */
const PADDING: Record<ButtonSize, number> = { sm: 16, md: 22, lg: 30 };
const GAP: Record<ButtonSize, number> = { sm: 6, md: 8, lg: 10 };

/**
 * The action control. One filled button per screen; alternatives sit below it
 * in ghost or outline.
 *
 * Presses shrink to 0.97. There is no shadow — elevation is off across this
 * system, and depth comes from tone and hairlines.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  iconLeft,
  iconRight,
  onPress,
  accessibilityLabel,
  testID,
  style,
}: ButtonProps) {
  const { colors, size: sizes, radius, borderWidth, motion, duration, easing } = useTokens();

  const isOff = disabled || loading;
  const pressed = useSharedValue(0);

  const variants: Record<ButtonVariant, { background: string; color: string; border: string }> = {
    primary: { background: colors.brand.default, color: colors.text.onBrand, border: 'transparent' },
    ink: { background: colors.surface.ink, color: colors.text.onInk, border: 'transparent' },
    secondary: { background: colors.brand.soft, color: colors.status.infoText, border: 'transparent' },
    outline: { background: 'transparent', color: colors.text.strong, border: colors.border.default },
    ghost: { background: 'transparent', color: colors.status.infoText, border: 'transparent' },
    danger: { background: colors.status.danger, color: colors.text.onBrand, border: 'transparent' },
    quiet: { background: colors.surface.quiet, color: colors.status.dangerText, border: 'transparent' },
  };

  const tone = variants[variant];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(pressed.value === 1 ? motion.pressScale : 1, {
          duration: duration.fast,
          easing: Easing.bezier(...easing.out),
        }),
      },
    ],
  }));

  return (
    <Pressable
      onPress={isOff ? undefined : onPress}
      onPressIn={() => {
        pressed.value = 1;
      }}
      onPressOut={() => {
        pressed.value = 0;
      }}
      disabled={isOff}
      accessibilityRole="button"
      accessibilityState={{ disabled: isOff, busy: loading }}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={fullWidth ? styles.fullWidth : styles.auto}
    >
      <Animated.View
        testID={testID ? `${testID}-surface` : undefined}
        style={[
          styles.base,
          {
            height: sizes.button[size],
            paddingHorizontal: PADDING[size],
            columnGap: GAP[size],
            borderRadius: radius.button[size],
            backgroundColor: tone.background,
            borderWidth: borderWidth.strong,
            borderColor: tone.border,
            opacity: isOff ? DISABLED_OPACITY : 1,
            width: fullWidth ? '100%' : undefined,
          },
          animatedStyle,
          style,
        ]}
      >
        {loading ? <Spinner color={tone.color} size={size} /> : iconLeft}
        {children != null && (
          <Text variant={TYPE_BY_SIZE[size]} style={{ color: tone.color }} numberOfLines={1}>
            {children}
          </Text>
        )}
        {loading ? null : iconRight}
      </Animated.View>
    </Pressable>
  );
}

/** The design fades a disabled control rather than restyling it. */
const DISABLED_OPACITY = 0.5;

/** Spinner diameter relative to the button's type size. */
const SPINNER_RATIO = 1;

/** One full rotation. The source spins at 0.7s linear. */
const SPINNER_PERIOD = 700;

function Spinner({ color, size }: { color: string; size: ButtonSize }) {
  const { typography } = useTokens();
  const spin = useSharedValue(0);

  const dimension = typography.button[size].fontSize * SPINNER_RATIO;

  useEffect(() => {
    spin.value = withRepeat(
      withTiming(1, { duration: SPINNER_PERIOD, easing: Easing.linear }),
      -1,
      false
    );
  }, [spin]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value * 360}deg` }],
  }));

  return (
    <Animated.View
      accessibilityRole="progressbar"
      style={[
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          borderWidth: 2,
          borderColor: color,
          borderTopColor: 'transparent',
        },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // Hover brightness is web-only; native uses the press scale above.
    ...Platform.select({ web: { cursor: 'pointer' }, default: {} }),
  },
  fullWidth: { width: '100%' },
  auto: { alignSelf: 'flex-start' },
});

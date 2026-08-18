import type { ReactNode } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useTokens } from '@/theme/ThemeProvider';

export type IconButtonVariant = 'soft' | 'quiet' | 'sunken' | 'ghost' | 'solid' | 'ink';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export type IconButtonProps = {
  children?: ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  shape?: 'rounded' | 'circle';
  disabled?: boolean;
  /** Required: these controls have no visible text. */
  label: string;
  onPress?: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * A single-icon control: header actions, the send-again button on a recipient
 * row, the eye toggle beside the balance, stepper buttons.
 *
 * The default 42px clears the 44px tap minimum once its surrounding gap is
 * counted. Presses shrink harder than a Button's — 0.92 against 0.97.
 */
export function IconButton({
  children,
  variant = 'soft',
  size = 'md',
  shape = 'rounded',
  disabled = false,
  label,
  onPress,
  testID,
  style,
}: IconButtonProps) {
  const { colors, size: sizes, radius, motion, duration, easing } = useTokens();

  const dimension = sizes.iconButton[size];
  const pressed = useSharedValue(0);

  const variants: Record<IconButtonVariant, string> = {
    soft: colors.brand.soft,
    quiet: colors.surface.quiet,
    sunken: colors.surface.sunken,
    ghost: 'transparent',
    solid: colors.brand.default,
    ink: colors.surface.ink,
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(pressed.value === 1 ? motion.pressScaleIcon : 1, {
          duration: duration.fast,
          easing: Easing.bezier(...easing.out),
        }),
      },
    ],
  }));

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={() => {
        pressed.value = 1;
      }}
      onPressOut={() => {
        pressed.value = 0;
      }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      testID={testID}
      style={styles.wrapper}
    >
      <Animated.View
        style={[
          styles.base,
          {
            width: dimension,
            height: dimension,
            backgroundColor: variants[variant],
            borderRadius: shape === 'circle' ? dimension / 2 : radius.field,
            opacity: disabled ? DISABLED_OPACITY : 1,
          },
          animatedStyle,
          style,
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

const DISABLED_OPACITY = 0.5;

/**
 * Foreground colour for each variant. Icons take no colour from their parent
 * in React Native, so callers pass this to `Icon`.
 */
export function useIconButtonForeground(variant: IconButtonVariant = 'soft'): string {
  const { colors } = useTokens();

  const foregrounds: Record<IconButtonVariant, string> = {
    soft: colors.status.infoText,
    quiet: colors.text.muted,
    sunken: colors.text.body,
    ghost: colors.text.strong,
    solid: colors.text.onBrand,
    ink: colors.text.onInk,
  };

  return foregrounds[variant];
}

const styles = StyleSheet.create({
  wrapper: { alignSelf: 'flex-start' },
  base: { alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
});

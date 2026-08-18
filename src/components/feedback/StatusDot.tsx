import { useEffect } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useTokens } from '@/theme/ThemeProvider';

export type StatusTone = 'success' | 'pending' | 'danger' | 'brand' | 'neutral';

export type StatusDotProps = {
  tone?: StatusTone;
  size?: number;
  /** The cyan ring used on an in-flight step. */
  pulse?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * How far the pulse ring spreads past the dot, per the source's 9px shadow
 * spread, and the opacity it starts at.
 */
const RING_SPREAD = 9;
const RING_OPACITY = 0.45;

/**
 * The small filled circle that marks a live rate, an unread notification or a
 * connection state.
 *
 * Uses the light `400` steps of green and amber deliberately: at 6-8px a
 * 500-weight fill reads almost black, which is the entire reason those steps
 * exist.
 */
export function StatusDot({ tone = 'success', size, pulse = false, style, testID }: StatusDotProps) {
  const { colors, size: sizes, duration, easing } = useTokens();

  const dimension = size ?? sizes.dot;

  const tones: Record<StatusTone, string> = {
    success: colors.indicator.success,
    pending: colors.indicator.pending,
    danger: colors.indicator.danger,
    brand: colors.indicator.brand,
    neutral: colors.indicator.neutral,
  };

  const progress = useSharedValue(0);

  useEffect(() => {
    if (!pulse) return;
    progress.value = withRepeat(
      withTiming(1, { duration: duration.pulse, easing: Easing.bezier(...easing.out) }),
      -1,
      false
    );
  }, [pulse, progress, duration.pulse, easing.out]);

  // The source animates box-shadow spread, which RN cannot express. An
  // expanding, fading ring behind the dot reads identically.
  const ringStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [RING_OPACITY, 0]),
    transform: [
      { scale: interpolate(progress.value, [0, 1], [1, (dimension + RING_SPREAD * 2) / dimension]) },
    ],
  }));

  return (
    <View
      testID={testID}
      style={[{ width: dimension, height: dimension, flexShrink: 0 }, style]}
    >
      {pulse && (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
              backgroundColor: tones[tone],
            },
            ringStyle,
          ]}
        />
      )}
      <View
        style={{
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor: tones[tone],
        }}
      />
    </View>
  );
}

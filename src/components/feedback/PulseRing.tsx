import { useEffect } from 'react';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useTokens } from '@/theme/ThemeProvider';

export type PulseRingProps = {
  /** Diameter of the element the ring expands from. */
  size: number;
  /** How far past the element the ring spreads at its widest. */
  spread?: number;
  color?: string;
  active?: boolean;
};

const DEFAULT_SPREAD = 9;
const START_OPACITY = 0.45;

/**
 * The expanding cyan ring that marks a live step.
 *
 * The design animates `box-shadow` spread, which React Native cannot express
 * at all — spread is not a shadow property here. A sibling circle that scales
 * up and fades out reads identically and composes anywhere.
 *
 * Absolutely positioned, so the parent must be the size of the element being
 * pulsed and must not clip its overflow.
 */
export function PulseRing({ size, spread = DEFAULT_SPREAD, color, active = true }: PulseRingProps) {
  const { colors, duration, easing } = useTokens();
  const reducedMotion = useReducedMotion();

  const progress = useSharedValue(0);
  const shouldAnimate = active && !reducedMotion;

  useEffect(() => {
    if (!shouldAnimate) {
      progress.value = 0;
      return;
    }
    progress.value = withRepeat(
      withTiming(1, { duration: duration.pulse, easing: Easing.bezier(...easing.out) }),
      -1,
      false
    );
  }, [shouldAnimate, progress, duration.pulse, easing.out]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [START_OPACITY, 0]),
    transform: [{ scale: interpolate(progress.value, [0, 1], [1, (size + spread * 2) / size]) }],
  }));

  if (!shouldAnimate) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color ?? colors.brand.default,
        },
        animatedStyle,
      ]}
    />
  );
}

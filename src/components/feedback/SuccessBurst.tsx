import { useEffect } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Icon } from '@/components/Icon';
import { useTokens } from '@/theme/ThemeProvider';

export type SuccessBurstTone = 'success' | 'brand';

export type SuccessBurstProps = {
  size?: number;
  tone?: SuccessBurstTone;
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** Ring, core and check are proportions of the overall size. */
const RING_RATIO = 0.81;
const CORE_RATIO = 0.56;
const CHECK_RATIO = 0.55;
const CHECK_STROKE = 3;

/**
 * The concentric green mark that opens every success screen: money sent, bill
 * paid, verification approved.
 *
 * The app draws this inline 22 times. It is the one genuinely celebratory
 * moment in an otherwise quiet interface, so it stays consistent.
 *
 * CSS animates it with a spring keyframe (0.4 → 1.08 → 1). Reanimated has no
 * keyframes, so the same shape is expressed as a two-step sequence on the
 * spring easing.
 */
export function SuccessBurst({
  size,
  tone = 'success',
  animate = true,
  style,
  testID,
}: SuccessBurstProps) {
  const { colors, size: sizes, duration, easing, motion } = useTokens();
  const reducedMotion = useReducedMotion();

  const dimension = size ?? sizes.successBurst;
  const ring = dimension * RING_RATIO;
  const core = dimension * CORE_RATIO;

  const tones =
    tone === 'brand'
      ? { ring: colors.brand.soft, core: colors.brand.default }
      : { ring: colors.status.successSoft, core: colors.status.success };

  const shouldAnimate = animate && !reducedMotion;
  const scale = useSharedValue(shouldAnimate ? motion.pop.from : motion.pop.to);
  const opacity = useSharedValue(shouldAnimate ? 0 : 1);

  useEffect(() => {
    if (!shouldAnimate) {
      scale.value = motion.pop.to;
      opacity.value = 1;
      return;
    }

    const curve = Easing.bezier(...easing.spring);
    opacity.value = withTiming(1, { duration: duration.fast, easing: curve });
    scale.value = withSequence(
      withTiming(motion.pop.overshoot, { duration: duration.base, easing: curve }),
      withTiming(motion.pop.to, { duration: duration.slow - duration.base, easing: curve })
    );
  }, [shouldAnimate, scale, opacity, duration, easing.spring, motion.pop]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      testID={testID}
      accessibilityRole="image"
      accessibilityLabel="Success"
      style={[
        {
          width: dimension,
          height: dimension,
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        },
        animatedStyle,
        style,
      ]}
    >
      <View
        style={{
          width: ring,
          height: ring,
          borderRadius: ring / 2,
          backgroundColor: tones.ring,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: core,
            height: core,
            borderRadius: core / 2,
            backgroundColor: tones.core,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon
            name="checkMark"
            size={core * CHECK_RATIO}
            strokeWidth={CHECK_STROKE}
            color={colors.text.onBrand}
          />
        </View>
      </View>
    </Animated.View>
  );
}

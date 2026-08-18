import { useEffect } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useTokens } from '@/theme/ThemeProvider';

export type ProgressVariant = 'continuous' | 'segmented';

export type ProgressTrackProps = {
  value?: number;
  total?: number;
  /**
   * `continuous` is one track with a proportional fill (tier progress);
   * `segmented` is one pill per step, so the count stays readable
   * (verification).
   */
  variant?: ProgressVariant;
  height?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const SEGMENT_GAP = 5;

/**
 * The thin bar showing how far through a multi-step requirement the user is.
 *
 * The fill is amber while steps are outstanding and green once complete — a
 * bar that stayed brand-coloured would say nothing about whether the user is
 * done.
 *
 * In the segmented form that rule falls out of the step colours: completed
 * steps are green and the current step is amber, so a fully complete track is
 * entirely green on its own. (The source guards this with a ternary whose
 * branches are identical; it is redundant, not a bug — see PORTING_PLAN.md
 * §7.4.)
 */
export function ProgressTrack({
  value = 0,
  total = 1,
  variant = 'continuous',
  height,
  style,
  testID,
}: ProgressTrackProps) {
  const { colors, size, radii, duration, easing } = useTokens();
  const reducedMotion = useReducedMotion();

  const complete = value >= total;
  const percent = total > 0 ? Math.min(100, Math.max(0, (value / total) * 100)) : 0;

  const progress = useSharedValue(percent);

  useEffect(() => {
    progress.value = reducedMotion
      ? percent
      : withTiming(percent, {
          duration: duration.slow,
          easing: Easing.bezier(...easing.out),
        });
  }, [percent, progress, reducedMotion, duration.slow, easing.out]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.value}%` }));

  if (variant === 'segmented') {
    return (
      <View
        testID={testID}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: total, now: value }}
        style={[{ flexDirection: 'row', columnGap: SEGMENT_GAP }, style]}
      >
        {Array.from({ length: total }, (_, index) => (
          <View
            key={index}
            testID={`segment-${index}`}
            style={{
              flex: 1,
              height: height ?? size.progress.segmented,
              borderRadius: radii.track,
              backgroundColor:
                index < value
                  ? colors.status.success
                  : index === value
                    ? colors.indicator.pending
                    : colors.indicator.track,
            }}
          />
        ))}
      </View>
    );
  }

  return (
    <View
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: value }}
      style={[
        {
          height: height ?? size.progress.continuous,
          borderRadius: radii.track,
          overflow: 'hidden',
          backgroundColor: colors.surface.sunken,
        },
        style,
      ]}
    >
      <Animated.View
        testID={testID ? `${testID}-fill` : undefined}
        style={[
          {
            height: '100%',
            borderRadius: radii.track,
            backgroundColor: complete ? colors.indicator.success : colors.indicator.pending,
          },
          fillStyle,
        ]}
      />
    </View>
  );
}

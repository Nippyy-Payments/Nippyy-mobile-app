import { useEffect } from 'react';
import { View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useTokens } from '@/theme/ThemeProvider';

export type SkeletonProps = {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const DIM = 0.45;
const BRIGHT = 1;

/**
 * A placeholder block for content whose shape is known before it arrives.
 *
 * The design defines no loading state at all (PORTING_PLAN.md §8.2), so this
 * is built from the existing language rather than invented: the sunken
 * surface the app already uses for recessed fills, breathing gently. Nothing
 * shimmers, because nothing else in this app shimmers.
 *
 * Use a skeleton where the layout is predictable — rows, a balance, a card.
 * Where it is not, use a spinner.
 */
export function Skeleton({ width = '100%', height, radius, style, testID }: SkeletonProps) {
  const { colors, radii, size, duration, easing } = useTokens();
  const reducedMotion = useReducedMotion();

  const opacity = useSharedValue(BRIGHT);

  useEffect(() => {
    if (reducedMotion) {
      opacity.value = DIM;
      return;
    }
    opacity.value = withRepeat(
      withSequence(
        withTiming(DIM, { duration: duration.pulse / 2, easing: Easing.bezier(...easing.inOut) }),
        withTiming(BRIGHT, { duration: duration.pulse / 2, easing: Easing.bezier(...easing.inOut) })
      ),
      -1,
      false
    );
  }, [opacity, reducedMotion, duration.pulse, easing.inOut]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      testID={testID}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          width,
          height: height ?? size.progress.continuous * 2,
          borderRadius: radius ?? radii.sm,
          backgroundColor: colors.surface.sunken,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

/**
 * The row skeleton used by every list in the app: a leading tile, two lines of
 * text, and a trailing figure. Matches `ListRow`'s metrics so the layout does
 * not jump when the data lands.
 */
export function SkeletonRow({ first = false }: { first?: boolean }) {
  const { colors, size, radii, borderWidth, spacingRaw } = useTokens();

  return (
    <View
      accessibilityElementsHidden
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: spacingRaw.rowLeadingGap,
        paddingVertical: spacingRaw.rowPaddingY,
        minHeight: size.rowMin,
        borderTopWidth: first ? 0 : borderWidth.hairline,
        borderTopColor: colors.border.subtle,
      }}
    >
      <Skeleton width={size.avatar.md} height={size.avatar.md} radius={size.avatar.md / 2} />
      <View style={{ flex: 1, rowGap: 6 }}>
        <Skeleton width="55%" height={13} radius={radii.xs} />
        <Skeleton width="35%" height={11} radius={radii.xs} />
      </View>
      <Skeleton width={64} height={14} radius={radii.xs} />
    </View>
  );
}

/** A run of row skeletons, for a list whose length is not yet known. */
export function SkeletonRows({ count = 3 }: { count?: number }) {
  return (
    <View testID="skeleton-rows">
      {Array.from({ length: count }, (_, index) => (
        <SkeletonRow key={index} first={index === 0} />
      ))}
    </View>
  );
}

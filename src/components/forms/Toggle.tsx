import { useEffect } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { shadow } from '@/theme/shadows';
import { useTokens } from '@/theme/ThemeProvider';

export type ToggleProps = {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  /** Required: the switch carries no visible text of its own. */
  label: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * The bare 46x28 switch.
 *
 * Built from primitives rather than the platform `Switch`, per the fidelity
 * policy — an OS switch would not match the design on any of the three
 * platforms.
 *
 * Its knob is the only element in the entire system that carries a shadow.
 */
export function Toggle({
  checked = false,
  onChange,
  disabled = false,
  label,
  style,
  testID,
}: ToggleProps) {
  const { colors, size, radii, duration, easing } = useTokens();
  const reducedMotion = useReducedMotion();

  const travel = size.toggle.width - size.toggle.knob - size.toggle.inset * 2;
  const progress = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    progress.value = reducedMotion
      ? Number(checked)
      : withTiming(Number(checked), {
          duration: duration.base,
          easing: Easing.bezier(...easing.out),
        });
  }, [checked, progress, reducedMotion, duration.base, easing.out]);

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * travel }],
  }));

  return (
    <Pressable
      onPress={() => onChange?.(!checked)}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={label}
      testID={testID}
      style={[
        {
          width: size.toggle.width,
          height: size.toggle.height,
          borderRadius: radii.pill,
          backgroundColor: checked ? colors.brand.default : colors.control.trackOff,
          justifyContent: 'center',
          paddingHorizontal: size.toggle.inset,
          opacity: disabled ? DISABLED_OPACITY : 1,
          flexShrink: 0,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          {
            width: size.toggle.knob,
            height: size.toggle.knob,
            borderRadius: size.toggle.knob / 2,
            backgroundColor: colors.chrome.knob,
          },
          shadow('sm'),
          knobStyle,
        ]}
      />
    </Pressable>
  );
}

const DISABLED_OPACITY = 0.5;

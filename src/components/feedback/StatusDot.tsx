import { View, type StyleProp, type ViewStyle } from 'react-native';

import { PulseRing } from '@/components/feedback/PulseRing';
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
 * The small filled circle that marks a live rate, an unread notification or a
 * connection state.
 *
 * Uses the light `400` steps of green and amber deliberately: at 6-8px a
 * 500-weight fill reads almost black, which is the entire reason those steps
 * exist.
 */
export function StatusDot({ tone = 'success', size, pulse = false, style, testID }: StatusDotProps) {
  const { colors, size: sizes } = useTokens();

  const dimension = size ?? sizes.dot;

  const tones: Record<StatusTone, string> = {
    success: colors.indicator.success,
    pending: colors.indicator.pending,
    danger: colors.indicator.danger,
    brand: colors.indicator.brand,
    neutral: colors.indicator.neutral,
  };

  return (
    <View
      testID={testID}
      style={[
        { width: dimension, height: dimension, flexShrink: 0, alignItems: 'center', justifyContent: 'center' },
        style,
      ]}
    >
      <PulseRing size={dimension} color={tones[tone]} active={pulse} />
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

import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useTokens } from '@/theme/ThemeProvider';

export type CardTone = 'surface' | 'quiet' | 'sunken' | 'ink' | 'outline';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export type CardProps = {
  children?: ReactNode;
  tone?: CardTone;
  padding?: CardPadding;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * A bounded block for content that genuinely groups — a tier's limits, a
 * receipt summary, a bank-details panel.
 *
 * There is no elevation prop and no hover lift: this system separates with
 * tone and hairlines, not shadow.
 *
 * Do NOT wrap a list in a Card. Lists bleed to the screen edge and divide
 * with hairlines — see ListRow. Boxing a list is the fastest way to make a
 * screen stop looking like this app.
 */
export function Card({
  children,
  tone = 'surface',
  padding = 'lg',
  style,
  testID,
}: CardProps) {
  const { colors, spacing, radius, borderWidth } = useTokens();

  const pads: Record<CardPadding, number> = {
    none: 0,
    sm: spacing.lg,
    md: spacing.xl,
    lg: spacing['2xl'],
  };

  const tones: Record<CardTone, { background: string; border: string; width: number }> = {
    surface: {
      background: colors.surface.card,
      border: colors.border.subtle,
      width: borderWidth.hairline,
    },
    quiet: {
      background: colors.surface.quiet,
      border: colors.border.subtle,
      width: borderWidth.hairline,
    },
    sunken: {
      background: colors.surface.sunken,
      border: colors.border.subtle,
      width: borderWidth.hairline,
    },
    ink: {
      background: colors.surface.ink,
      border: 'transparent',
      width: borderWidth.hairline,
    },
    outline: {
      background: 'transparent',
      border: colors.border.default,
      width: borderWidth.strong,
    },
  };

  const resolved = tones[tone];

  return (
    <View
      testID={testID}
      style={[
        {
          backgroundColor: resolved.background,
          borderColor: resolved.border,
          borderWidth: resolved.width,
          borderRadius: radius.card,
          padding: pads[padding],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

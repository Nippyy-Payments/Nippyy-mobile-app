import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import { useTokens } from '@/theme/ThemeProvider';
import { textStyles, type TypeVariant } from '@/theme/typography';
import type { ColorTokens } from '@/theme/tokens';

type TextTone = keyof ColorTokens['text'];

export type TextProps = Omit<RNTextProps, 'style'> & {
  /** A role from the design's type scale. Every Text picks exactly one. */
  variant?: TypeVariant;
  /** Semantic colour. Anything outside the text palette is passed via style. */
  tone?: TextTone;
  style?: RNTextProps['style'];
};

/**
 * The app's only Text.
 *
 * Two things are centralised here so no call site repeats them:
 *
 *  1. `allowFontScaling={false}`. The layout is drawn at fixed sizes and OS
 *     text scaling would break it. This is the single place that decision
 *     lives, so reversing it later is a one-line change.
 *  2. The type scale. `variant` resolves family, size, line height and
 *     letter spacing together — they are not independent, because the
 *     source expresses tracking in `em`.
 */
export function Text({ variant = 'body', tone = 'body', style, ...rest }: TextProps) {
  const { colors } = useTokens();

  const base: TextStyle = {
    ...textStyles[variant],
    color: colors.text[tone],
  };

  return <RNText allowFontScaling={false} style={[base, style]} {...rest} />;
}

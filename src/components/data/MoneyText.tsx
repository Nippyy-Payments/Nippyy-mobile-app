import { type StyleProp, type TextStyle } from 'react-native';

import { Text } from '@/components/Text';
import { useTokens } from '@/theme/ThemeProvider';
import { textStyles, type TypeVariant } from '@/theme/typography';
import { moneySymbolRatio } from '@/theme/tokens';

/**
 * `tone` carries the money semantics the design fixes:
 * in is green, out is INK rather than red — sending money is the point of the
 * app, not an error — and pending is amber. A failed amount stays ink and
 * lets the status badge carry the failure.
 */
export type MoneyTone = 'default' | 'in' | 'out' | 'pending' | 'muted' | 'subtle' | 'onInk';

/** The money roles from the type scale. */
export type MoneyVariant = Extract<
  TypeVariant,
  | 'money'
  | 'moneySm'
  | 'balanceHero'
  | 'balance'
  | 'amountHero'
  | 'amountHeroMd'
  | 'amountHeroSm'
  | 'amountDetail'
  | 'amountFlow'
  | 'amountStepper'
  | 'amountFieldXl'
  | 'amountFieldLg'
  | 'amountFieldMd'
  | 'amountFieldSm'
  | 'tokenCode'
  | 'addressCode'
  | 'phoneNumber'
>;

export type MoneyTextProps = {
  children?: React.ReactNode;
  variant?: MoneyVariant;
  tone?: MoneyTone;
  /**
   * Renders bullets instead of the figure. Masking is a session preference
   * owned by the store, never by a screen — hiding on Home hides on Wallets.
   */
  masked?: boolean;
  /**
   * Currency symbol, set smaller and lighter than the figure. The design
   * expresses this as an `em` fraction, which RN has no equivalent for, so
   * the ratio resolves against the variant's own size.
   */
  symbol?: string;
  symbolRatio?: number;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
};

/** What a masked balance shows in place of the figure. */
const MASK = '••••••';

/** Gap between the currency symbol and the figure, in px. */
const SYMBOL_GAP = 2;

/**
 * Every monetary figure in the app.
 *
 * Space Grotesk with tabular figures, so columns of amounts align and digits
 * do not shift as a value updates. The source writes this span inline 83
 * times; it is the most repeated single piece of styling in the product, so
 * all money routes through here rather than being restyled per screen.
 */
export function MoneyText({
  children,
  variant = 'money',
  tone = 'default',
  masked = false,
  symbol,
  symbolRatio = moneySymbolRatio.default,
  numberOfLines,
  style,
}: MoneyTextProps) {
  const { colors, fontFamily } = useTokens();

  const tones: Record<MoneyTone, string> = {
    default: colors.text.strong,
    in: colors.money.in,
    out: colors.money.out,
    pending: colors.money.pending,
    muted: colors.text.muted,
    subtle: colors.text.subtle,
    onInk: colors.text.onInk,
  };

  const color = masked ? colors.text.subtle : tones[tone];
  const figureSize = textStyles[variant].fontSize ?? 0;

  return (
    <Text variant={variant} numberOfLines={numberOfLines} style={[{ color }, style]}>
      {symbol && !masked ? (
        <Text
          variant={variant}
          style={{
            fontFamily: fontFamily.sansMedium,
            fontSize: figureSize * symbolRatio,
            color: colors.text.subtle,
            // The design puts 2px between symbol and figure. Margin on a
            // nested Text is unreliable in RN; trailing letter-spacing lands
            // the same gap, and must override the role's negative tracking.
            letterSpacing: SYMBOL_GAP,
          }}
        >
          {symbol}
        </Text>
      ) : null}
      {masked ? MASK : children}
    </Text>
  );
}

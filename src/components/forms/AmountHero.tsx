import { View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '@/components/Text';
import { useTokens } from '@/theme/ThemeProvider';
import { moneySymbolRatio, tabularNums } from '@/theme/tokens';
import { textStyles, type TypeVariant } from '@/theme/typography';

/**
 * The three states the app actually shows:
 *   default — the figure as entered
 *   over    — exceeds the wallet or the tier limit
 *   muted   — a computed result the user is not editing
 */
export type AmountState = 'default' | 'over' | 'muted';
export type AmountHeroSize = 'sm' | 'md' | 'lg';

export type AmountHeroProps = {
  amount?: string;
  currencySymbol?: string;
  label?: string;
  /** Carries the rate, the converse amount, or why the figure is over. */
  helper?: string;
  size?: AmountHeroSize;
  state?: AmountState;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const VARIANT: Record<AmountHeroSize, TypeVariant> = {
  sm: 'amountHeroSm',
  md: 'amountHeroMd',
  lg: 'amountHero',
};

const PAD_TOP = 14;
const PAD_BOTTOM = 6;
const FIGURE_GAP = 6;
const SYMBOL_GAP = 4;
const HELPER_GAP = 8;

/**
 * The centred money figure that anchors the send, convert and bill screens.
 *
 * Unlike `AmountField` there is no box: the number *is* the screen. A muted
 * line above names it; a helper line below carries the rate or the converse
 * amount.
 */
export function AmountHero({
  amount = '0',
  currencySymbol = '₦',
  label,
  helper,
  size = 'lg',
  state = 'default',
  style,
  testID,
}: AmountHeroProps) {
  const { colors } = useTokens();

  const variant = VARIANT[size];
  const figureSize = textStyles[variant].fontSize ?? 0;

  const figureColor =
    state === 'over'
      ? colors.status.danger
      : state === 'muted'
        ? colors.text.subtle
        : colors.text.strong;

  return (
    <View
      testID={testID}
      style={[{ alignItems: 'center', paddingTop: PAD_TOP, paddingBottom: PAD_BOTTOM }, style]}
    >
      {label ? (
        <Text variant="label" tone="muted">
          {label}
        </Text>
      ) : null}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          columnGap: SYMBOL_GAP,
          marginTop: FIGURE_GAP,
        }}
      >
        <Text
          variant={variant}
          style={{
            fontSize: figureSize * moneySymbolRatio.hero,
            // The symbol only recedes while the figure is in its normal
            // state; in `over` it joins the red so the pair reads as one.
            color: state === 'default' ? colors.text.subtle : figureColor,
          }}
        >
          {currencySymbol}
        </Text>
        <Text
          variant={variant}
          style={{ color: figureColor, fontVariant: [...tabularNums] }}
          testID={testID ? `${testID}-figure` : undefined}
        >
          {amount}
        </Text>
      </View>

      {helper ? (
        <Text
          variant="caption"
          style={{
            marginTop: HELPER_GAP,
            color: state === 'over' ? colors.status.danger : colors.text.subtle,
          }}
        >
          {helper}
        </Text>
      ) : null}
    </View>
  );
}

import { Pressable, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';

import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { useTokens } from '@/theme/ThemeProvider';
import { tabularNums } from '@/theme/tokens';
import { textStyles, type TypeVariant } from '@/theme/typography';

export type AmountFieldTone = 'surface' | 'brand' | 'ink';

export type AmountFieldProps = {
  amount?: string;
  currency?: string;
  currencySymbol?: string;
  label?: string;
  balance?: string;
  flag?: string | null;
  onAmountChange?: (next: string) => void;
  onCurrencyPress?: () => void;
  editable?: boolean;
  tone?: AmountFieldTone;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * A converted naira figure runs to nine or ten characters. The design steps
 * the figure down rather than letting it ellipsise, because a truncated
 * amount is worse than a small one.
 */
function figureVariant(amount: string): TypeVariant {
  const length = String(amount).length;
  if (length > 11) return 'amountFieldSm';
  if (length > 9) return 'amountFieldMd';
  if (length > 6) return 'amountFieldLg';
  return 'amountFieldXl';
}

const STACK_GAP = 10;
const BODY_GAP = 16;
const SYMBOL_GAP = 4;
const CURRENCY_HEIGHT = 42;
const CURRENCY_PAD = 14;
const CURRENCY_GAP = 7;
const FLAG_SIZE = 20;
const CHEVRON = 13;
const CHEVRON_STROKE = 2.4;

/** Alpha treatments for text on the ink panel, which has no token scale. */
const ON_INK_LABEL = 'rgba(255, 255, 255, 0.75)';
const ON_INK_MUTED = 'rgba(255, 255, 255, 0.6)';
const ON_INK_CHIP = 'rgba(255, 255, 255, 0.12)';

/**
 * Boxed money entry with a currency chip, used where an amount sits alongside
 * another amount — the from/to pair on Convert — and the two need visible
 * containers to tell them apart.
 *
 * Prefer `AmountHero` when a single amount is the whole screen.
 */
export function AmountField({
  amount = '0.00',
  currency = 'NGN',
  currencySymbol = '₦',
  label,
  balance,
  flag,
  onAmountChange,
  onCurrencyPress,
  editable = true,
  tone = 'surface',
  style,
  testID,
}: AmountFieldProps) {
  const { colors, spacing, radius, borderWidth } = useTokens();

  const isInk = tone === 'ink';
  const isBrand = tone === 'brand';

  const foreground = isInk ? colors.text.onInk : isBrand ? colors.text.body : colors.text.strong;
  const labelColor = isInk
    ? ON_INK_LABEL
    : isBrand
      ? colors.status.infoText
      : colors.text.muted;
  const balanceColor = isInk ? ON_INK_MUTED : isBrand ? colors.text.link : colors.text.subtle;
  const symbolColor = isInk ? ON_INK_MUTED : colors.text.subtle;

  const variant = figureVariant(amount);
  const figureStyle = { color: foreground, fontVariant: [...tabularNums] };

  return (
    <View
      testID={testID}
      style={[
        {
          rowGap: STACK_GAP,
          backgroundColor: isInk
            ? colors.surface.ink
            : isBrand
              ? colors.brand.soft
              : colors.surface.card,
          borderWidth: isInk || isBrand ? borderWidth.hairline : borderWidth.strong,
          borderColor: isInk || isBrand ? 'transparent' : colors.border.subtle,
          borderRadius: radius.amountField,
          paddingVertical: spacing.xl,
          paddingHorizontal: spacing['2xl'],
        },
        style,
      ]}
    >
      {label || balance ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            columnGap: STACK_GAP,
          }}
        >
          {label ? (
            <Text variant="label" style={{ color: labelColor }}>
              {label}
            </Text>
          ) : null}
          {balance ? (
            <Text variant="caption" style={{ color: balanceColor }}>
              {`Balance ${balance}`}
            </Text>
          ) : null}
        </View>
      ) : null}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          columnGap: BODY_GAP,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            columnGap: SYMBOL_GAP,
            flex: 1,
            minWidth: 0,
          }}
        >
          <Text variant="amountFieldSymbol" style={{ color: symbolColor }}>
            {currencySymbol}
          </Text>

          {editable ? (
            <TextInput
              value={amount}
              onChangeText={onAmountChange}
              inputMode="decimal"
              allowFontScaling={false}
              accessibilityLabel="Amount"
              testID={testID ? `${testID}-input` : undefined}
              style={[textStyles[variant], figureStyle, { flex: 1, minWidth: 0 }]}
            />
          ) : (
            <Text
              variant={variant}
              numberOfLines={1}
              style={[figureStyle, { flex: 1, minWidth: 0 }]}
              testID={testID ? `${testID}-figure` : undefined}
            >
              {amount}
            </Text>
          )}
        </View>

        <Pressable
          onPress={onCurrencyPress}
          disabled={!onCurrencyPress}
          accessibilityRole={onCurrencyPress ? 'button' : undefined}
          accessibilityLabel={onCurrencyPress ? `Currency: ${currency}` : undefined}
          testID={testID ? `${testID}-currency` : undefined}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: CURRENCY_GAP,
            height: CURRENCY_HEIGHT,
            paddingHorizontal: CURRENCY_PAD,
            borderRadius: radius.chip,
            backgroundColor: isInk
              ? ON_INK_CHIP
              : isBrand
                ? colors.surface.quiet
                : colors.surface.sunken,
            flexShrink: 0,
          }}
        >
          {flag ? <Text variant="emptyTitle" style={{ fontSize: FLAG_SIZE }}>{flag}</Text> : null}
          <Text variant="bodyStrong" style={{ color: isInk ? colors.text.onInk : colors.text.strong }}>
            {currency}
          </Text>
          {onCurrencyPress ? (
            <Icon
              name="chevronDown"
              size={CHEVRON}
              strokeWidth={CHEVRON_STROKE}
              color={isInk ? ON_INK_MUTED : colors.text.muted}
            />
          ) : null}
        </Pressable>
      </View>
    </View>
  );
}

import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '@/components/Text';
import { Avatar } from '@/components/data/Avatar';
import { MoneyText } from '@/components/data/MoneyText';
import { Badge, type BadgeStatus } from '@/components/feedback/Badge';
import { useTokens } from '@/theme/ThemeProvider';

export type TransactionStatus = 'success' | 'pending' | 'failed';
export type TransactionDirection = 'in' | 'out';

export type TransactionRowProps = {
  name: string;
  subtitle?: string;
  amount: string;
  currencySymbol?: string;
  direction?: TransactionDirection;
  status?: TransactionStatus;
  flag?: string | null;
  avatarSrc?: string | null;
  first?: boolean;
  gutter?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const PADDING_Y = 14;
const GAP = 12;
const AMOUNT_GAP = 5;

/** A failed transfer keeps its ink amount and lets the badge carry the failure. */
const STATUS: Record<TransactionStatus, { label: string; badge: BadgeStatus }> = {
  success: { label: 'Completed', badge: 'success' },
  pending: { label: 'Pending', badge: 'warning' },
  failed: { label: 'Failed', badge: 'danger' },
};

/**
 * A line in the activity list.
 *
 * Full-bleed and hairline-divided like `ListRow`, because in the app it sits
 * in the same stack. `direction` sets the sign and the colour: out is ink,
 * in is green.
 */
export function TransactionRow({
  name,
  subtitle,
  amount,
  currencySymbol = '₦',
  direction = 'out',
  status = 'success',
  flag,
  avatarSrc,
  first = false,
  gutter,
  onPress,
  style,
  testID,
}: TransactionRowProps) {
  const { colors, gutter: gutters, borderWidth } = useTokens();

  const inset = gutter ?? gutters.default;
  const resolved = STATUS[status];
  const sign = direction === 'in' ? '+' : '-';

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${name}, ${sign}${currencySymbol}${amount}, ${resolved.label}`}
      testID={testID}
      style={({ pressed }) => [
        {
          marginHorizontal: -inset,
          paddingHorizontal: inset,
          paddingVertical: PADDING_Y,
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: GAP,
          borderTopWidth: first ? 0 : borderWidth.hairline,
          borderTopColor: colors.border.subtle,
          backgroundColor: pressed && onPress ? colors.surface.quiet : 'transparent',
        },
        style,
      ]}
    >
      <Avatar name={name} src={avatarSrc} flag={flag} size="md" />

      <View style={{ flex: 1, minWidth: 0 }}>
        <Text variant="bodyStrong" tone="strong" numberOfLines={1}>
          {name}
        </Text>
        {subtitle ? (
          <Text variant="labelMuted" tone="muted" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={{ alignItems: 'flex-end', rowGap: AMOUNT_GAP, flexShrink: 0 }}>
        <MoneyText tone={direction === 'in' ? 'in' : 'out'}>
          {`${sign}${currencySymbol}${amount}`}
        </MoneyText>
        <Badge status={resolved.badge} size="sm" dot>
          {resolved.label}
        </Badge>
      </View>
    </Pressable>
  );
}

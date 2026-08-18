import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Avatar } from '@/components/data/Avatar';
import { Badge } from '@/components/feedback/Badge';
import { Button } from '@/components/core/Button';
import { Card } from '@/components/core/Card';
import { IconButton, useIconButtonForeground } from '@/components/core/IconButton';
import { MoneyText } from '@/components/data/MoneyText';
import { RowTile, useRowTileForeground } from '@/components/data/RowTile';
import { StatusDot } from '@/components/feedback/StatusDot';
import { useSessionStore } from '@/store/session';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Phase 1 smoke screen.
 *
 * Exercises every primitive built so far in both themes so the phase gate is
 * verifiable by eye. Replaced by the real Home screen in phase 5.
 */
export default function PrimitivesCheck() {
  const { theme, name, toggleTheme } = useTheme();
  const { colors, spacing, radius, size } = theme;

  const masked = useSessionStore((s) => s.balanceHidden);
  const toggleMasked = useSessionStore((s) => s.toggleBalanceHidden);

  const quietFg = useIconButtonForeground('quiet');
  const brandTileFg = useRowTileForeground('brand');

  return (
    <Screen>
      <Text variant="screenTitle" tone="strong">
        Send money home in seconds
      </Text>
      <Text variant="body" tone="muted" style={{ marginTop: spacing.md }}>
        See the exact rate and fee up front — no hidden spread, and it lands almost instantly.
      </Text>

      {/* Balance + masking, the session-wide preference */}
      <Text variant="label" tone="muted" style={{ marginTop: spacing['3xl'] }}>
        Total balance
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm }}>
        <MoneyText variant="balanceHero" symbol="₦" symbolRatio={0.62} masked={masked}>
          3,624,097
        </MoneyText>
        <View style={{ flex: 1 }} />
        <IconButton
          variant="quiet"
          size="sm"
          label={masked ? 'Show balance' : 'Hide balance'}
          onPress={toggleMasked}
        >
          <Icon name={masked ? 'eyeOff' : 'eye'} size={size.icon.md} color={quietFg} />
        </IconButton>
      </View>

      {/* Money semantics */}
      <Text variant="label" tone="muted" style={{ marginTop: spacing['3xl'] }}>
        Money semantics
      </Text>
      <View style={{ rowGap: spacing.xs, marginTop: spacing.sm }}>
        <MoneyText tone="in">+£2,400.00</MoneyText>
        <MoneyText tone="out">-₦200,000</MoneyText>
        <MoneyText tone="pending">-₵1,500</MoneyText>
      </View>

      {/* Identity, tiles and status */}
      <Text variant="label" tone="muted" style={{ marginTop: spacing['3xl'] }}>
        Rows
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: theme.spacingRaw.rowLeadingGap,
          marginTop: spacing.sm,
        }}
      >
        <Avatar name="Ada Okeke" flag="🇳🇬" size="md" />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text variant="bodyStrong" tone="strong">
            Ada Okeke
          </Text>
          <Text variant="labelMuted" tone="muted">
            GTBank · ···4471
          </Text>
        </View>
        <Badge status="success" size="sm">
          Verified
        </Badge>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: theme.spacingRaw.rowLeadingGap,
          marginTop: spacing.lg,
        }}
      >
        <RowTile tone="brand">
          <Icon name="rate" size={size.icon.lg} color={brandTileFg} />
        </RowTile>
        <View style={{ flex: 1 }}>
          <Text variant="bodyStrong" tone="strong">
            Live rates, stated up front
          </Text>
        </View>
        <StatusDot tone="success" pulse />
      </View>

      {/* Badges */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          columnGap: spacing.sm,
          rowGap: spacing.sm,
          marginTop: spacing['3xl'],
        }}
      >
        <Badge status="success" dot>
          Completed
        </Badge>
        <Badge status="warning" dot>
          Pending
        </Badge>
        <Badge status="danger" dot>
          Failed
        </Badge>
        <Badge status="neutral">Locked</Badge>
        <Badge status="info">Current</Badge>
      </View>

      {/* Card — used for genuine groupings only, never around a list */}
      <Card tone="sunken" style={{ marginTop: spacing['3xl'] }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text variant="caption" tone="subtle">
            Reference
          </Text>
          <MoneyText variant="moneySm">NP-8841-2207</MoneyText>
        </View>
      </Card>

      {/* One filled action; alternatives sit below in ghost or outline */}
      <View style={{ marginTop: spacing['3xl'], rowGap: theme.spacingRaw.buttonStackGap }}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          iconLeft={<Icon name="send" size={size.icon.md} color={colors.text.onBrand} />}
        >
          Send money
        </Button>
        <Button variant="outline" size="md" fullWidth onPress={toggleTheme}>
          {name === 'dark' ? 'Switch to light' : 'Switch to dark'}
        </Button>
        <Button variant="ghost" size="md" fullWidth>
          I already have an account
        </Button>
        <Button variant="primary" size="md" fullWidth loading>
          Sending
        </Button>
        <Button variant="primary" size="md" fullWidth disabled>
          Enter 6 digits
        </Button>
      </View>

      <View
        style={{
          marginTop: spacing.xl,
          height: size.tile.lg,
          borderRadius: radius.tile,
          backgroundColor: colors.surface.quiet,
        }}
      />
    </Screen>
  );
}

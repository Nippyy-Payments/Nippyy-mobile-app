import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Avatar } from '@/components/data/Avatar';
import { Badge } from '@/components/feedback/Badge';
import { Button } from '@/components/core/Button';
import { Card } from '@/components/core/Card';
import { DetailRow } from '@/components/data/DetailRow';
import { EmptyState, useEmptyStateIconColor } from '@/components/feedback/EmptyState';
import { IconButton, useIconButtonForeground } from '@/components/core/IconButton';
import { InlineAlert, useAlertIconColor } from '@/components/feedback/InlineAlert';
import { ListRow } from '@/components/data/ListRow';
import { MoneyText } from '@/components/data/MoneyText';
import { RowTile, useRowTileForeground } from '@/components/data/RowTile';
import { ScreenTitle } from '@/components/core/ScreenTitle';
import { SectionLabel } from '@/components/core/SectionLabel';
import { StatusDot } from '@/components/feedback/StatusDot';
import { TransactionRow } from '@/components/data/TransactionRow';
import { useSessionStore } from '@/store/session';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Phase 2 smoke screen.
 *
 * Exercises the primitives plus the row and layout components in both themes,
 * so the phase gate is checkable by eye. Replaced by the real Home screen in
 * phase 5.
 */
export default function ComponentCheck() {
  const { theme, name, toggleTheme } = useTheme();
  const { colors, spacing, spacingRaw, size } = theme;

  const masked = useSessionStore((s) => s.balanceHidden);
  const toggleMasked = useSessionStore((s) => s.toggleBalanceHidden);

  const quietFg = useIconButtonForeground('quiet');
  const brandTileFg = useRowTileForeground('brand');
  const dangerAlertFg = useAlertIconColor('danger');
  const emptyFg = useEmptyStateIconColor();

  return (
    <Screen>
      <ScreenTitle subhead="See the exact rate and fee up front — no hidden spread.">
        Send money home
      </ScreenTitle>

      {/* Balance + masking, the session-wide preference */}
      <View style={{ marginTop: spacingRaw.sectionGapMd }}>
        <Text variant="label" tone="muted">
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
      </View>

      {/* Lists, not cards: full-bleed rows divided by hairlines */}
      <View style={{ marginTop: spacingRaw.sectionGapLg }}>
        <SectionLabel
          action={
            <Button variant="ghost" size="sm">
              See all
            </Button>
          }
        >
          Your people
        </SectionLabel>

        <ListRow
          first
          leading={<Avatar name="Ada Okeke" flag="🇳🇬" size="md" />}
          title="Ada Okeke"
          subtitle="GTBank · ···4471"
          affordance="none"
          trailing={
            <Badge status="success" size="sm">
              Verified
            </Badge>
          }
          onPress={() => {}}
        />
        <ListRow
          leading={<Avatar name="Kwame Mensah" flag="🇬🇭" size="md" />}
          title="Kwame Mensah"
          subtitle="MTN MoMo · ···7729"
          affordance="none"
          trailing={
            <Badge status="warning" size="sm">
              Verifying
            </Badge>
          }
          onPress={() => {}}
        />
        <ListRow
          leading={
            <RowTile tone="brand">
              <Icon name="rate" size={size.icon.lg} color={brandTileFg} />
            </RowTile>
          }
          title="Rates and fees"
          subtitle="What a transfer costs"
          onPress={() => {}}
        />
        <ListRow
          leading={
            <RowTile>
              <Icon name="doc" size={size.icon.lg} color={quietFg} />
            </RowTile>
          }
          title="Privacy policy"
          affordance="external"
          href="https://nippyy.com/privacy-policy"
        />
        <ListRow
          leading={
            <RowTile tone="danger">
              <Icon name="trash" size={size.icon.lg} color={colors.status.dangerText} />
            </RowTile>
          }
          title="Close account"
          subtitle="Delete your profile and recipients"
          danger
          onPress={() => {}}
        />
      </View>

      {/* Activity rows */}
      <View style={{ marginTop: spacingRaw.sectionGapLg }}>
        <SectionLabel>Recent</SectionLabel>
        <TransactionRow
          first
          name="Ada Okeke"
          subtitle="To GTBank · 07:52"
          amount="200,000"
          direction="out"
          status="success"
          flag="🇳🇬"
          onPress={() => {}}
        />
        <TransactionRow
          name="Salary — Northwind"
          subtitle="Received · Fri"
          amount="2,400.00"
          currencySymbol="£"
          direction="in"
          status="success"
          flag="🇬🇧"
          onPress={() => {}}
        />
        <TransactionRow
          name="Amara Njoku"
          subtitle="M-Pesa · Thu"
          amount="18,000"
          currencySymbol="KSh"
          direction="out"
          status="failed"
          flag="🇰🇪"
          onPress={() => {}}
        />
      </View>

      {/* A genuine grouping — never around a list */}
      <View style={{ marginTop: spacingRaw.sectionGapMd }}>
        <SectionLabel>Breakdown</SectionLabel>
        <Card>
          <DetailRow label="You paid" value="£100.40" numeric divider />
          <DetailRow label="Fee" value="£0.40" numeric divider />
          <DetailRow label="Rate used" value="£1 = ₦1,985" numeric divider />
          <DetailRow label="They received" value="₦200,000" numeric emphasis="money" />
        </Card>
      </View>

      <View style={{ marginTop: spacing.lg }}>
        <Card tone="sunken">
          <DetailRow label="Reference" value="NP-8841-2207" numeric copyable testID="reference" />
        </Card>
      </View>

      {/* An alert carries its own fix */}
      <InlineAlert
        style={{ marginTop: spacingRaw.sectionGapMd }}
        tone="danger"
        title="Not enough in your GBP wallet"
        detail="You have £840.20. Add money or switch wallet."
        icon={<Icon name="warn" size={size.icon.sm} color={dangerAlertFg} />}
        actions={
          <>
            <Button size="sm" variant="secondary">
              Add money
            </Button>
            <Button size="sm" variant="ghost">
              Switch wallet
            </Button>
          </>
        }
      />

      <EmptyState
        style={{ marginTop: spacing.lg }}
        icon={<Icon name="clock" size={size.icon['2xl']} color={emptyFg} />}
        title="Nothing here yet"
        body="Transfers, deposits and bill payments will show up here."
      />

      {/* Status */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: spacing.sm,
          marginTop: spacing.lg,
        }}
      >
        <StatusDot tone="success" pulse />
        <Text variant="labelMuted" tone="muted">
          Live rate · 1 GBP = 1,985 NGN
        </Text>
      </View>

      {/* One filled action; alternatives sit below */}
      <View style={{ marginTop: spacingRaw.sectionGapMd, rowGap: spacingRaw.buttonStackGap }}>
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
        <Button variant="quiet" size="lg" fullWidth>
          Log out
        </Button>
      </View>
    </Screen>
  );
}

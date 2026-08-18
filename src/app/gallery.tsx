import { useState } from 'react';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/core/ScreenHeader';
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
import { AmountField } from '@/components/forms/AmountField';
import { AmountHero } from '@/components/forms/AmountHero';
import { ChipGroup } from '@/components/forms/ChipGroup';
import { Input } from '@/components/forms/Input';
import { JourneyStrip } from '@/components/feedback/JourneyStrip';
import { Keypad } from '@/components/forms/Keypad';
import { OtpField } from '@/components/forms/OtpField';
import { ProgressTrack } from '@/components/feedback/ProgressTrack';
import { SuccessBurst } from '@/components/feedback/SuccessBurst';
import { ToggleRow } from '@/components/forms/ToggleRow';
import { useSessionStore } from '@/store/session';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Component gallery.
 *
 * Every primitive and row component in one place, in whichever theme is
 * active, so a change can be eyeballed without walking the app. Reachable
 * from Home and from Account; it is a pushed screen, so it also serves as a
 * live check that back, swipe-back and browser-back all work.
 */
export default function ComponentGallery() {
  const [code, setCode] = useState('471');
  const [pin, setPin] = useState('12');
  const [filter, setFilter] = useState<string | null>('All');
  const [preset, setPreset] = useState<string | null>('200');
  const [alertOn, setAlertOn] = useState(true);
  const [search, setSearch] = useState('');
  const { theme, name, toggleTheme } = useTheme();
  const { colors, spacing, spacingRaw, size } = theme;

  const masked = useSessionStore((s) => s.balanceHidden);
  const toggleMasked = useSessionStore((s) => s.toggleBalanceHidden);

  const quietFg = useIconButtonForeground('quiet');
  const brandTileFg = useRowTileForeground('brand');
  const dangerAlertFg = useAlertIconColor('danger');
  const emptyFg = useEmptyStateIconColor();

  return (
    <Screen header={<ScreenHeader title="Component gallery" />}>
      <ScreenTitle subhead="Every primitive, rendered in the active theme.">
        Components
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

      {/* Forms */}
      <View style={{ marginTop: spacingRaw.sectionGapLg }}>
        <SectionLabel>Forms</SectionLabel>
        <Input
          label="Search"
          placeholder="Search by name or bank"
          value={search}
          onChangeText={setSearch}
          style={{ marginTop: spacing.sm }}
        />
        <Input
          label="Amount"
          value="9,000"
          error="Not enough in your GBP wallet"
          style={{ marginTop: spacing.lg }}
        />
        <ChipGroup
          style={{ marginTop: spacing.lg }}
          options={['All', 'Sent', 'Received', 'Bills']}
          value={filter}
          onChange={setFilter}
        />
        <ChipGroup
          style={{ marginTop: spacing.md }}
          tone="brand"
          numeric
          align="center"
          options={['50', '100', '200', '500']}
          value={preset}
          onChange={setPreset}
        />
        <ToggleRow
          first
          style={{ marginTop: spacing.lg }}
          title="Alert me at this rate"
          detail="Today is ₦25 above your target"
          checked={alertOn}
          onChange={setAlertOn}
        />
      </View>

      {/* Amounts */}
      <View style={{ marginTop: spacingRaw.sectionGapMd }}>
        <SectionLabel>Amounts</SectionLabel>
        <AmountHero label="You send" currencySymbol="£" amount="200" helper="They get ₦397,000" />
        <AmountHero
          size="md"
          currencySymbol="£"
          amount="900"
          state="over"
          helper="More than your GBP balance of £840.20"
        />
        <AmountField
          style={{ marginTop: spacing.md }}
          label="From"
          balance="£840.20"
          currency="GBP"
          currencySymbol="£"
          flag="🇬🇧"
          amount="200"
          editable={false}
          onCurrencyPress={() => {}}
        />
        <AmountField
          style={{ marginTop: spacing.md }}
          tone="brand"
          label="To"
          balance="₦1,250,000"
          currency="NGN"
          currencySymbol="₦"
          flag="🇳🇬"
          amount="397,000"
          editable={false}
          onCurrencyPress={() => {}}
        />
      </View>

      {/* Code entry */}
      <View style={{ marginTop: spacingRaw.sectionGapMd }}>
        <SectionLabel>Code entry</SectionLabel>
        <OtpField value={code} length={6} style={{ marginTop: spacing.sm }} />
        <OtpField value={pin} length={4} mask style={{ marginTop: spacing.lg }} />
        <Keypad
          style={{ marginTop: spacing.lg }}
          decimal={false}
          onKey={(key) => {
            setCode((current) =>
              key === 'back' ? current.slice(0, -1) : (current + key).slice(0, 6)
            );
            setPin((current) =>
              key === 'back' ? current.slice(0, -1) : (current + key).slice(0, 4)
            );
          }}
        />
      </View>

      {/* Progress & journey */}
      <View style={{ marginTop: spacingRaw.sectionGapMd }}>
        <SectionLabel>Progress</SectionLabel>
        <ProgressTrack variant="segmented" value={2} total={4} />
        <ProgressTrack style={{ marginTop: spacing.md }} value={1} total={2} />
        <ProgressTrack style={{ marginTop: spacing.md }} value={2} total={2} />

        <JourneyStrip
          style={{ marginTop: spacing.lg }}
          compact
          steps={[
            { label: 'You pay', state: 'done' },
            { label: 'We convert', state: 'active' },
            { label: 'They receive', state: 'todo' },
          ]}
        />

        <JourneyStrip
          style={{ marginTop: spacingRaw.sectionGapSm }}
          orientation="vertical"
          steps={[
            { label: 'Payment authorised', detail: 'Face ID confirmed', state: 'done' },
            { label: 'Converted to NGN', detail: 'at 1,985 per £1', state: 'active' },
            { label: 'Sent to GTBank', detail: 'Verified account', state: 'todo' },
          ]}
        />
      </View>

      <View style={{ alignItems: 'center', marginTop: spacingRaw.sectionGapMd }}>
        <SuccessBurst />
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

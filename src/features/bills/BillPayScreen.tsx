import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { AmountHero } from '@/components/forms/AmountHero';
import { Badge } from '@/components/feedback/Badge';
import { Button } from '@/components/core/Button';
import { Card } from '@/components/core/Card';
import { ChipGroup } from '@/components/forms/ChipGroup';
import { DetailRow } from '@/components/data/DetailRow';
import { EmptyState, useEmptyStateIconColor } from '@/components/feedback/EmptyState';
import { Input } from '@/components/forms/Input';
import { JourneyStrip, type JourneyState } from '@/components/feedback/JourneyStrip';
import { ListRow } from '@/components/data/ListRow';
import { MoneyText } from '@/components/data/MoneyText';
import { RowTile, useRowTileForeground } from '@/components/data/RowTile';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { SuccessBurst } from '@/components/feedback/SuccessBurst';
import { billCategory } from '@/features/bills/categories';
import { confirmLabel, confirmWithBiometrics, isBiometricAvailable } from '@/lib/auth';
import { currency } from '@/lib/currency';
import { convert, formatAmount, formatMoney, sumAmounts } from '@/lib/format';
import { primaryWallet, useRates, useWallets } from '@/lib/api/queries';
import { useSessionStore } from '@/store/session';
import { useTheme } from '@/theme/ThemeProvider';

/** The design's flat bill fee, in the paying wallet's currency. */
const BILL_FEE = '0.40';
const STEP_MS = 800;
const BILL_CURRENCY = 'NGN';

type Step = 'form' | 'paying' | 'done';

export function BillPayScreen({ categoryId }: { categoryId: string }) {
  const router = useRouter();
  const { theme } = useTheme();
  const { colors, spacing, spacingRaw, size, radius } = theme;
  const quietFg = useRowTileForeground('quiet');
  const emptyFg = useEmptyStateIconColor();

  const wallets = useWallets();
  const rates = useRates();

  const category = billCategory(categoryId);
  const [step, setStep] = useState<Step>('form');
  const [amount, setAmount] = useState<number>(category?.presets[1] ?? 0);
  const [node, setNode] = useState(0);
  const [biometricsReady, setBiometricsReady] = useState(false);

  const biometricsEnabled = useSessionStore((s) => s.biometricsEnabled);

  useEffect(() => {
    let active = true;
    void (async () => {
      const available = biometricsEnabled && (await isBiometricAvailable());
      if (active) setBiometricsReady(available);
    })();
    return () => {
      active = false;
    };
  }, [biometricsEnabled]);

  useEffect(() => {
    if (step !== 'paying') return;

    const timers = [0, 1, 2, 3].map((index) =>
      setTimeout(
        () => (index === 3 ? setStep('done') : setNode(index + 1)),
        STEP_MS * (index + 1)
      )
    );
    return () => timers.forEach(clearTimeout);
  }, [step]);

  if (!category) {
    return (
      <Screen header={<ScreenHeader title="Pay a bill" />}>
        <EmptyState
          icon={<Icon name="bill" size={size.icon['2xl']} color={emptyFg} />}
          title="We could not find that biller"
          body="Choose a category and we will take it from there."
        >
          <Button variant="primary" size="lg" fullWidth onPress={() => router.replace('/money/bills')}>
            Back to bills
          </Button>
        </EmptyState>
      </Screen>
    );
  }

  const source = primaryWallet(wallets.data);
  const sourceCurrency = source?.currency ?? 'NGN';
  const payAmount = rates.data
    ? convert(String(amount), BILL_CURRENCY, sourceCurrency, rates.data)
    : '0';
  const total = sumAmounts([payAmount, BILL_FEE], sourceCurrency);
  const rate = rates.data?.[`${sourceCurrency}-${BILL_CURRENCY}`];

  const pay = async () => {
    if (biometricsReady) {
      const outcome = await confirmWithBiometrics(
        `Pay ${formatMoney(String(amount), BILL_CURRENCY)}`
      );
      if (outcome !== 'success') return;
    }
    setNode(0);
    setStep('paying');
  };

  if (step === 'paying') {
    const stateFor = (index: number): JourneyState =>
      index < node ? 'done' : index === node ? 'active' : 'todo';

    return (
      <Screen scroll={false}>
        <View style={{ flex: 1, paddingTop: spacing['3xl'] }}>
          <View style={{ alignItems: 'center' }}>
            <Text variant="body" tone="muted">
              {`Paying ${category.biller}`}
            </Text>
            <View style={{ marginTop: spacing.sm }}>
              <MoneyText variant="amountFlow">
                {formatMoney(String(amount), BILL_CURRENCY)}
              </MoneyText>
            </View>
          </View>

          <View style={{ flex: 1, justifyContent: 'center', paddingVertical: spacing['2xl'] }}>
            <JourneyStrip
              orientation="vertical"
              steps={[
                { label: 'Payment authorised', detail: 'Confirmed', state: stateFor(0) },
                { label: 'Converted to NGN', detail: rate ? `at ${rate.toLocaleString('en-GB')} per 1` : '', state: stateFor(1) },
                { label: `Sent to ${category.biller}`, detail: 'Verified biller', state: stateFor(2) },
                { label: 'Bill settled', detail: 'Receipt on its way', state: stateFor(3) },
              ]}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              columnGap: spacing.sm,
            }}
          >
            <Icon name="lock" size={size.icon.sm} color={colors.text.subtle} />
            <Text variant="labelMuted" tone="subtle">
              Encrypted · don&apos;t close the app
            </Text>
          </View>
        </View>
      </Screen>
    );
  }

  if (step === 'done') {
    return (
      <Screen scroll={false}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <SuccessBurst />

          <Text
            variant="celebrationTitle"
            tone="strong"
            accessibilityRole="header"
            style={{ marginTop: spacing.sm }}
          >
            Bill paid!
          </Text>

          <Text variant="body" tone="muted" style={{ textAlign: 'center', marginTop: spacing.sm }}>
            {`${formatMoney(String(amount), BILL_CURRENCY)} paid to ${category.biller} for ${category.account}.`}
          </Text>

          {category.token ? (
            <View style={{ width: '100%', marginTop: spacingRaw.sectionGapSm }}>
              <Card tone="ink">
                <Text variant="caption" style={{ color: colors.text.onInk, opacity: 0.7 }}>
                  Your prepaid token
                </Text>
                <View style={{ marginTop: spacing.sm }}>
                  <MoneyText variant="tokenCode" tone="onInk" testID="prepaid-token">
                    4471 8820 1193 6640
                  </MoneyText>
                </View>
                <Text
                  variant="micro"
                  style={{ color: colors.text.onInk, opacity: 0.6, marginTop: spacing.md }}
                >
                  Enter this token on the meter to load 84.2 kWh.
                </Text>
              </Card>
            </View>
          ) : null}

          <View style={{ width: '100%', marginTop: spacing.md }}>
            <Card tone="sunken">
              <DetailRow label="Reference" value="NP-8841-2207" numeric copyable divider />
              <DetailRow label="You paid" value={formatMoney(total, sourceCurrency)} numeric />
            </Card>
          </View>
        </View>

        <View style={{ rowGap: spacingRaw.buttonStackGap, paddingBottom: spacing.lg }}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            testID="bill-done"
            onPress={() => router.dismissTo('/')}
          >
            Done
          </Button>
          <Button variant="ghost" size="md" fullWidth>
            Share receipt
          </Button>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll={false} header={<ScreenHeader title={category.label} />}>
      <ListRow
        first
        affordance="none"
        leading={
          <RowTile>
            <Text variant="cardTitle" style={{ color: quietFg }}>
              {category.monogram}
            </Text>
          </RowTile>
        }
        title={category.biller}
        subtitle="Nigeria"
        trailing={
          <Badge status="success" size="sm">
            Verified biller
          </Badge>
        }
      />

      <Input
        label={category.field}
        value={category.account}
        editable={false}
        suffix={category.accountName}
        prefix={<Icon name="card" size={size.icon.md} color={colors.text.placeholder} />}
        style={{ marginTop: spacing.xl }}
      />

      <AmountHero
        label="Bill amount"
        currencySymbol={currency(BILL_CURRENCY).symbol}
        amount={formatAmount(String(amount), BILL_CURRENCY)}
        style={{ paddingTop: spacing.xl }}
        testID="bill-amount"
      />

      <ChipGroup
        numeric
        tone="brand"
        align="center"
        style={{ marginTop: spacing.md }}
        options={category.presets.map((preset) => ({
          key: String(preset),
          label: formatAmount(String(preset), BILL_CURRENCY),
        }))}
        value={String(amount)}
        onChange={(next) => next && setAmount(Number(next))}
      />

      <View
        style={{
          marginTop: spacingRaw.sectionGapSm,
          paddingTop: spacing.md,
          borderTopWidth: theme.borderWidth.hairline,
          borderTopColor: colors.border.subtle,
        }}
      >
        <DetailRow
          label="You pay"
          value={formatMoney(total, sourceCurrency)}
          numeric
          emphasis="strong"
          divider
        />
        <DetailRow label="Fee" value={formatMoney(BILL_FEE, sourceCurrency)} numeric />
        <DetailRow
          label="Pays from"
          value={`${currency(sourceCurrency).flag} ${sourceCurrency} wallet`}
        />
      </View>

      <View style={{ flex: 1, minHeight: spacing.md }} />

      <Button
        variant="ink"
        size="lg"
        fullWidth
        testID="pay-bill"
        onPress={() => void pay()}
        style={{ borderRadius: radius.button.lg }}
        iconLeft={
          <Icon
            name={biometricsReady ? 'faceid' : 'lock'}
            size={size.icon.lg}
            color={colors.text.onInk}
          />
        }
      >
        {confirmLabel(`Pay ${formatMoney(String(amount), BILL_CURRENCY)}`, biometricsReady)}
      </Button>
    </Screen>
  );
}

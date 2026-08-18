import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Avatar } from '@/components/data/Avatar';
import { Button } from '@/components/core/Button';
import { Card } from '@/components/core/Card';
import { DetailRow } from '@/components/data/DetailRow';
import { JourneyStrip } from '@/components/feedback/JourneyStrip';
import { ListRow } from '@/components/data/ListRow';
import { MoneyText } from '@/components/data/MoneyText';
import { RowTile, useRowTileForeground } from '@/components/data/RowTile';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { SectionLabel } from '@/components/core/SectionLabel';
import { SkeletonRows } from '@/components/feedback/Skeleton';
import { TRANSFER_FEE } from '@/features/send/SendAmountScreen';
import { confirmLabel, confirmWithBiometrics, isBiometricAvailable } from '@/lib/auth';
import { currency } from '@/lib/currency';
import { convert, formatMoney, sumAmounts } from '@/lib/format';
import { primaryWallet, useRates, useRecipients, useWallets } from '@/lib/api/queries';
import { useSendStore } from '@/store/send';
import { useSessionStore } from '@/store/session';
import { useTheme } from '@/theme/ThemeProvider';

const TILE = 38;
/** How long the quoted rate is guaranteed for. */
const RATE_HOLD_SECONDS = 30;

export function ReviewScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { colors, spacing, spacingRaw, radius, size } = theme;
  const quietFg = useRowTileForeground('quiet');

  const wallets = useWallets();
  const rates = useRates();
  const recipients = useRecipients();

  const amount = useSendStore((s) => s.amount);
  const recipientId = useSendStore((s) => s.recipientId);
  const sourceWalletId = useSendStore((s) => s.sourceWalletId);

  const biometricsEnabled = useSessionStore((s) => s.biometricsEnabled);
  const [biometricsReady, setBiometricsReady] = useState(false);

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

  const source =
    wallets.data?.find((wallet) => wallet.id === sourceWalletId) ?? primaryWallet(wallets.data);
  const recipient =
    recipients.data?.find((entry) => entry.id === recipientId) ?? recipients.data?.[0];

  if (!source || !recipient || rates.isPending) {
    return (
      <Screen header={<ScreenHeader title="Review transfer" />}>
        <SkeletonRows count={3} />
      </Screen>
    );
  }

  const sourceMeta = currency(source.currency);
  const targetCurrency = recipient.country;
  const total = sumAmounts([amount, TRANSFER_FEE], source.currency);
  const lands = rates.data ? convert(amount, source.currency, targetCurrency, rates.data) : '0';
  const rate = rates.data?.[`${source.currency}-${targetCurrency}`];

  /**
   * Every money action passes through confirmation (§8.14). Biometrics when
   * the user has enabled them and the device supports it, the PIN gate
   * otherwise — and the PIN gate is also where a failed or cancelled prompt
   * lands, rather than the transfer simply not happening.
   */
  const confirm = async () => {
    if (biometricsReady) {
      const outcome = await confirmWithBiometrics(`Send ${formatMoney(total, source.currency)}`);
      if (outcome === 'success') {
        router.push('/send/sending');
        return;
      }
    }
    router.push('/send/pin');
  };

  return (
    <Screen header={<ScreenHeader title="Review transfer" />}>
      <Text variant="body" tone="muted">
        Check it once, then confirm.
      </Text>

      <View style={{ alignItems: 'center', paddingTop: spacingRaw.sectionGapSm }}>
        <Text variant="label" tone="muted">
          You send
        </Text>
        <View style={{ marginTop: spacing.sm }}>
          <MoneyText
            variant="amountHero"
            symbol={sourceMeta.symbol}
            symbolRatio={0.62}
            testID="review-amount"
          >
            {formatMoney(amount, source.currency).replace(sourceMeta.symbol, '')}
          </MoneyText>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'baseline', columnGap: 6, marginTop: spacing.sm }}>
          <MoneyText variant="moneySm" tone="in">
            {formatMoney(lands, targetCurrency)}
          </MoneyText>
          <Text variant="labelMuted" tone="muted">
            {`lands with ${recipient.name.split(' ')[0]}`}
          </Text>
        </View>
      </View>

      <JourneyStrip
        style={{ marginTop: spacingRaw.sectionGapSm }}
        compact
        steps={[
          { label: 'You pay', state: 'done' },
          { label: 'We convert', state: 'active' },
          { label: 'They receive', state: 'todo' },
        ]}
      />

      <SectionLabel style={{ marginTop: spacingRaw.sectionGapMd }}>Where it goes</SectionLabel>
      <ListRow
        first
        leading={<Avatar name={recipient.name} flag={currency(recipient.country).flag} size="md" />}
        title={recipient.name}
        subtitle={recipient.handle}
        affordance="none"
      />
      <ListRow
        leading={
          <RowTile size={TILE} radius={radius.tile}>
            <Icon name="bank" size={size.icon.md} color={quietFg} />
          </RowTile>
        }
        title={recipient.handle.split(' · ')[0] ?? recipient.handle}
        subtitle={recipient.handle.split(' · ')[1] ?? ''}
        affordance="none"
      />

      <Card style={{ marginTop: spacingRaw.sectionGapSm }}>
        <DetailRow label="Amount" value={formatMoney(amount, source.currency)} numeric divider />
        <DetailRow label="Fee" value={formatMoney(TRANSFER_FEE, source.currency)} numeric divider />
        <DetailRow
          label="Rate"
          value={
            rate
              ? `${sourceMeta.symbol}1 = ${currency(targetCurrency).symbol}${rate.toLocaleString('en-GB')}`
              : '—'
          }
          numeric
          divider
        />
        <DetailRow
          label="Total to pay"
          value={formatMoney(total, source.currency)}
          numeric
          emphasis="strong"
        />
      </Card>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: spacing.sm,
          marginTop: spacing.lg,
        }}
      >
        <Icon name="lock" size={15} color={colors.text.subtle} />
        <Text variant="caption" tone="subtle">
          {`Rate held for ${RATE_HOLD_SECONDS} seconds`}
        </Text>
      </View>

      <Button
        variant="ink"
        size="lg"
        fullWidth
        style={{ marginTop: spacing.lg }}
        onPress={() => void confirm()}
        testID="confirm-send"
        iconLeft={
          biometricsReady ? (
            <Icon name="faceid" size={size.icon.lg} color={colors.text.onInk} />
          ) : (
            <Icon name="lock" size={size.icon.lg} color={colors.text.onInk} />
          )
        }
      >
        {confirmLabel(`Send ${formatMoney(total, source.currency)}`, biometricsReady)}
      </Button>
    </Screen>
  );
}

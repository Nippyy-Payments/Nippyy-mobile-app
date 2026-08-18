import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { AmountHero } from '@/components/forms/AmountHero';
import { Avatar } from '@/components/data/Avatar';
import { Badge } from '@/components/feedback/Badge';
import { Button } from '@/components/core/Button';
import { ChipGroup } from '@/components/forms/ChipGroup';
import { DetailRow } from '@/components/data/DetailRow';
import { InlineAlert, useAlertIconColor } from '@/components/feedback/InlineAlert';
import { Keypad } from '@/components/forms/Keypad';
import { ListRow } from '@/components/data/ListRow';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { SkeletonRows } from '@/components/feedback/Skeleton';
import { currency } from '@/lib/currency';
import { convert, formatAmount, formatMoney } from '@/lib/format';
import { primaryWallet, useRates, useRecipients, useWallets } from '@/lib/api/queries';
import { useSendStore } from '@/store/send';
import { useTheme } from '@/theme/ThemeProvider';

/** The design's fixed transfer fee, in the source currency. */
export const TRANSFER_FEE = '0.40';
const PRESETS = ['50', '100', '200', '500'];

export function SendAmountScreen({ recipientId }: { recipientId?: string }) {
  const router = useRouter();
  const { theme } = useTheme();
  const { colors, spacing, spacingRaw, size, borderWidth } = theme;
  const dangerFg = useAlertIconColor('danger');

  const wallets = useWallets();
  const rates = useRates();
  const recipients = useRecipients();

  const amount = useSendStore((s) => s.amount);
  const pushKey = useSendStore((s) => s.pushKey);
  const setAmount = useSendStore((s) => s.setAmount);
  const setRecipient = useSendStore((s) => s.setRecipient);
  const setSourceWallet = useSendStore((s) => s.setSourceWallet);
  const sourceWalletId = useSendStore((s) => s.sourceWalletId);

  // The route carries the recipient (§8.6); the wallet defaults to the
  // primary one until the picker changes it (§8.7).
  useEffect(() => {
    if (recipientId) setRecipient(recipientId);
  }, [recipientId, setRecipient]);

  const source =
    wallets.data?.find((wallet) => wallet.id === sourceWalletId) ?? primaryWallet(wallets.data);

  useEffect(() => {
    if (source && !sourceWalletId) setSourceWallet(source.id, source.currency);
  }, [source, sourceWalletId, setSourceWallet]);

  const recipient =
    recipients.data?.find((entry) => entry.id === recipientId) ?? recipients.data?.[0];

  if (wallets.isPending || recipients.isPending || !source) {
    return (
      <Screen scroll={false} header={<ScreenHeader title="Send money" />}>
        <SkeletonRows count={2} />
      </Screen>
    );
  }

  const sourceMeta = currency(source.currency);
  const targetCurrency = recipient?.country ?? 'NGN';
  const targetMeta = currency(targetCurrency);

  // The spend check uses availableBalance, not balance — see §8.7. Showing one
  // and spending against the other is how a user sees money they cannot send.
  const over = Number(amount) > Number(source.availableBalance);
  const empty = Number(amount) <= 0;

  const lands =
    rates.data && !over
      ? convert(amount, source.currency, targetCurrency, rates.data)
      : null;
  const rate = rates.data?.[`${source.currency}-${targetCurrency}`];

  return (
    <Screen scroll={false} header={<ScreenHeader title="Send money" />}>
      {recipient ? (
        <ListRow
          first
          leading={<Avatar name={recipient.name} flag={currency(recipient.country).flag} size="md" />}
          title={recipient.name}
          subtitle={recipient.handle}
          trailing={
            <Badge status={recipient.status === 'verified' ? 'success' : 'warning'} size="sm">
              {recipient.status === 'verified' ? 'Verified' : 'Verifying'}
            </Badge>
          }
          onPress={() => router.push('/recipients')}
        />
      ) : null}

      <AmountHero
        label="You send"
        currencySymbol={sourceMeta.symbol}
        amount={formatAmount(amount, source.currency)}
        state={over ? 'over' : 'default'}
        helper={
          over
            ? `More than your ${source.currency} balance of ${formatMoney(source.availableBalance, source.currency)}`
            : lands
              ? `They get ${formatMoney(lands, targetCurrency)}`
              : undefined
        }
        style={{ paddingTop: spacingRaw.sectionGapSm }}
        testID="send-amount"
      />

      <ChipGroup
        numeric
        tone="brand"
        align="center"
        style={{ marginTop: spacing.md }}
        options={PRESETS}
        value={PRESETS.includes(amount) ? amount : null}
        onChange={(next) => next && setAmount(next)}
      />

      <View
        style={{
          marginTop: spacingRaw.sectionGapSm,
          paddingTop: spacing.md,
          borderTopWidth: borderWidth.hairline,
          borderTopColor: colors.border.subtle,
        }}
      >
        <DetailRow
          label="Rate"
          value={
            rate
              ? `${sourceMeta.symbol}1 = ${targetMeta.symbol}${formatAmount(String(rate), targetCurrency)}`
              : '—'
          }
          numeric
        />
        <DetailRow label="Fee" value={formatMoney(TRANSFER_FEE, source.currency)} numeric />
        <DetailRow label="Arrives" value="In seconds" />
      </View>

      {over ? (
        <InlineAlert
          style={{ marginTop: spacing.md }}
          tone="danger"
          title={`Not enough in your ${source.currency} wallet`}
          detail={`You have ${formatMoney(source.availableBalance, source.currency)}. Add money or switch wallet.`}
          icon={<Icon name="warn" size={size.icon.sm} color={dangerFg} />}
          actions={
            <>
              <Button size="sm" variant="secondary" onPress={() => router.push('/money/fund')}>
                Add money
              </Button>
              <Button size="sm" variant="ghost" onPress={() => router.push('/wallet-picker')}>
                Switch wallet
              </Button>
            </>
          }
        />
      ) : null}

      <View style={{ flex: 1, minHeight: spacing.sm }} />

      <Button
        variant="primary"
        size="lg"
        fullWidth
        disabled={over || empty}
        onPress={() => router.push('/send/review')}
        testID="review-transfer"
      >
        Review transfer
      </Button>

      <Keypad style={{ marginTop: spacing.lg }} onKey={pushKey} />
    </Screen>
  );
}

import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Button } from '@/components/core/Button';
import { Card } from '@/components/core/Card';
import { DetailRow } from '@/components/data/DetailRow';
import { MoneyText } from '@/components/data/MoneyText';
import { SuccessBurst } from '@/components/feedback/SuccessBurst';
import { TRANSFER_FEE } from '@/features/send/SendAmountScreen';
import { currency } from '@/lib/currency';
import { convert, formatMoney, sumAmounts } from '@/lib/format';
import { primaryWallet, useRates, useRecipients, useWallets } from '@/lib/api/queries';
import { useSendStore } from '@/store/send';
import { useTheme } from '@/theme/ThemeProvider';

export function SuccessScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { colors, spacing, spacingRaw, size } = theme;

  const wallets = useWallets();
  const rates = useRates();
  const recipients = useRecipients();

  const amount = useSendStore((s) => s.amount);
  const recipientId = useSendStore((s) => s.recipientId);
  const sourceWalletId = useSendStore((s) => s.sourceWalletId);
  const reference = useSendStore((s) => s.reference);
  const reset = useSendStore((s) => s.reset);

  const source =
    wallets.data?.find((wallet) => wallet.id === sourceWalletId) ?? primaryWallet(wallets.data);
  const recipient =
    recipients.data?.find((entry) => entry.id === recipientId) ?? recipients.data?.[0];

  const sourceCurrency = source?.currency ?? 'GBP';
  const targetCurrency = recipient?.country ?? 'NGN';
  const total = sumAmounts([amount, TRANSFER_FEE], sourceCurrency);
  const lands = rates.data ? convert(amount, sourceCurrency, targetCurrency, rates.data) : '0';
  const rate = rates.data?.[`${sourceCurrency}-${targetCurrency}`];

  const done = () => {
    reset();
    router.dismissTo('/');
  };

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
          Money sent!
        </Text>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'baseline',
            columnGap: 4,
            marginTop: spacing.sm,
          }}
        >
          <MoneyText tone="out" testID="landed-amount">
            {formatMoney(lands, targetCurrency)}
          </MoneyText>
          <Text variant="body" tone="muted" style={{ textAlign: 'center' }}>
            {`is on its way to ${recipient?.name ?? 'your recipient'}. It usually lands in seconds.`}
          </Text>
        </View>

        <View style={{ width: '100%', marginTop: spacingRaw.sectionGapSm }}>
          <Card tone="sunken">
            <DetailRow
              label="Reference"
              value={reference ?? '—'}
              numeric
              copyable
              divider
              testID="reference"
            />
            <DetailRow
              label="You paid"
              value={formatMoney(total, sourceCurrency)}
              numeric
              divider
            />
            <DetailRow
              label="Rate used"
              value={
                rate
                  ? `${currency(sourceCurrency).symbol}1 = ${currency(targetCurrency).symbol}${rate.toLocaleString('en-GB')}`
                  : '—'
              }
              numeric
            />
          </Card>
        </View>
      </View>

      <View style={{ rowGap: spacingRaw.buttonStackGap, paddingBottom: spacing.lg }}>
        <Button variant="primary" size="lg" fullWidth onPress={done} testID="done">
          Done
        </Button>
        <Button
          variant="ghost"
          size="md"
          fullWidth
          iconLeft={<Icon name="share" size={size.icon.sm} color={colors.status.infoText} />}
        >
          Share receipt
        </Button>
      </View>
    </Screen>
  );
}

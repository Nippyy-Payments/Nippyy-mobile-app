import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { JourneyStrip, type JourneyState } from '@/components/feedback/JourneyStrip';
import { MoneyText } from '@/components/data/MoneyText';
import { TRANSFER_FEE } from '@/features/send/SendAmountScreen';
import { formatMoney, sumAmounts } from '@/lib/format';
import { primaryWallet, useRates, useRecipients, useWallets } from '@/lib/api/queries';
import { useSendStore } from '@/store/send';
import { useTheme } from '@/theme/ThemeProvider';

/** Each step lands this many ms after the last. */
const STEP_MS = 800;

export function SendingScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { colors, spacing, size } = theme;

  const wallets = useWallets();
  const rates = useRates();
  const recipients = useRecipients();

  const amount = useSendStore((s) => s.amount);
  const recipientId = useSendStore((s) => s.recipientId);
  const sourceWalletId = useSendStore((s) => s.sourceWalletId);
  const complete = useSendStore((s) => s.complete);

  const [step, setStep] = useState(0);

  const source =
    wallets.data?.find((wallet) => wallet.id === sourceWalletId) ?? primaryWallet(wallets.data);
  const recipient =
    recipients.data?.find((entry) => entry.id === recipientId) ?? recipients.data?.[0];

  const sourceCurrency = source?.currency ?? 'GBP';
  const total = sumAmounts([amount, TRANSFER_FEE], sourceCurrency);
  const rate = rates.data?.[`${sourceCurrency}-${recipient?.country ?? 'NGN'}`];

  const steps = [
    { label: 'Payment authorised', detail: 'Confirmed' },
    { label: `Converted to ${recipient?.country ?? 'NGN'}`, detail: rate ? `at ${rate.toLocaleString('en-GB')} per 1` : '' },
    { label: `Sent to ${recipient?.handle.split(' · ')[0] ?? 'their bank'}`, detail: 'Verified account' },
    { label: `${recipient?.name.split(' ')[0] ?? 'They'} has the money`, detail: 'Receipt on its way' },
  ];

  useEffect(() => {
    const timers = steps.map((_, index) =>
      setTimeout(
        () => {
          if (index === steps.length - 1) {
            complete(`NP-${Date.now().toString().slice(-8, -4)}-${Date.now().toString().slice(-4)}`);
            router.replace('/send/success');
          } else {
            setStep(index + 1);
          }
        },
        STEP_MS * (index + 1)
      )
    );

    return () => timers.forEach(clearTimeout);
    // Runs once: the sequence must not restart when data settles.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stateFor = (index: number): JourneyState =>
    index < step ? 'done' : index === step ? 'active' : 'todo';

  return (
    <Screen scroll={false}>
      <View style={{ flex: 1, paddingTop: spacing['3xl'] }}>
        <View style={{ alignItems: 'center' }}>
          <Text variant="body" tone="muted">
            {`Sending to ${recipient?.name ?? 'your recipient'}`}
          </Text>
          <View style={{ marginTop: spacing.sm }}>
            <MoneyText variant="amountFlow" testID="sending-amount">
              {formatMoney(total, sourceCurrency)}
            </MoneyText>
          </View>
        </View>

        <View style={{ flex: 1, justifyContent: 'center', paddingVertical: spacing['2xl'] }}>
          <JourneyStrip
            orientation="vertical"
            steps={steps.map((entry, index) => ({ ...entry, state: stateFor(index) }))}
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

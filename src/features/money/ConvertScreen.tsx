import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { AmountField } from '@/components/forms/AmountField';
import { Button } from '@/components/core/Button';
import { ChipGroup } from '@/components/forms/ChipGroup';
import { IconButton } from '@/components/core/IconButton';
import { InlineAlert, useAlertIconColor } from '@/components/feedback/InlineAlert';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { SkeletonRows } from '@/components/feedback/Skeleton';
import { StatusDot } from '@/components/feedback/StatusDot';
import { currency } from '@/lib/currency';
import { convert, formatAmount, formatMoney } from '@/lib/format';
import { primaryWallet, useRates, useWallets } from '@/lib/api/queries';
import { useTheme } from '@/theme/ThemeProvider';

const PRESETS = ['50', '100', '200', '500'];
/** The swap control overlaps the seam between the two fields. */
const SWAP_SIZE = 46;

export function ConvertScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { colors, spacing, spacingRaw, size, borderWidth } = theme;
  const successFg = useAlertIconColor('success');

  const wallets = useWallets();
  const rates = useRates();

  const [amount, setAmount] = useState('200');
  const [fromId, setFromId] = useState<string | null>(null);
  const [toId, setToId] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (wallets.isPending || rates.isPending || !wallets.data) {
    return (
      <Screen header={<ScreenHeader title="Convert money" />}>
        <SkeletonRows count={2} />
      </Screen>
    );
  }

  const list = wallets.data;
  const from = list.find((w) => w.id === fromId) ?? primaryWallet(list) ?? list[0];
  const to = list.find((w) => w.id === toId) ?? list.find((w) => w.id !== from?.id) ?? list[1];

  if (!from || !to) {
    return (
      <Screen header={<ScreenHeader title="Convert money" />}>
        <SkeletonRows count={2} />
      </Screen>
    );
  }

  const rate = rates.data?.[`${from.currency}-${to.currency}`];
  const output = rates.data ? convert(amount, from.currency, to.currency, rates.data) : '0';

  /** Steps to the next wallet that is not the other side of the pair. */
  const cycle = (current: string, otherId: string, set: (id: string) => void) => {
    const options = list.filter((wallet) => wallet.id !== otherId);
    const index = options.findIndex((wallet) => wallet.id === current);
    const next = options[(index + 1) % options.length];
    if (next) set(next.id);
  };

  return (
    <Screen header={<ScreenHeader title="Convert money" />}>
      <Text variant="body" tone="muted">
        Move money between your own wallets.
      </Text>

      {/* The two fields sit as a pair with the swap control on their seam. In
          CSS that is a 50%/50% translate; RN has no percentage translate, so
          the control is centred with a half-height offset instead. */}
      <View style={{ marginTop: spacing.xl }}>
        <AmountField
          label="From"
          balance={formatMoney(from.balance, from.currency)}
          currency={from.currency}
          currencySymbol={currency(from.currency).symbol}
          flag={currency(from.currency).flag}
          amount={formatAmount(amount, from.currency)}
          editable={false}
          onCurrencyPress={() => cycle(from.id, to.id, setFromId)}
          testID="convert-from"
        />

        <AmountField
          style={{ marginTop: spacing.sm }}
          tone="brand"
          label="To"
          balance={formatMoney(to.balance, to.currency)}
          currency={to.currency}
          currencySymbol={currency(to.currency).symbol}
          flag={currency(to.currency).flag}
          amount={formatAmount(output, to.currency)}
          editable={false}
          onCurrencyPress={() => cycle(to.id, from.id, setToId)}
          testID="convert-to"
        />

        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            marginTop: -SWAP_SIZE / 2,
            alignItems: 'center',
          }}
        >
          <IconButton
            variant="quiet"
            size="lg"
            shape="circle"
            label="Swap wallets"
            testID="swap"
            onPress={() => {
              setFromId(to.id);
              setToId(from.id);
            }}
            style={{
              backgroundColor: colors.surface.page,
              borderWidth: borderWidth.hairline,
              borderColor: colors.border.subtle,
            }}
          >
            <Icon name="swap" size={size.icon.lg} color={colors.text.link} />
          </IconButton>
        </View>
      </View>

      <Button
        variant="ghost"
        size="sm"
        style={{ alignSelf: 'center', marginTop: spacing.lg }}
        onPress={() => router.push('/money/rates')}
        iconLeft={<StatusDot tone="success" />}
      >
        {rate
          ? `Live rate · 1 ${from.currency} = ${formatAmount(String(rate), to.currency)} ${to.currency}`
          : 'Live rate unavailable'}
      </Button>

      <ChipGroup
        numeric
        tone="brand"
        align="center"
        style={{ marginTop: spacing.lg }}
        options={PRESETS}
        value={PRESETS.includes(amount) ? amount : null}
        onChange={(next) => next && setAmount(next)}
      />

      <View style={{ flex: 1, minHeight: spacing.lg }} />

      {done ? (
        <>
          <InlineAlert
            tone="success"
            title={`Done. Your ${to.currency} wallet is topped up.`}
            icon={<Icon name="check" size={size.icon.sm} color={successFg} />}
            style={{ marginBottom: spacing.md }}
          />
          <Button variant="outline" size="lg" fullWidth onPress={() => router.back()}>
            Back to wallets
          </Button>
        </>
      ) : (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={() => setDone(true)}
          testID="convert"
          style={{ marginTop: spacingRaw.sectionGapSm }}
        >
          {`Convert ${formatMoney(amount, from.currency)}`}
        </Button>
      )}
    </Screen>
  );
}

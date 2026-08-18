import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Button } from '@/components/core/Button';
import { ErrorState } from '@/components/feedback/ErrorState';
import { IconButton, useIconButtonForeground } from '@/components/core/IconButton';
import { InlineAlert, useAlertIconColor } from '@/components/feedback/InlineAlert';
import { ListRow } from '@/components/data/ListRow';
import { MoneyText } from '@/components/data/MoneyText';
import { RowTile } from '@/components/data/RowTile';
import { ScreenTitle } from '@/components/core/ScreenTitle';
import { SectionLabel } from '@/components/core/SectionLabel';
import { Skeleton, SkeletonRows } from '@/components/feedback/Skeleton';
import { EmptyState, useEmptyStateIconColor } from '@/components/feedback/EmptyState';
import { currency, STABLECOIN } from '@/lib/currency';
import { convert, formatAmount, formatMoney } from '@/lib/format';
import { HOME_CURRENCY, totalInHomeCurrency, useRates, useWallets } from '@/lib/api/queries';
import { useSessionStore } from '@/store/session';
import { useTheme } from '@/theme/ThemeProvider';

export function WalletsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { colors, spacing, spacingRaw, size } = theme;

  const masked = useSessionStore((s) => s.balanceHidden);
  const toggleMasked = useSessionStore((s) => s.toggleBalanceHidden);
  const quietFg = useIconButtonForeground('quiet');
  const infoFg = useAlertIconColor('info');
  const emptyFg = useEmptyStateIconColor();

  const wallets = useWallets();
  const rates = useRates();

  const total = totalInHomeCurrency(wallets.data, rates.data);
  const balanceLoading = wallets.isPending || rates.isPending;

  return (
    <Screen
      withTabBar
      onRefresh={() => {
        void wallets.refetch();
        void rates.refetch();
      }}
      refreshing={wallets.isRefetching}
    >
      <ScreenTitle subhead="What you hold, ready to send home.">Your wallets</ScreenTitle>

      <View style={{ paddingTop: spacingRaw.sectionGapSm }}>
        <Text variant="label" tone="muted">
          Total balance
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm }}>
          {balanceLoading ? (
            <Skeleton width="55%" height={34} testID="balance-skeleton" />
          ) : total === null ? (
            <Text variant="balance" tone="subtle">
              —
            </Text>
          ) : (
            <MoneyText
              variant="balance"
              symbol={currency(HOME_CURRENCY).symbol}
              symbolRatio={0.7}
              masked={masked}
            >
              {formatAmount(total, HOME_CURRENCY)}
            </MoneyText>
          )}

          <View style={{ flex: 1 }} />
          <IconButton
            variant="quiet"
            size="sm"
            label={masked ? 'Show balance' : 'Hide balance'}
            onPress={toggleMasked}
            testID="mask-toggle"
          >
            <Icon name={masked ? 'eyeOff' : 'eye'} size={size.icon.md} color={quietFg} />
          </IconButton>
        </View>

        <View style={{ flexDirection: 'row', columnGap: spacing.sm, marginTop: spacing.lg }}>
          <Button
            variant="outline"
            size="md"
            onPress={() => router.push('/money/fund')}
            iconLeft={<Icon name="plus" size={16} color={colors.text.strong} />}
          >
            Add money
          </Button>
          <Button
            variant="outline"
            size="md"
            onPress={() => router.push('/money/convert')}
            iconLeft={<Icon name="convert" size={16} color={colors.text.strong} />}
          >
            Convert
          </Button>
        </View>
      </View>

      <View style={{ marginTop: spacingRaw.sectionGapMd }}>
        {wallets.isPending ? (
          <>
            <SectionLabel>Wallets</SectionLabel>
            <SkeletonRows count={4} />
          </>
        ) : wallets.isError ? (
          <ErrorState
            title="We could not load your wallets"
            body="Your money is safe. This is just the list."
            onRetry={() => void wallets.refetch()}
          />
        ) : wallets.data.length === 0 ? (
          <EmptyState
            icon={<Icon name="coin" size={size.icon['2xl']} color={emptyFg} />}
            title="No wallets yet"
            body="Add money in any currency and a wallet opens for it automatically."
          >
            <Button variant="primary" size="lg" fullWidth onPress={() => router.push('/money/fund')}>
              Add money
            </Button>
          </EmptyState>
        ) : (
          <>
            <SectionLabel>{`${wallets.data.length} wallets`}</SectionLabel>
            {wallets.data.map((wallet, index) => {
              const meta = currency(wallet.currency);
              const inNaira = rates.data
                ? convert(wallet.balance, wallet.currency, HOME_CURRENCY, rates.data)
                : null;

              return (
                <ListRow
                  key={wallet.id}
                  first={index === 0}
                  leading={
                    <RowTile tone="sunken">
                      <Text variant="emptyTitle">{meta.flag}</Text>
                    </RowTile>
                  }
                  title={meta.name}
                  subtitle={meta.capability}
                  affordance="none"
                  trailing={
                    <View style={{ alignItems: 'flex-end' }}>
                      <MoneyText masked={masked}>
                        {formatMoney(wallet.balance, wallet.currency)}
                      </MoneyText>
                      {!masked && inNaira && wallet.currency !== HOME_CURRENCY ? (
                        <MoneyText variant="moneySm" tone="subtle">
                          {`≈ ${formatMoney(inNaira, HOME_CURRENCY)}`}
                        </MoneyText>
                      ) : null}
                    </View>
                  }
                  onPress={() => router.push('/money/convert')}
                />
              );
            })}
          </>
        )}
      </View>

      <InlineAlert
        style={{ marginTop: spacingRaw.sectionGapSm }}
        tone="info"
        title={`${STABLECOIN} is the only stablecoin`}
        detail="Deposits arrive on Ethereum, Base or Polygon. There is no other coin to choose."
        icon={<Icon name="coin" size={size.icon.sm} color={infoFg} />}
      />
    </Screen>
  );
}

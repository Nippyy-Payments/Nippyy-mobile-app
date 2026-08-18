import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Avatar } from '@/components/data/Avatar';
import { Badge } from '@/components/feedback/Badge';
import { Button } from '@/components/core/Button';
import { ErrorState } from '@/components/feedback/ErrorState';
import { IconButton, useIconButtonForeground } from '@/components/core/IconButton';
import { ListRow } from '@/components/data/ListRow';
import { MoneyText } from '@/components/data/MoneyText';
import { SectionLabel } from '@/components/core/SectionLabel';
import { Skeleton, SkeletonRows } from '@/components/feedback/Skeleton';
import { StatusDot } from '@/components/feedback/StatusDot';
import { TransactionRow } from '@/components/data/TransactionRow';
import { currency } from '@/lib/currency';
import { formatAmount, formatMoney, formatWhen } from '@/lib/format';
import {
  HOME_CURRENCY,
  totalInHomeCurrency,
  useRates,
  useRecipients,
  useTransactions,
  useWallets,
} from '@/lib/api/queries';
import { useSessionStore } from '@/store/session';
import { useTheme } from '@/theme/ThemeProvider';

/** The dropdown shows the three largest wallets by value, not all of them. */
const TOP_WALLETS = 3;
const RECENT_COUNT = 3;

/** The three quiet actions under the one filled button. */
const QUICK_ACTIONS = [
  { label: 'Add money', icon: 'plus', href: '/money/fund' },
  { label: 'Bills', icon: 'bill', href: '/money/bills' },
  { label: 'Convert', icon: 'convert', href: '/money/convert' },
] as const;

export function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { colors, spacing, spacingRaw, size, radius, borderWidth } = theme;

  const [balanceOpen, setBalanceOpen] = useState(false);
  const [peopleOpen, setPeopleOpen] = useState(true);

  const masked = useSessionStore((s) => s.balanceHidden);
  const toggleMasked = useSessionStore((s) => s.toggleBalanceHidden);
  const quietFg = useIconButtonForeground('quiet');

  const wallets = useWallets();
  const rates = useRates();
  const recipients = useRecipients();
  const transactions = useTransactions();

  const total = totalInHomeCurrency(wallets.data, rates.data);
  const balanceLoading = wallets.isPending || rates.isPending;

  const topWallets = [...(wallets.data ?? [])]
    .sort((a, b) => Number(b.balance) - Number(a.balance))
    .slice(0, TOP_WALLETS);

  const refetchAll = () => {
    void wallets.refetch();
    void rates.refetch();
    void recipients.refetch();
    void transactions.refetch();
  };

  const refreshing =
    wallets.isRefetching || recipients.isRefetching || transactions.isRefetching;

  return (
    <Screen withTabBar onRefresh={refetchAll} refreshing={refreshing}>
      {/* Greeting. The design makes this a sticky bar; here it is a fixed
          header outside the scroll view — see PORTING_PLAN.md §5.12. */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: spacing.md,
          paddingBottom: spacing.md,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: spacingRaw.greetingGap,
          }}
        >
          <Avatar name="Tobi Adeyemi" size="sm" />
          <Text variant="greeting" tone="strong">
            Good afternoon, Tobi
          </Text>
        </View>

        <IconButton
          variant="ghost"
          label="Notifications"
          onPress={() => router.push('/account/notifications')}
        >
          <View>
            <Icon name="bell" size={19} color={colors.text.body} />
            <StatusDot
              tone="brand"
              style={{ position: 'absolute', top: -1, right: -1 }}
            />
          </View>
        </IconButton>
      </View>

      {/* Total balance */}
      <View style={{ paddingTop: spacingRaw.sectionGapMd }}>
        <Text variant="label" tone="muted">
          Total balance
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm }}>
          {balanceLoading ? (
            <Skeleton width="60%" height={46} testID="balance-skeleton" />
          ) : total === null ? (
            <Text variant="balance" tone="subtle">
              —
            </Text>
          ) : (
            <MoneyText
              variant="balanceHero"
              symbol={currency(HOME_CURRENCY).symbol}
              symbolRatio={0.62}
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

        {wallets.data ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onPress={() => setBalanceOpen((open) => !open)}
              testID="wallet-dropdown"
              style={{ marginTop: spacing.sm, paddingHorizontal: 0 }}
              iconRight={
                <Icon
                  name="chevronDown"
                  size={14}
                  color={colors.text.muted}
                  strokeWidth={2}
                />
              }
            >
              {`Across ${wallets.data.length} wallets`}
            </Button>

            {balanceOpen ? (
              <View style={{ marginTop: spacing.md }}>
                {topWallets.map((wallet) => {
                  const meta = currency(wallet.currency);
                  return (
                    <View
                      key={wallet.id}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        columnGap: spacing.md,
                        paddingVertical: spacing.md,
                        borderTopWidth: borderWidth.hairline,
                        borderTopColor: colors.border.subtle,
                      }}
                    >
                      <Text variant="emptyTitle">{meta.flag}</Text>
                      <Text variant="labelMuted" tone="muted" style={{ flex: 1 }}>
                        {meta.name}
                      </Text>
                      <MoneyText masked={masked}>
                        {formatMoney(wallet.balance, wallet.currency)}
                      </MoneyText>
                    </View>
                  );
                })}

                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  style={{ marginTop: spacing.md }}
                  onPress={() => router.push('/wallets')}
                  iconRight={
                    <Icon name="chevronRight" size={15} color={colors.text.strong} strokeWidth={2} />
                  }
                >
                  All wallets
                </Button>
              </View>
            ) : null}
          </>
        ) : null}
      </View>

      {/* One filled action, then three quiet ones */}
      <View style={{ marginTop: spacingRaw.sectionGapMd }}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={() => router.push('/send')}
          iconLeft={<Icon name="send" size={19} color={colors.text.onBrand} />}
        >
          Send money
        </Button>

        <View style={{ flexDirection: 'row', columnGap: spacing.sm, marginTop: spacing.sm }}>
          {QUICK_ACTIONS.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              size="sm"
              style={{ flex: 1, height: size.tapMin, borderRadius: radius.field }}
              onPress={() => router.push(action.href)}
              iconLeft={<Icon name={action.icon} size={16} color={colors.text.strong} />}
            >
              {action.label}
            </Button>
          ))}
        </View>
      </View>

      {/* Your people */}
      <View style={{ marginTop: spacingRaw.sectionGapLg }}>
        <SectionLabel
          action={
            <Button variant="ghost" size="sm" onPress={() => router.push('/recipients')}>
              Add
            </Button>
          }
        >
          <Button
            variant="ghost"
            size="sm"
            style={{ paddingHorizontal: 0 }}
            onPress={() => setPeopleOpen((open) => !open)}
            testID="people-toggle"
            iconRight={
              <Icon name="chevronDown" size={16} color={colors.text.muted} strokeWidth={2} />
            }
          >
            Your people
          </Button>
        </SectionLabel>

        {recipients.isPending ? (
          <SkeletonRows count={3} />
        ) : recipients.isError ? (
          <ErrorState
            title="We could not load your people"
            body="Your recipients are safe. This is just the list."
            onRetry={() => void recipients.refetch()}
          />
        ) : peopleOpen ? (
          recipients.data.map((recipient, index) => (
            <ListRow
              key={recipient.id}
              first={index === 0}
              leading={
                <Avatar
                  name={recipient.name}
                  flag={currency(recipient.country).flag}
                  size="md"
                />
              }
              title={recipient.name}
              subtitle={recipient.handle}
              affordance="none"
              trailing={
                recipient.status === 'verifying' ? (
                  <Badge status="warning" size="sm">
                    Verifying
                  </Badge>
                ) : null
              }
              testID={`recipient-${recipient.id}`}
              onPress={() => router.push(`/send?recipient=${recipient.id}`)}
            />
          ))
        ) : null}
      </View>

      {/* Recent */}
      <View style={{ marginTop: spacingRaw.sectionGapLg }}>
        <SectionLabel
          action={
            <Button variant="ghost" size="sm" onPress={() => router.push('/activity')}>
              See all
            </Button>
          }
        >
          Recent
        </SectionLabel>

        {transactions.isPending ? (
          <SkeletonRows count={RECENT_COUNT} />
        ) : transactions.isError ? (
          <ErrorState
            title="We could not load your activity"
            onRetry={() => void transactions.refetch()}
          />
        ) : (
          transactions.data.slice(0, RECENT_COUNT).map((transaction, index) => (
            <TransactionRow
              key={transaction.id}
              first={index === 0}
              name={transaction.counterparty}
              subtitle={`${transaction.context} · ${formatWhen(transaction.createdAt)}`}
              amount={formatAmount(transaction.amount, transaction.currency)}
              currencySymbol={currency(transaction.currency).symbol}
              direction={transaction.direction}
              status={transaction.status}
              flag={currency(transaction.currency).flag}
              testID={`recent-${transaction.id}`}
              onPress={() => router.push(`/transaction/${transaction.id}`)}
            />
          ))
        )}
      </View>
    </Screen>
  );
}

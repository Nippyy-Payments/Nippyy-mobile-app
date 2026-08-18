import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { RefreshControl, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { ChipGroup } from '@/components/forms/ChipGroup';
import { EmptyState, useEmptyStateIconColor } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { ScreenTitle } from '@/components/core/ScreenTitle';
import { SectionLabel } from '@/components/core/SectionLabel';
import { SkeletonRows } from '@/components/feedback/Skeleton';
import { TransactionRow } from '@/components/data/TransactionRow';
import { currency } from '@/lib/currency';
import { formatAmount, formatWhen } from '@/lib/format';
import { useTransactions } from '@/lib/api/queries';
import type { Transaction } from '@/lib/api/types';
import { useTheme } from '@/theme/ThemeProvider';

const FILTERS = ['All', 'Sent', 'Received', 'Bills'] as const;
type Filter = (typeof FILTERS)[number];

function matches(transaction: Transaction, filter: Filter): boolean {
  switch (filter) {
    case 'Sent':
      return transaction.direction === 'out' && transaction.kind === 'transfer';
    case 'Received':
      return transaction.direction === 'in';
    case 'Bills':
      return transaction.kind === 'bill';
    default:
      return true;
  }
}

export function ActivityScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { spacing, spacingRaw, gutter, size } = theme;

  const [filter, setFilter] = useState<Filter>('All');
  const emptyFg = useEmptyStateIconColor();
  const transactions = useTransactions();

  const visible = useMemo(
    () => (transactions.data ?? []).filter((transaction) => matches(transaction, filter)),
    [transactions.data, filter]
  );

  const header = (
    <View style={{ paddingBottom: spacing.md }}>
      <ScreenTitle>Activity</ScreenTitle>
      <ChipGroup
        style={{ marginTop: spacing.md }}
        options={[...FILTERS]}
        value={filter}
        onChange={(next) => setFilter((next as Filter) ?? 'All')}
      />
    </View>
  );

  if (transactions.isPending) {
    return (
      <Screen withTabBar header={header}>
        <SkeletonRows count={5} />
      </Screen>
    );
  }

  if (transactions.isError) {
    return (
      <Screen withTabBar header={header}>
        <ErrorState
          title="We could not load your activity"
          body="Your transfers are unaffected. This is just the history."
          onRetry={() => void transactions.refetch()}
        />
      </Screen>
    );
  }

  if (visible.length === 0) {
    return (
      <Screen withTabBar header={header}>
        <EmptyState
          icon={<Icon name="clock" size={size.icon['2xl']} color={emptyFg} />}
          title={filter === 'All' ? 'Nothing here yet' : 'Nothing under this filter'}
          body={
            filter === 'All'
              ? 'Transfers, deposits and bill payments will show up here.'
              : 'Try another filter, or clear it to see everything.'
          }
        />
      </Screen>
    );
  }

  /* This is one of only two lists in the app that can exceed ~20 rows, so it
     is virtualised. Everything else is a short fixed stack where FlashList
     would cost more than it saves — see PORTING_PLAN.md §10. */
  return (
    <Screen withTabBar scroll={false} header={header} contentStyle={{ flex: 1 }}>
      <FlashList
        data={visible}
        keyExtractor={(transaction) => transaction.id}
        ListHeaderComponent={<SectionLabel>This week</SectionLabel>}
        contentContainerStyle={{ paddingBottom: spacingRaw.tabScreenBottom }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={transactions.isRefetching}
            onRefresh={() => void transactions.refetch()}
          />
        }
        renderItem={({ item, index }) => (
          <TransactionRow
            first={index === 0}
            gutter={gutter.default}
            name={item.counterparty}
            subtitle={`${item.context} · ${formatWhen(item.createdAt)}`}
            amount={formatAmount(item.amount, item.currency)}
            currencySymbol={currency(item.currency).symbol}
            direction={item.direction}
            status={item.status}
            flag={currency(item.currency).flag}
            testID={`txn-${item.id}`}
            onPress={() => router.push(`/transaction/${item.id}`)}
          />
        )}
      />
    </Screen>
  );
}

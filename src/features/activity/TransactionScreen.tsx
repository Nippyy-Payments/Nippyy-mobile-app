import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Avatar } from '@/components/data/Avatar';
import { Badge, type BadgeStatus } from '@/components/feedback/Badge';
import { Button } from '@/components/core/Button';
import { Card } from '@/components/core/Card';
import { DetailRow } from '@/components/data/DetailRow';
import { ErrorState } from '@/components/feedback/ErrorState';
import { JourneyStrip, type JourneyState } from '@/components/feedback/JourneyStrip';
import { MoneyText } from '@/components/data/MoneyText';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { SectionLabel } from '@/components/core/SectionLabel';
import { Skeleton } from '@/components/feedback/Skeleton';
import { currency } from '@/lib/currency';
import { formatAmount, formatMoney, formatWhen } from '@/lib/format';
import { useTransaction } from '@/lib/api/queries';
import type { Transaction } from '@/lib/api/types';
import { useTheme } from '@/theme/ThemeProvider';

const STATUS: Record<Transaction['status'], { label: string; badge: BadgeStatus }> = {
  success: { label: 'Completed', badge: 'success' },
  pending: { label: 'Pending', badge: 'warning' },
  failed: { label: 'Failed', badge: 'danger' },
};

/** A failed transfer stops at conversion; a pending one is still in flight. */
function journeyFor(status: Transaction['status']): JourneyState[] {
  if (status === 'success') return ['done', 'done', 'done'];
  if (status === 'pending') return ['done', 'active', 'todo'];
  return ['done', 'done', 'todo'];
}

export function TransactionScreen({ id }: { id: string }) {
  const router = useRouter();
  const { theme } = useTheme();
  const { spacing, spacingRaw, size, colors } = theme;

  const query = useTransaction(id);

  if (query.isPending) {
    return (
      <Screen header={<ScreenHeader title="Transfer" />}>
        <View style={{ alignItems: 'center', rowGap: spacing.md, paddingTop: spacing.md }}>
          <Skeleton width={size.avatar.xl} height={size.avatar.xl} radius={size.avatar.xl / 2} />
          <Skeleton width="55%" height={38} />
          <Skeleton width={110} height={24} radius={999} />
        </View>
      </Screen>
    );
  }

  if (query.isError || !query.data) {
    return (
      <Screen header={<ScreenHeader title="Transfer" />}>
        <ErrorState
          title="We could not find that transfer"
          body="It may have been removed, or the link is out of date."
          onRetry={() => void query.refetch()}
          retryLabel="Try again"
        />
        <Button variant="ghost" size="md" fullWidth onPress={() => router.back()}>
          Back to activity
        </Button>
      </Screen>
    );
  }

  const transaction = query.data;
  const meta = currency(transaction.currency);
  const status = STATUS[transaction.status];
  const [pay, convertStep, deliver] = journeyFor(transaction.status);
  const sign = transaction.direction === 'in' ? '+' : '-';

  return (
    <Screen header={<ScreenHeader title="Transfer" />}>
      <View style={{ alignItems: 'center', paddingTop: spacing.md }}>
        <Avatar name={transaction.counterparty} flag={meta.flag} size="xl" />

        <View style={{ marginTop: spacing.md }}>
          <MoneyText
            variant="amountDetail"
            tone={transaction.direction === 'in' ? 'in' : 'out'}
            testID="amount"
          >
            {`${sign}${formatMoney(transaction.amount, transaction.currency)}`}
          </MoneyText>
        </View>

        <View style={{ marginTop: spacing.sm }}>
          <Badge status={status.badge} dot>
            {status.label}
          </Badge>
        </View>

        <Text variant="labelMuted" tone="muted" style={{ marginTop: spacing.md }}>
          {`${transaction.direction === 'in' ? 'From' : 'To'} ${transaction.counterparty} · ${formatWhen(transaction.createdAt)}`}
        </Text>
      </View>

      <JourneyStrip
        style={{ marginTop: spacingRaw.sectionGapSm }}
        compact
        steps={[
          { label: 'You paid', state: pay ?? 'todo' },
          { label: 'Converted', state: convertStep ?? 'todo' },
          { label: 'Delivered', state: deliver ?? 'todo' },
        ]}
      />

      {transaction.paidAmount && transaction.paidCurrency ? (
        <View style={{ marginTop: spacingRaw.sectionGapMd }}>
          <SectionLabel>Breakdown</SectionLabel>
          <Card>
            <DetailRow
              label="You paid"
              value={formatMoney(transaction.paidAmount, transaction.paidCurrency)}
              numeric
              divider
            />
            {transaction.fee ? (
              <DetailRow
                label="Fee"
                value={formatMoney(transaction.fee, transaction.paidCurrency)}
                numeric
                divider
              />
            ) : null}
            {transaction.rate ? (
              <DetailRow
                label="Rate used"
                value={`${currency(transaction.paidCurrency).symbol}1 = ${meta.symbol}${formatAmount(transaction.rate, transaction.currency)}`}
                numeric
                divider
              />
            ) : null}
            <DetailRow
              label={transaction.status === 'success' ? 'They received' : 'They will receive'}
              value={formatMoney(transaction.amount, transaction.currency)}
              numeric
              emphasis="money"
            />
          </Card>
        </View>
      ) : null}

      <View style={{ marginTop: spacingRaw.sectionGapSm }}>
        <SectionLabel>Details</SectionLabel>
        <Card tone="sunken">
          <DetailRow
            label="Reference"
            value={transaction.reference}
            numeric
            copyable
            divider
            testID="reference"
          />
          {transaction.bank ? <DetailRow label="Bank" value={transaction.bank} divider /> : null}
          <DetailRow
            label="Paid from"
            value={
              transaction.paidCurrency
                ? `${currency(transaction.paidCurrency).flag} ${transaction.paidCurrency} wallet`
                : `${meta.flag} ${transaction.currency} wallet`
            }
          />
        </Card>
      </View>

      <View style={{ marginTop: spacingRaw.sectionGapSm, rowGap: spacingRaw.buttonStackGap }}>
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          onPress={() => router.push('/send')}
          iconLeft={<Icon name="send" size={size.icon.md} color={colors.status.infoText} />}
        >
          Send again
        </Button>
        <Button variant="ghost" size="md" fullWidth>
          Report a problem
        </Button>
      </View>
    </Screen>
  );
}

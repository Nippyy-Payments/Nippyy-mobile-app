import { FlashList } from '@shopify/flash-list';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Button } from '@/components/core/Button';
import { Card } from '@/components/core/Card';
import { EmptyState, useEmptyStateIconColor } from '@/components/feedback/EmptyState';
import { RowTile, useRowTileForeground, type RowTileTone } from '@/components/data/RowTile';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { SectionLabel } from '@/components/core/SectionLabel';
import { StatusDot } from '@/components/feedback/StatusDot';
import { useTheme } from '@/theme/ThemeProvider';
import type { IconName } from '@/components/icons';

type Notification = {
  id: string;
  group: string;
  icon: IconName;
  tone: RowTileTone;
  title: string;
  body: string;
  time: string;
  unread?: boolean;
};

const NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    group: 'Today',
    icon: 'down',
    tone: 'success',
    title: 'Ada received your money',
    body: '₦200,000 landed in her GTBank account.',
    time: '2m',
    unread: true,
  },
  {
    id: 'n2',
    group: 'Today',
    icon: 'shield',
    tone: 'brand',
    title: 'New sign-in confirmed',
    body: 'Signed in on your iPhone 15 at 14:20.',
    time: '1h',
    unread: true,
  },
  {
    id: 'n3',
    group: 'Today',
    icon: 'rate',
    tone: 'brand',
    title: 'Good rate for Nigeria',
    body: 'One pound now buys ₦1,985. That is above your ₦1,960 target.',
    time: '5h',
  },
  {
    id: 'n4',
    group: 'Earlier',
    icon: 'bill',
    tone: 'success',
    title: 'Electricity bill paid',
    body: 'Your Ikeja Electric token is ready.',
    time: 'Tue',
  },
  {
    id: 'n5',
    group: 'Earlier',
    icon: 'warn',
    tone: 'warning',
    title: 'Verify Amara to keep sending',
    body: 'One step left to confirm her account.',
    time: 'Mon',
  },
];

const TILE = 38;

/**
 * Notifications.
 *
 * The empty variant is a state of this screen, not a separate route
 * (PORTING_PLAN.md §8.11). `empty` exists so the state stays reachable while
 * there is no way to clear the list.
 */
export function NotificationsScreen({ empty = false }: { empty?: boolean }) {
  const { theme } = useTheme();
  const { spacing, spacingRaw, radius, size } = theme;
  const emptyFg = useEmptyStateIconColor();

  const items = empty ? [] : NOTIFICATIONS;
  const groups = [...new Set(items.map((item) => item.group))];

  const header = (
    <ScreenHeader
      title="Notifications"
      action={
        items.length > 0 ? (
          <Button variant="ghost" size="sm">
            Mark read
          </Button>
        ) : null
      }
    />
  );

  if (items.length === 0) {
    return (
      <Screen header={header}>
        <EmptyState
          icon={<Icon name="bell" size={size.icon['2xl']} color={emptyFg} />}
          title="Nothing yet"
          body="When money moves, or your rate is strong, you will hear about it here first."
        />
      </Screen>
    );
  }

  /* The second of only two lists that can outgrow a screen, so it is
     virtualised — see PORTING_PLAN.md §10. */
  return (
    <Screen scroll={false} header={header} contentStyle={{ flex: 1 }}>
      <FlashList
        data={groups}
        keyExtractor={(group) => group}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing['4xl'] }}
        renderItem={({ item: group }) => (
          <View style={{ marginTop: spacingRaw.sectionGapSm }}>
            <SectionLabel>{group}</SectionLabel>
            <View style={{ rowGap: spacing.md }}>
              {items
                .filter((item) => item.group === group)
                .map((item) => (
                  <NotificationCard key={item.id} item={item} tile={TILE} radius={radius.tile} />
                ))}
            </View>
          </View>
        )}
      />
    </Screen>
  );
}

function NotificationCard({
  item,
  tile,
  radius,
}: {
  item: Notification;
  tile: number;
  radius: number;
}) {
  const { theme } = useTheme();
  const { spacing } = theme;
  const tileFg = useRowTileForeground(item.tone);

  return (
    <Card
      padding="sm"
      tone={item.tone === 'warning' ? 'quiet' : 'surface'}
      testID={`notification-${item.id}`}
      style={{ flexDirection: 'row', alignItems: 'flex-start', columnGap: spacing.md }}
    >
      <RowTile tone={item.tone} size={tile} radius={radius}>
        <Icon name={item.icon} size={theme.size.icon.md} color={tileFg} />
      </RowTile>

      <View style={{ flex: 1, minWidth: 0 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            columnGap: spacing.sm,
          }}
        >
          <Text variant="cardTitle" tone="strong" style={{ flex: 1, minWidth: 0 }}>
            {item.title}
          </Text>
          <Text variant="micro" tone="subtle">
            {item.time}
          </Text>
        </View>
        <Text variant="labelMuted" tone="muted" style={{ marginTop: 2 }}>
          {item.body}
        </Text>
      </View>

      {item.unread ? <StatusDot tone="brand" size={8} style={{ marginTop: spacing.xs }} /> : null}
    </Card>
  );
}

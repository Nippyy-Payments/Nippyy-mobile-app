import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Avatar } from '@/components/data/Avatar';
import { Badge } from '@/components/feedback/Badge';
import { Button } from '@/components/core/Button';
import { ListRow } from '@/components/data/ListRow';
import { MoneyText } from '@/components/data/MoneyText';
import { RowTile, useRowTileForeground } from '@/components/data/RowTile';
import { ScreenTitle } from '@/components/core/ScreenTitle';
import { SectionLabel } from '@/components/core/SectionLabel';
import { Text } from '@/components/Text';
import { TransactionRow } from '@/components/data/TransactionRow';
import { useSessionStore } from '@/store/session';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Home — navigation stub for phase 3.
 *
 * Enough of the real screen to exercise every route it will own: a pushed
 * screen, a flow outside the tabs, a modal, and a parameterised detail route.
 * Built properly in phase 5.
 */
export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { spacing, spacingRaw, size, colors } = theme;

  const masked = useSessionStore((s) => s.balanceHidden);
  const brandFg = useRowTileForeground('brand');

  return (
    <Screen withTabBar>
      <ScreenTitle>Good afternoon, Tobi</ScreenTitle>

      <View style={{ marginTop: spacingRaw.sectionGapMd }}>
        <Text variant="label" tone="muted">
          Total balance
        </Text>
        <View style={{ marginTop: spacing.sm }}>
          <MoneyText variant="balanceHero" symbol="₦" symbolRatio={0.62} masked={masked}>
            3,624,097
          </MoneyText>
        </View>
      </View>

      <View style={{ marginTop: spacingRaw.sectionGapMd }}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={() => router.push('/send')}
          iconLeft={<Icon name="send" size={size.icon.md} color={colors.text.onBrand} />}
        >
          Send money
        </Button>
      </View>

      <View style={{ marginTop: spacingRaw.sectionGapLg }}>
        <SectionLabel>Your people</SectionLabel>
        <ListRow
          first
          leading={<Avatar name="Ada Okeke" flag="🇳🇬" size="md" />}
          title="Ada Okeke"
          subtitle="GTBank · ···4471"
          trailing={
            <Badge status="success" size="sm">
              Verified
            </Badge>
          }
          affordance="none"
          onPress={() => router.push('/send')}
        />
        <ListRow
          leading={
            <RowTile tone="brand">
              <Icon name="coin" size={size.icon.lg} color={brandFg} />
            </RowTile>
          }
          title="Choose a wallet"
          subtitle="Opens as a modal — back and swipe dismiss it"
          onPress={() => router.push('/wallet-picker')}
        />
        <ListRow
          leading={
            <RowTile>
              <Icon name="chart" size={size.icon.lg} color={colors.text.body} />
            </RowTile>
          }
          title="Component gallery"
          subtitle="Every primitive, both themes"
          onPress={() => router.push('/gallery')}
        />
      </View>

      <View style={{ marginTop: spacingRaw.sectionGapLg }}>
        <SectionLabel>Recent</SectionLabel>
        <TransactionRow
          first
          name="Ada Okeke"
          subtitle="To GTBank · 07:52"
          amount="200,000"
          direction="out"
          flag="🇳🇬"
          onPress={() => router.push('/transaction/np-8841-2207')}
        />
        <TransactionRow
          name="Salary — Northwind"
          subtitle="Received · Fri"
          amount="2,400.00"
          currencySymbol="£"
          direction="in"
          flag="🇬🇧"
          onPress={() => router.push('/transaction/np-7712-0043')}
        />
      </View>
    </Screen>
  );
}

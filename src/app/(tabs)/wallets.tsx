import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { ListRow } from '@/components/data/ListRow';
import { MoneyText } from '@/components/data/MoneyText';
import { RowTile } from '@/components/data/RowTile';
import { ScreenTitle } from '@/components/core/ScreenTitle';
import { SectionLabel } from '@/components/core/SectionLabel';
import { useSessionStore } from '@/store/session';
import { useTheme } from '@/theme/ThemeProvider';

/** Wallets — navigation stub for phase 3. Built properly in phase 7. */
export default function WalletsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { spacingRaw, size, colors } = theme;

  const masked = useSessionStore((s) => s.balanceHidden);

  return (
    <Screen withTabBar>
      <ScreenTitle subhead="What you hold, ready to send home.">Your wallets</ScreenTitle>

      <View style={{ marginTop: spacingRaw.sectionGapMd }}>
        <SectionLabel>2 wallets</SectionLabel>
        <ListRow
          first
          leading={<RowTile tone="sunken">{null}</RowTile>}
          title="Nigerian naira"
          subtitle="Send, pay bills, withdraw"
          affordance="none"
          trailing={<MoneyText masked={masked}>₦1,250,000</MoneyText>}
          onPress={() => router.push('/wallet-picker')}
        />
        <ListRow
          leading={
            <RowTile tone="brand">
              <Icon name="convert" size={size.icon.lg} color={colors.status.infoText} />
            </RowTile>
          }
          title="British pound"
          subtitle="Send and convert"
          affordance="none"
          trailing={<MoneyText masked={masked}>£840.20</MoneyText>}
          onPress={() => router.push('/wallet-picker')}
        />
      </View>
    </Screen>
  );
}

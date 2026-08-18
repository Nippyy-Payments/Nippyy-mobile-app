import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Screen } from '@/components/Screen';
import { ScreenTitle } from '@/components/core/ScreenTitle';
import { SectionLabel } from '@/components/core/SectionLabel';
import { TransactionRow } from '@/components/data/TransactionRow';
import { useTheme } from '@/theme/ThemeProvider';

/** Activity — navigation stub for phase 3. Built properly in phase 5. */
export default function ActivityScreen() {
  const router = useRouter();
  const { spacingRaw } = useTheme().theme;

  return (
    <Screen withTabBar>
      <ScreenTitle>Activity</ScreenTitle>

      <View style={{ marginTop: spacingRaw.sectionGapMd }}>
        <SectionLabel>This week</SectionLabel>
        <TransactionRow
          first
          name="Ada Okeke"
          subtitle="To GTBank · 07:52"
          amount="200,000"
          direction="out"
          status="success"
          flag="🇳🇬"
          onPress={() => router.push('/transaction/np-8841-2207')}
        />
        <TransactionRow
          name="Kwame Mensah"
          subtitle="MTN MoMo · Sun"
          amount="1,500"
          currencySymbol="₵"
          direction="out"
          status="pending"
          flag="🇬🇭"
          onPress={() => router.push('/transaction/np-5521-8890')}
        />
        <TransactionRow
          name="Amara Njoku"
          subtitle="M-Pesa · Thu"
          amount="18,000"
          currencySymbol="KSh"
          direction="out"
          status="failed"
          flag="🇰🇪"
          onPress={() => router.push('/transaction/np-3390-1147')}
        />
      </View>
    </Screen>
  );
}

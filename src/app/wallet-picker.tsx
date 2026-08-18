import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Badge } from '@/components/feedback/Badge';
import { ListRow } from '@/components/data/ListRow';
import { MoneyText } from '@/components/data/MoneyText';
import { RowTile } from '@/components/data/RowTile';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { SectionLabel } from '@/components/core/SectionLabel';
import { Text } from '@/components/Text';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Wallet picker — navigation stub for phase 3.
 *
 * Presented as a router modal (declared in the root layout), so system back
 * and the swipe-down gesture dismiss it without any custom handling. Becomes
 * a `@gorhom/bottom-sheet` surface in phase 7, still on this route.
 *
 * The source wallet defaults to the primary wallet (PORTING_PLAN.md §8.7).
 */
export default function WalletPickerScreen() {
  const router = useRouter();
  const { spacingRaw } = useTheme().theme;

  const wallets = [
    { currency: 'NGN', name: 'Nigerian naira', flag: '🇳🇬', balance: '₦1,250,000', primary: true },
    { currency: 'GBP', name: 'British pound', flag: '🇬🇧', balance: '£840.20', primary: false },
    { currency: 'USD', name: 'US dollar', flag: '🇺🇸', balance: '$310.00', primary: false },
  ];

  return (
    <Screen header={<ScreenHeader title="Pay from" onBack={() => router.back()} />}>
      <Text variant="body" tone="muted">
        Your primary wallet is used unless you pick another.
      </Text>

      <View style={{ marginTop: spacingRaw.sectionGapSm }}>
        <SectionLabel>{`${wallets.length} wallets`}</SectionLabel>
        {wallets.map((wallet, index) => (
          <ListRow
            key={wallet.currency}
            first={index === 0}
            leading={
              <RowTile tone="sunken">
                <Text variant="emptyTitle">{wallet.flag}</Text>
              </RowTile>
            }
            title={wallet.name}
            subtitle={wallet.currency}
            affordance="none"
            trailing={
              <View style={{ alignItems: 'flex-end' }}>
                <MoneyText>{wallet.balance}</MoneyText>
                {wallet.primary ? (
                  <Badge status="info" size="sm">
                    Primary
                  </Badge>
                ) : null}
              </View>
            }
            onPress={() => router.back()}
          />
        ))}
      </View>
    </Screen>
  );
}

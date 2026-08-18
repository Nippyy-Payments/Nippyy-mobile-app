import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Avatar } from '@/components/data/Avatar';
import { Badge } from '@/components/feedback/Badge';
import { Card } from '@/components/core/Card';
import { DetailRow } from '@/components/data/DetailRow';
import { MoneyText } from '@/components/data/MoneyText';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { SectionLabel } from '@/components/core/SectionLabel';
import { Text } from '@/components/Text';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Transaction detail — navigation stub for phase 3.
 *
 * Takes the id from the route rather than rendering one hardcoded record
 * (PORTING_PLAN.md §8.18). Built properly in phase 5.
 */
export default function TransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { spacing, spacingRaw } = theme;

  const reference = String(id ?? '').toUpperCase();

  return (
    <Screen header={<ScreenHeader title="Transfer" />}>
      <View style={{ alignItems: 'center', paddingTop: spacing.md }}>
        <Avatar name="Ada Okeke" flag="🇳🇬" size="xl" />
        <View style={{ marginTop: spacing.md }}>
          <MoneyText variant="amountDetail" tone="out">
            -₦200,000
          </MoneyText>
        </View>
        <View style={{ marginTop: spacing.sm }}>
          <Badge status="success" dot>
            Completed
          </Badge>
        </View>
        <Text variant="labelMuted" tone="muted" style={{ marginTop: spacing.md }}>
          To Ada Okeke · today at 07:52
        </Text>
      </View>

      <View style={{ marginTop: spacingRaw.sectionGapMd }}>
        <SectionLabel>Details</SectionLabel>
        <Card tone="sunken">
          <DetailRow label="Reference" value={reference} numeric copyable divider testID="ref" />
          <DetailRow label="Bank" value="GTBank · ···4471" divider />
          <DetailRow label="Paid from" value="🇬🇧 GBP wallet" />
        </Card>
      </View>
    </Screen>
  );
}

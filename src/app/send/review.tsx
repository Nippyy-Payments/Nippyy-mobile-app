import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/core/Button';
import { Card } from '@/components/core/Card';
import { DetailRow } from '@/components/data/DetailRow';
import { MoneyText } from '@/components/data/MoneyText';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { SectionLabel } from '@/components/core/SectionLabel';
import { Text } from '@/components/Text';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Review — navigation stub for phase 3.
 *
 * A second pushed screen inside the flow, so iOS swipe-back and Android back
 * can be exercised one level deeper than the flow's entry point.
 */
export default function ReviewScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { spacing, spacingRaw, size, colors } = theme;

  return (
    <Screen header={<ScreenHeader title="Review transfer" />}>
      <Text variant="body" tone="muted">
        Check it once, then confirm.
      </Text>

      <View style={{ alignItems: 'center', paddingTop: spacingRaw.sectionGapSm }}>
        <Text variant="label" tone="muted">
          You send
        </Text>
        <View style={{ marginTop: spacing.sm }}>
          <MoneyText variant="amountHero" symbol="£" symbolRatio={0.62}>
            200.00
          </MoneyText>
        </View>
      </View>

      <View style={{ marginTop: spacingRaw.sectionGapMd }}>
        <SectionLabel>Breakdown</SectionLabel>
        <Card>
          <DetailRow label="Amount" value="£200.00" numeric divider />
          <DetailRow label="Fee" value="£0.40" numeric divider />
          <DetailRow label="Rate" value="£1 = ₦1,985" numeric divider />
          <DetailRow label="Total to pay" value="£200.40" numeric emphasis="strong" />
        </Card>
      </View>

      <View style={{ marginTop: spacingRaw.sectionGapMd }}>
        <Button
          variant="ink"
          size="lg"
          fullWidth
          onPress={() => router.dismissTo('/')}
          iconLeft={<Icon name="faceid" size={size.icon.lg} color={colors.text.onInk} />}
        >
          Send £200.40 with Face ID
        </Button>
      </View>
    </Screen>
  );
}

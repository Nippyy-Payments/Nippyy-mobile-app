import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Avatar } from '@/components/data/Avatar';
import { Badge } from '@/components/feedback/Badge';
import { Button } from '@/components/core/Button';
import { DetailRow } from '@/components/data/DetailRow';
import { ListRow } from '@/components/data/ListRow';
import { MoneyText } from '@/components/data/MoneyText';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { Text } from '@/components/Text';
import { useTheme } from '@/theme/ThemeProvider';

/** Send amount — navigation stub for phase 3. Built properly in phase 6. */
export default function SendAmountScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { spacing, spacingRaw, colors, borderWidth } = theme;

  return (
    <Screen scroll={false} header={<ScreenHeader title="Send money" />}>
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
        onPress={() => {}}
      />

      <View style={{ alignItems: 'center', paddingTop: spacingRaw.sectionGapSm }}>
        <Text variant="label" tone="muted">
          You send
        </Text>
        <View style={{ marginTop: spacing.sm }}>
          <MoneyText variant="amountHero" symbol="£" symbolRatio={0.62}>
            200
          </MoneyText>
        </View>
        <Text variant="caption" tone="subtle" style={{ marginTop: spacing.sm }}>
          They get ₦397,000
        </Text>
      </View>

      <View
        style={{
          marginTop: spacingRaw.sectionGapSm,
          paddingTop: spacing.md,
          borderTopWidth: borderWidth.hairline,
          borderTopColor: colors.border.subtle,
        }}
      >
        <DetailRow label="Rate" value="£1 = ₦1,985" numeric />
        <DetailRow label="Fee" value="£0.40" numeric />
        <DetailRow label="Arrives" value="In seconds" />
      </View>

      <View style={{ flex: 1 }} />

      <Button variant="primary" size="lg" fullWidth onPress={() => router.push('/send/review')}>
        Review transfer
      </Button>
    </Screen>
  );
}

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Button } from '@/components/core/Button';
import { RowTile, useRowTileForeground } from '@/components/data/RowTile';
import { useTheme } from '@/theme/ThemeProvider';
import type { IconName } from '@/components/icons';

const LOGO_HEIGHT = 26;
const BENEFIT_TILE = 38;
const BENEFIT_GAP = 13;
const BENEFIT_PAD_Y = 13;

const BENEFITS: { label: string; icon: IconName }[] = [
  { label: 'Live rates, stated up front', icon: 'rate' },
  { label: 'Arrives in seconds, not days', icon: 'clock' },
  { label: 'FCA-registered and encrypted', icon: 'shield' },
];

export function WelcomeScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { spacing, spacingRaw, radius, size } = theme;
  const brandFg = useRowTileForeground('brand');

  return (
    <Screen scroll={false}>
      <View style={{ flex: 1, paddingTop: spacing.xl, paddingBottom: spacing['3xl'] }}>
        <Image
          source={
            isDark
              ? require('../../../assets/logo-white.png')
              : require('../../../assets/logo-navy.png')
          }
          contentFit="contain"
          accessibilityLabel="nippyy"
          style={{ height: LOGO_HEIGHT, width: LOGO_HEIGHT * 4, alignSelf: 'flex-start' }}
        />

        <View style={{ flex: 1, justifyContent: 'center', paddingVertical: spacing['3xl'] }}>
          <Text variant="screenTitle" tone="strong" accessibilityRole="header">
            Send money home in seconds
          </Text>
          <Text variant="body" tone="muted" style={{ marginTop: spacing.md }}>
            See the exact rate and fee up front — no hidden spread, and it lands almost
            instantly.
          </Text>

          <View style={{ marginTop: spacingRaw.sectionGapMd }}>
            {BENEFITS.map((benefit) => (
              <View
                key={benefit.label}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  columnGap: BENEFIT_GAP,
                  paddingVertical: BENEFIT_PAD_Y,
                }}
              >
                <RowTile tone="brand" size={BENEFIT_TILE} radius={radius.tile}>
                  <Icon name={benefit.icon} size={size.icon.md} color={brandFg} />
                </RowTile>
                <Text variant="bodyStrong" tone="strong">
                  {benefit.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ rowGap: spacingRaw.buttonStackGap }}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => router.push('/onboarding/phone')}
          >
            Get started
          </Button>
          <Button
            variant="ghost"
            size="md"
            fullWidth
            onPress={() => router.push('/onboarding/phone')}
          >
            I already have an account
          </Button>
        </View>

        <Text variant="micro" tone="subtle" style={{ textAlign: 'center', marginTop: spacing.md }}>
          By continuing you agree to our terms of use and privacy policy.
        </Text>
      </View>
    </Screen>
  );
}

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Badge } from '@/components/feedback/Badge';
import { Button } from '@/components/core/Button';
import { IconButton, useIconButtonForeground } from '@/components/core/IconButton';
import { MoneyText } from '@/components/data/MoneyText';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { SectionLabel } from '@/components/core/SectionLabel';
import { ToggleRow } from '@/components/forms/ToggleRow';
import { currency } from '@/lib/currency';
import { formatAmount } from '@/lib/format';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Seven days of GBP→NGN. Real history per §8.17; served from the client
 * fixture until a rates-history endpoint exists.
 */
const HISTORY = [
  { day: 'Mon', value: 1932 },
  { day: 'Tue', value: 1948 },
  { day: 'Wed', value: 1941 },
  { day: 'Thu', value: 1958 },
  { day: 'Fri', value: 1972 },
  { day: 'Sat', value: 1968 },
  { day: 'Sun', value: 1985 },
];

const CHART_HEIGHT = 130;
/** Shortest bar still reads as a bar, not a line. */
const MIN_BAR_PERCENT = 30;
const BAR_RANGE_PERCENT = 70;
const CHIP_HEIGHT = 38;
const TARGET_STEP = 5;
const FEE_PERCENT = '0.4%';

export function RatesScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { colors, spacing, spacingRaw, radii, size, borderWidth } = theme;
  const quietFg = useIconButtonForeground('quiet');

  const [alertOn, setAlertOn] = useState(true);
  const [weekly, setWeekly] = useState(false);
  const [target, setTarget] = useState(1960);

  const values = HISTORY.map((entry) => entry.value);
  const today = values[values.length - 1] ?? 0;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const gap = today - target;

  return (
    <Screen header={<ScreenHeader title="Rates and fees" />}>
      <View style={{ alignItems: 'center', paddingTop: spacing.lg }}>
        <Button
          variant="quiet"
          size="sm"
          onPress={() => router.push('/money/convert')}
          style={{
            height: CHIP_HEIGHT,
            borderRadius: radii.pill,
            backgroundColor: colors.surface.quiet,
          }}
          iconLeft={<Text variant="emptyTitle">{currency('NGN').flag}</Text>}
          iconRight={<Icon name="chevronDown" size={13} color={colors.text.muted} strokeWidth={2} />}
        >
          GBP → NGN
        </Button>

        <View style={{ marginTop: spacing.lg }}>
          <MoneyText variant="amountHero" testID="today-rate">
            {formatAmount(String(today), 'NGN')}
          </MoneyText>
        </View>

        <Text variant="labelMuted" tone="muted" style={{ marginTop: spacing.sm }}>
          {`1 GBP = ${formatAmount(String(today), 'NGN')} NGN · ${FEE_PERCENT} fee`}
        </Text>

        {today === max ? (
          <Badge status="success" size="lg" style={{ marginTop: spacing.md }}>
            Highest in 7 days
          </Badge>
        ) : null}
      </View>

      {/* A plain flex chart: seven bars sharing the width, each scaled between
          the week's low and high. No charting library for seven values. */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          columnGap: spacing.md,
          marginTop: spacingRaw.sectionGapMd,
          height: CHART_HEIGHT,
        }}
      >
        {HISTORY.map((entry) => {
          const share = max === min ? 1 : (entry.value - min) / (max - min);
          return (
            <View key={entry.day} style={{ flex: 1, alignItems: 'center', height: '100%' }}>
              <View style={{ flex: 1, justifyContent: 'flex-end', width: '100%' }}>
                <View
                  testID={`bar-${entry.day}`}
                  style={{
                    width: '100%',
                    height: `${MIN_BAR_PERCENT + share * BAR_RANGE_PERCENT}%`,
                    borderTopLeftRadius: radii.xs,
                    borderTopRightRadius: radii.xs,
                    backgroundColor:
                      entry.value === max ? colors.brand.default : colors.surface.sunken,
                  }}
                />
              </View>
              <Text variant="micro" tone="subtle" style={{ marginTop: spacing.sm }}>
                {entry.day}
              </Text>
            </View>
          );
        })}
      </View>

      <SectionLabel style={{ marginTop: spacingRaw.sectionGapMd }}>
        Tell me when it is good
      </SectionLabel>

      <ToggleRow
        first
        title="Alert me at this rate"
        detail={
          gap >= 0
            ? `Today is ₦${formatAmount(String(gap), 'NGN')} above your target`
            : `₦${formatAmount(String(Math.abs(gap)), 'NGN')} to go`
        }
        checked={alertOn}
        onChange={setAlertOn}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          columnGap: spacing.lg,
          paddingVertical: spacing.lg,
          borderTopWidth: borderWidth.hairline,
          borderTopColor: colors.border.subtle,
        }}
      >
        <IconButton
          variant="quiet"
          size="lg"
          shape="circle"
          label="Lower target"
          testID="target-down"
          onPress={() => setTarget((value) => value - TARGET_STEP)}
        >
          <Icon name="minus" size={size.icon.md} color={quietFg} />
        </IconButton>

        <View style={{ alignItems: 'center' }}>
          <MoneyText variant="amountStepper" testID="target">
            {formatAmount(String(target), 'NGN')}
          </MoneyText>
          <Text variant="micro" tone="subtle" style={{ marginTop: 2 }}>
            target NGN per £1
          </Text>
        </View>

        <IconButton
          variant="quiet"
          size="lg"
          shape="circle"
          label="Raise target"
          testID="target-up"
          onPress={() => setTarget((value) => value + TARGET_STEP)}
        >
          <Icon name="plus" size={size.icon.md} color={quietFg} />
        </IconButton>
      </View>

      <ToggleRow
        title="Weekly rate summary"
        detail="One message every Sunday. No noise."
        checked={weekly}
        onChange={setWeekly}
      />

      <Button
        variant="outline"
        size="lg"
        fullWidth
        style={{ marginTop: spacingRaw.sectionGapSm }}
        onPress={() => router.push('/money/convert')}
      >
        Convert at today&apos;s rate
      </Button>
    </Screen>
  );
}

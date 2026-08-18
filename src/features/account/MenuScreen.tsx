import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Avatar } from '@/components/data/Avatar';
import { Badge } from '@/components/feedback/Badge';
import { Button } from '@/components/core/Button';
import { ListRow } from '@/components/data/ListRow';
import { ProgressTrack } from '@/components/feedback/ProgressTrack';
import { RowTile, useRowTileForeground } from '@/components/data/RowTile';
import { ScreenTitle } from '@/components/core/ScreenTitle';
import { SectionLabel } from '@/components/core/SectionLabel';
import { ToggleRow } from '@/components/forms/ToggleRow';
import { MENU_GROUPS } from '@/features/account/menu';
import { CURRENT_TIER, TIERS, tierLimitLine } from '@/features/account/tiers';
import { useTheme } from '@/theme/ThemeProvider';

const VERIFY_DONE = 2;
const VERIFY_TOTAL = 4;
const APP_VERSION = 'v2.4.0';

export function MenuScreen() {
  const router = useRouter();
  const { theme, name, toggleTheme } = useTheme();
  const { colors, spacing, spacingRaw, size, borderWidth } = theme;

  const quietFg = useRowTileForeground('quiet');
  const dangerFg = useRowTileForeground('danger');
  const warningFg = useRowTileForeground('warning');

  const tier = TIERS.find((entry) => entry.number === CURRENT_TIER);
  const isDark = name === 'dark';

  return (
    <Screen withTabBar>
      <ScreenTitle>Account</ScreenTitle>

      <ListRow
        first
        style={{ marginTop: spacing.sm }}
        leading={<Avatar name="Tobi Adeyemi" size="md" />}
        title="Tobi Adeyemi"
        subtitle="@tobi.adeyemi"
        trailing={
          <Badge status="success" size="sm">
            Verified
          </Badge>
        }
        onPress={() => router.push('/account/profile')}
      />

      {/* Verification nudge */}
      <View
        style={{
          paddingTop: spacing.xl,
          marginTop: spacing.xs,
          borderTopWidth: borderWidth.hairline,
          borderTopColor: colors.border.subtle,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: spacingRaw.rowLeadingGap,
          }}
        >
          <RowTile tone="warning">
            <Icon name="clock" size={size.icon.lg} color={warningFg} />
          </RowTile>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text variant="bodyStrong" tone="strong">
              {`Finish verifying: ${VERIFY_TOTAL - VERIFY_DONE} steps left`}
            </Text>
            <Text variant="labelMuted" tone="muted">
              {tier ? tierLimitLine(tier) : ''}
            </Text>
          </View>
        </View>

        <ProgressTrack
          variant="segmented"
          value={VERIFY_DONE}
          total={VERIFY_TOTAL}
          style={{ marginTop: spacing.lg, marginBottom: spacing.md }}
        />

        <Button
          variant="primary"
          size="md"
          fullWidth
          onPress={() => router.push('/onboarding/verify')}
        >
          Continue verification
        </Button>
      </View>

      {MENU_GROUPS.map((group) => (
        <View key={group.title} style={{ marginTop: spacingRaw.sectionGapLg }}>
          <SectionLabel>{group.title}</SectionLabel>
          {group.items.map((item, index) => (
            <ListRow
              key={item.label}
              first={index === 0}
              testID={`menu-${item.label}`}
              leading={
                <RowTile tone={item.danger ? 'danger' : 'quiet'}>
                  <Icon
                    name={item.icon}
                    size={size.icon.lg}
                    color={item.danger ? dangerFg : quietFg}
                  />
                </RowTile>
              }
              title={item.label}
              subtitle={item.sub}
              danger={item.danger}
              affordance={item.href ? 'external' : 'chevron'}
              href={item.href}
              trailing={
                item.chip ? (
                  <Badge status="success" size="sm">
                    {item.chip}
                  </Badge>
                ) : null
              }
              onPress={item.to ? () => router.push(item.to as never) : undefined}
            />
          ))}
        </View>
      ))}

      <View style={{ marginTop: spacingRaw.sectionGapLg }}>
        <SectionLabel>Appearance</SectionLabel>
        <ToggleRow
          first
          title="Dark mode"
          /* The design's off-label read "Following the system". The theme is
             user-owned and never derived from the OS (§8.8), so that would be
             untrue — this is the one place the port changes designed copy. */
          detail={isDark ? 'On' : 'Off'}
          checked={isDark}
          onChange={toggleTheme}
          icon={<Icon name="moon" size={size.icon.md} color={quietFg} />}
        />
      </View>

      <Button
        variant="quiet"
        size="lg"
        fullWidth
        style={{ marginTop: spacingRaw.sectionGapSm }}
        onPress={() => router.replace('/onboarding')}
        testID="log-out"
      >
        Log out
      </Button>

      <Text variant="micro" tone="subtle" style={{ textAlign: 'center', marginTop: spacing.lg }}>
        {`nippyy · FCA-registered · ${APP_VERSION}`}
      </Text>
    </Screen>
  );
}

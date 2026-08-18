import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Badge } from '@/components/feedback/Badge';
import { Button } from '@/components/core/Button';
import { InlineAlert, useAlertIconColor } from '@/components/feedback/InlineAlert';
import { ListRow } from '@/components/data/ListRow';
import { ProgressTrack } from '@/components/feedback/ProgressTrack';
import { RowTile, useRowTileForeground } from '@/components/data/RowTile';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { ScreenTitle } from '@/components/core/ScreenTitle';
import { SectionLabel } from '@/components/core/SectionLabel';
import { TIERS, tierLimitLine } from '@/features/account/tiers';
import { useTheme } from '@/theme/ThemeProvider';

const TILE = 38;

const STEPS = [
  { label: 'Phone number', sub: '+234 803 114 2208', met: true },
  { label: 'BVN', sub: 'Bank Verification Number', met: true },
  { label: 'NIN', sub: 'National Identity Number', met: false, next: true },
  { label: 'Liveness check', sub: 'A short selfie video', met: false },
];

export function VerifyScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { colors, spacing, spacingRaw, radius, size } = theme;

  const successFg = useRowTileForeground('success');
  const quietFg = useRowTileForeground('quiet');
  const infoFg = useAlertIconColor('info');

  const done = STEPS.filter((step) => step.met).length;
  const tier = TIERS[0];

  return (
    <Screen header={<ScreenHeader title="Verification" />}>
      <ScreenTitle subhead="Each step raises your deposit and balance limits.">
        Verify your identity
      </ScreenTitle>

      <View
        style={{
          marginTop: spacingRaw.sectionGapSm,
          padding: spacing.lg,
          borderRadius: radius.card,
          backgroundColor: colors.surface.quiet,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Text variant="cardTitle" tone="strong">
            {`${tier?.name ?? 'Tier 1'} · identity`}
          </Text>
          <Text variant="labelMuted" tone="muted">
            {`${done} of ${STEPS.length} steps`}
          </Text>
        </View>

        <ProgressTrack
          variant="segmented"
          value={done}
          total={STEPS.length}
          style={{ marginTop: spacing.md }}
        />

        <Text variant="caption" tone="subtle" style={{ marginTop: spacing.md }}>
          {tier ? tierLimitLine(tier) : ''}
        </Text>
      </View>

      <SectionLabel style={{ marginTop: spacingRaw.sectionGapMd }}>Steps</SectionLabel>
      {STEPS.map((step, index) => (
        <ListRow
          key={step.label}
          first={index === 0}
          title={step.label}
          subtitle={step.sub}
          affordance={step.next ? 'chevron' : 'none'}
          leading={
            <RowTile tone={step.met ? 'success' : 'quiet'} size={TILE} radius={radius.tile}>
              <Icon
                name={step.met ? 'check' : 'plusCirc'}
                size={size.icon.md}
                color={step.met ? successFg : quietFg}
              />
            </RowTile>
          }
          trailing={
            step.met ? (
              <Badge status="success" size="sm">
                Verified
              </Badge>
            ) : step.next ? (
              <Badge status="warning" size="sm">
                Next
              </Badge>
            ) : null
          }
          onPress={step.next ? () => {} : undefined}
        />
      ))}

      <InlineAlert
        style={{ marginTop: spacingRaw.sectionGapSm }}
        tone="info"
        title="Why we ask"
        detail="Nigerian money-transfer rules require us to confirm who you are before raising your limits."
        icon={<Icon name="shield" size={size.icon.sm} color={infoFg} />}
      />

      <Button
        variant="primary"
        size="lg"
        fullWidth
        style={{ marginTop: spacing.lg }}
        onPress={() => router.push('/account/tiers')}
      >
        Continue with NIN
      </Button>
    </Screen>
  );
}

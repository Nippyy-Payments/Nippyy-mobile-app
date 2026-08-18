import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Badge } from '@/components/feedback/Badge';
import { Button } from '@/components/core/Button';
import { Card } from '@/components/core/Card';
import { DetailRow } from '@/components/data/DetailRow';
import { ProgressTrack } from '@/components/feedback/ProgressTrack';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { SectionLabel } from '@/components/core/SectionLabel';
import { CURRENT_TIER, TIERS, TIER_FOOTNOTE } from '@/features/account/tiers';
import { useTheme } from '@/theme/ThemeProvider';

export function TiersScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { colors, spacing, spacingRaw, size, borderWidth } = theme;

  return (
    <Screen header={<ScreenHeader title="Account tiers" />}>
      <Text variant="labelMuted" tone="muted">
        {`Limits are set by regulation and rise each time you verify more. You are on Tier ${CURRENT_TIER}.`}
      </Text>

      <View style={{ rowGap: spacing.lg, marginTop: spacing.xl }}>
        {TIERS.map((tier) => {
          const isCurrent = tier.number === CURRENT_TIER;
          const isNext = tier.number === CURRENT_TIER + 1;
          const isLocked = tier.number > CURRENT_TIER + 1;
          const met = tier.requirements.filter((requirement) => requirement.met).length;

          return (
            <Card
              key={tier.number}
              testID={`tier-${tier.number}`}
              /* The design marks the current card by turning its border
                 brand-coloured — cards never lift in this system. */
              style={isCurrent ? { borderColor: colors.border.brand } : undefined}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: spacing.md }}>
                <Text
                  variant="screenHeader"
                  tone={isLocked ? 'muted' : 'strong'}
                  style={{ flex: 1, minWidth: 0 }}
                >
                  {tier.name}
                </Text>
                {isCurrent ? <Badge status="info">Current</Badge> : null}
                {isNext ? <Badge status="warning">Next step</Badge> : null}
                {isLocked ? <Badge status="neutral">Locked</Badge> : null}
              </View>

              {isNext ? (
                <View style={{ marginTop: spacing.md }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      marginBottom: spacing.sm,
                    }}
                  >
                    <Text variant="caption" tone="subtle">
                      Progress
                    </Text>
                    <Text variant="caption" tone="muted">
                      {`${met} of ${tier.requirements.length} checks`}
                    </Text>
                  </View>
                  <ProgressTrack value={met} total={tier.requirements.length} />
                </View>
              ) : null}

              <View style={{ marginTop: spacing.md }}>
                <DetailRow
                  label="Deposit"
                  value={tier.deposit}
                  numeric
                  divider
                  emphasis={isLocked ? 'muted' : 'strong'}
                />
                <DetailRow
                  label="Withdrawal"
                  value={tier.withdrawal}
                  numeric
                  divider
                  emphasis={isLocked ? 'muted' : 'strong'}
                />
                <DetailRow
                  label="Balance cap"
                  value={tier.balanceCap}
                  numeric
                  divider
                  emphasis={isLocked ? 'muted' : 'strong'}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  columnGap: spacing.sm,
                  rowGap: spacing.sm,
                  marginTop: spacing.md,
                }}
              >
                {tier.capabilities.map((capability) => (
                  <Badge key={capability} status="neutral" size="lg">
                    {capability}
                  </Badge>
                ))}
              </View>

              <SectionLabel style={{ marginTop: spacing.lg, marginBottom: 0 }}>
                Requirements
              </SectionLabel>

              {tier.requirements.map((requirement) => (
                <View
                  key={requirement.label}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    columnGap: spacing.md,
                    paddingVertical: spacing.md,
                    borderTopWidth: borderWidth.hairline,
                    borderTopColor: colors.border.subtle,
                  }}
                >
                  <Icon
                    name={requirement.met ? 'check' : 'plusCirc'}
                    size={size.icon.lg}
                    color={requirement.met ? colors.status.success : colors.text.placeholder}
                  />
                  <Text
                    variant="labelMuted"
                    tone={requirement.met ? 'strong' : 'muted'}
                    style={{ flex: 1, minWidth: 0 }}
                  >
                    {requirement.label}
                  </Text>
                  {requirement.met ? (
                    <Badge status="success" size="sm">
                      Verified
                    </Badge>
                  ) : null}
                  {!requirement.met && isNext ? (
                    <Button
                      size="sm"
                      variant="primary"
                      onPress={() => router.push('/onboarding/verify')}
                    >
                      Start
                    </Button>
                  ) : null}
                </View>
              ))}

              {isNext ? (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  style={{ marginTop: spacing.lg }}
                  onPress={() => router.push('/onboarding/verify')}
                >
                  {tier.cta}
                </Button>
              ) : null}

              {isLocked ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    columnGap: spacing.sm,
                    marginTop: spacing.lg,
                  }}
                >
                  <Icon name="lock" size={13} color={colors.text.subtle} />
                  <Text variant="caption" tone="subtle">
                    {`Complete Tier ${tier.number - 1} first`}
                  </Text>
                </View>
              ) : null}
            </Card>
          );
        })}
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          columnGap: spacing.sm,
          marginTop: spacingRaw.sectionGapSm,
        }}
      >
        <Icon name="shield" size={14} color={colors.status.success} />
        <Text variant="caption" tone="subtle" style={{ flex: 1 }}>
          {TIER_FOOTNOTE}
        </Text>
      </View>
    </Screen>
  );
}

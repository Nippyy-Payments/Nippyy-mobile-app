import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { InlineAlert, useAlertIconColor } from '@/components/feedback/InlineAlert';
import { ListRow } from '@/components/data/ListRow';
import { RowTile, useRowTileForeground } from '@/components/data/RowTile';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { ToggleRow } from '@/components/forms/ToggleRow';
import { useSessionStore } from '@/store/session';
import { useTheme } from '@/theme/ThemeProvider';
import type { IconName } from '@/components/icons';

const TILE = 38;

const ROWS: { title: string; sub: string; icon: IconName }[] = [
  {
    title: 'Change transaction PIN',
    sub: 'The four digits you use to confirm transfers',
    icon: 'lock',
  },
  { title: 'Change login password', sub: 'Used with your email to sign in', icon: 'lock' },
  { title: 'Multi-factor authentication', sub: 'On · authenticator app', icon: 'shield' },
];

export function SecurityScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { spacing, spacingRaw, radius, size, gutter } = theme;
  const quietFg = useRowTileForeground('quiet');
  const infoFg = useAlertIconColor('info');

  /* This toggle is what makes biometrics available at confirmation time
     (PORTING_PLAN.md §8.13) — the prompt is never offered without it. */
  const biometricsEnabled = useSessionStore((s) => s.biometricsEnabled);
  const setBiometricsEnabled = useSessionStore((s) => s.setBiometricsEnabled);

  return (
    <Screen gutter="tight" header={<ScreenHeader title="Security centre" />}>
      <ToggleRow
        first
        style={{ marginTop: spacing.sm }}
        title="Face ID unlock"
        detail="Confirm every transfer with Face ID"
        checked={biometricsEnabled}
        onChange={setBiometricsEnabled}
        icon={<Icon name="faceid" size={size.icon.md} color={quietFg} />}
      />

      <View style={{ marginTop: spacing.sm }}>
        {ROWS.map((row, index) => (
          <ListRow
            key={row.title}
            first={index === 0}
            gutter={gutter.tight}
            title={row.title}
            subtitle={row.sub}
            leading={
              <RowTile size={TILE} radius={radius.tile}>
                <Icon name={row.icon} size={size.icon.md} color={quietFg} />
              </RowTile>
            }
            onPress={() => {}}
          />
        ))}

        <ListRow
          gutter={gutter.tight}
          title="Devices & sessions"
          subtitle="3 signed in"
          testID="devices-row"
          leading={
            <RowTile size={TILE} radius={radius.tile}>
              <Icon name="device" size={size.icon.md} color={quietFg} />
            </RowTile>
          }
          onPress={() => router.push('/account/security/devices')}
        />
      </View>

      <InlineAlert
        style={{ marginTop: spacingRaw.sectionGapSm }}
        tone="info"
        title="Only you can move your money"
        detail="These controls hold even if your phone is lost."
        icon={<Icon name="shield" size={size.icon.sm} color={infoFg} />}
      />
    </Screen>
  );
}

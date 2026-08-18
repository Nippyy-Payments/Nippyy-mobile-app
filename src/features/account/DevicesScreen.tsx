import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Badge } from '@/components/feedback/Badge';
import { Button } from '@/components/core/Button';
import { ListRow } from '@/components/data/ListRow';
import { RowTile, useRowTileForeground } from '@/components/data/RowTile';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { DEVICES } from '@/features/account/menu';
import { useTheme } from '@/theme/ThemeProvider';

const TILE = 38;

/**
 * Devices and sessions.
 *
 * A real route rather than the source's local sub-view, so back and
 * swipe-back behave like every other pushed screen (PORTING_PLAN.md §7).
 */
export function DevicesScreen() {
  const { theme } = useTheme();
  const { spacing, spacingRaw, radius, size, gutter } = theme;
  const quietFg = useRowTileForeground('quiet');

  return (
    <Screen gutter="tight" header={<ScreenHeader title="Devices & sessions" />}>
      <Text variant="body" tone="muted" style={{ marginBottom: spacing.sm }}>
        Sign out anything you do not recognise.
      </Text>

      {DEVICES.map((device, index) => (
        <ListRow
          key={device.name}
          first={index === 0}
          gutter={gutter.tight}
          testID={`device-${index}`}
          leading={
            <RowTile size={TILE} radius={radius.tile}>
              <Icon name="device" size={size.icon.md} color={quietFg} />
            </RowTile>
          }
          title={device.name}
          subtitle={device.sub}
          affordance={device.current ? 'none' : 'chevron'}
          trailing={
            device.current ? (
              <Badge status="success" size="sm">
                This device
              </Badge>
            ) : null
          }
          onPress={device.current ? undefined : () => {}}
        />
      ))}

      <Button variant="quiet" size="lg" fullWidth style={{ marginTop: spacingRaw.sectionGapSm }}>
        Sign out all other devices
      </Button>
    </Screen>
  );
}

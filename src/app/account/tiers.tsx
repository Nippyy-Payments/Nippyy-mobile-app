import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { EmptyState, useEmptyStateIconColor } from '@/components/feedback/EmptyState';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { useTheme } from '@/theme/ThemeProvider';

/** Account tiers — placeholder route; built in phase 8. */
export default function TiersRoute() {
  const { size } = useTheme().theme;
  const iconColor = useEmptyStateIconColor();

  return (
    <Screen header={<ScreenHeader title="Account tiers" />}>
      <EmptyState
        icon={<Icon name="chart" size={size.icon['2xl']} color={iconColor} />}
        title="Coming shortly"
        body="This screen is next up in the port. The route works, so back and deep links already behave."
      />
    </Screen>
  );
}

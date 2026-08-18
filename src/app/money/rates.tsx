import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { EmptyState, useEmptyStateIconColor } from '@/components/feedback/EmptyState';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Rates and fees — placeholder route.
 *
 * The screen is built in a later phase; this exists now so the links that
 * point at it are real navigation rather than dead handlers.
 */
export default function RatesandfeesRoute() {
  const { size } = useTheme().theme;
  const iconColor = useEmptyStateIconColor();

  return (
    <Screen header={<ScreenHeader title="Rates and fees" />}>
      <EmptyState
        icon={<Icon name="rate" size={size.icon['2xl']} color={iconColor} />}
        title="Coming shortly"
        body="This screen is next up in the port. The route works, so back and deep links already behave."
      />
    </Screen>
  );
}

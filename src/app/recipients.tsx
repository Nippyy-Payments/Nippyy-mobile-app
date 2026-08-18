import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { EmptyState, useEmptyStateIconColor } from '@/components/feedback/EmptyState';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Recipients — placeholder route.
 *
 * The screen is built in a later phase; this exists now so the links that
 * point at it are real navigation rather than dead handlers.
 */
export default function RecipientsRoute() {
  const { size } = useTheme().theme;
  const iconColor = useEmptyStateIconColor();

  return (
    <Screen header={<ScreenHeader title="Recipients" />}>
      <EmptyState
        icon={<Icon name="people" size={size.icon['2xl']} color={iconColor} />}
        title="Coming shortly"
        body="This screen is next up in the port. The route works, so back and deep links already behave."
      />
    </Screen>
  );
}

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { EmptyState, useEmptyStateIconColor } from '@/components/feedback/EmptyState';
import { ListRow } from '@/components/data/ListRow';
import { RowTile, useRowTileForeground } from '@/components/data/RowTile';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { SectionLabel } from '@/components/core/SectionLabel';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Chat support, which is not live yet.
 *
 * The empty state carries fallback rows because the user genuinely has
 * somewhere else to go — which is the only time `EmptyState` takes children.
 */
export function ChatSupportScreen() {
  const { theme } = useTheme();
  const { size } = theme;
  const iconColor = useEmptyStateIconColor();
  const quietFg = useRowTileForeground('quiet');

  return (
    <Screen header={<ScreenHeader title="Chat support" />}>
      <EmptyState
        icon={<Icon name="chat" size={size.icon['2xl']} color={iconColor} />}
        title="Coming soon"
        body="Live chat support is currently under development. We are working hard to bring this to you soon."
      >
        <SectionLabel>In the meantime, you can reach us via:</SectionLabel>

        <ListRow
          first
          testID="chat-email"
          href="mailto:contact@nippyy.com"
          affordance="external"
          leading={
            <RowTile>
              <Icon name="mail" size={21} color={quietFg} />
            </RowTile>
          }
          title="Email support"
          subtitle="contact@nippyy.com"
        />

        <ListRow
          testID="chat-twitter"
          href="https://x.com/nippyyhq"
          affordance="external"
          leading={
            <RowTile>
              <Icon name="twitter" size={20} color={quietFg} />
            </RowTile>
          }
          title="Twitter / X"
        />
      </EmptyState>
    </Screen>
  );
}

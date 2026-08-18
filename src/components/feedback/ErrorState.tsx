import type { StyleProp, ViewStyle } from 'react-native';

import { Button } from '@/components/core/Button';
import { EmptyState, useEmptyStateIconColor } from '@/components/feedback/EmptyState';
import { Icon } from '@/components/Icon';
import { useTokens } from '@/theme/ThemeProvider';

export type ErrorStateProps = {
  /** Sentence case, and it should say what failed, not "Error". */
  title?: string;
  /** Explain and fix — never a bare failure. */
  body?: string;
  onRetry?: () => void;
  retryLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * What a screen says when it could not load.
 *
 * The design defines no error state anywhere (PORTING_PLAN.md §8.3), so this
 * is assembled from the language that already exists rather than invented:
 * the `EmptyState` column, a warning glyph, and one filled action. Nothing
 * new is introduced.
 *
 * nippyy's voice rule applies — errors explain and fix, so the retry is part
 * of the state rather than something the user has to find.
 */
export function ErrorState({
  title = 'We could not load this',
  body = 'Something went wrong on our side. Try again in a moment.',
  onRetry,
  retryLabel = 'Try again',
  style,
  testID,
}: ErrorStateProps) {
  const { size } = useTokens();
  const iconColor = useEmptyStateIconColor();

  return (
    <EmptyState
      testID={testID}
      style={style}
      icon={<Icon name="warn" size={size.icon['2xl']} color={iconColor} />}
      title={title}
      body={body}
    >
      {onRetry ? (
        <Button variant="primary" size="md" fullWidth onPress={onRetry} testID="retry">
          {retryLabel}
        </Button>
      ) : null}
    </EmptyState>
  );
}

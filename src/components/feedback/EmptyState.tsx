import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '@/components/Text';
import { useTokens } from '@/theme/ThemeProvider';

export type EmptyStateProps = {
  /** Pass an `<Icon>`; colour it with `useEmptyStateIconColor()`. */
  icon?: ReactNode;
  title: string;
  body?: string;
  /** Fallback rows — only when the user genuinely has somewhere else to go. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const PAD_TOP = 48;
const PAD_BOTTOM = 8;
const ICON_GAP = 16;
const BODY_GAP = 6;
const BODY_MAX_WIDTH = 260;
const CHILDREN_GAP = 28;

/**
 * What a screen says when it has nothing to show.
 *
 * A quiet centred column: sunken circle, icon, one heading, one line. Never a
 * card, never an illustration — this system ships no imagery at all.
 */
export function EmptyState({ icon, title, body, children, style, testID }: EmptyStateProps) {
  const { colors, size } = useTokens();

  return (
    <View
      testID={testID}
      style={[
        {
          alignItems: 'center',
          paddingTop: PAD_TOP,
          paddingBottom: PAD_BOTTOM,
        },
        style,
      ]}
    >
      {icon ? (
        <View
          style={{
            width: size.emptyStateIcon,
            height: size.emptyStateIcon,
            borderRadius: size.emptyStateIcon / 2,
            backgroundColor: colors.surface.sunken,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: ICON_GAP,
          }}
        >
          {icon}
        </View>
      ) : null}

      <Text variant="emptyTitle" tone="strong" style={{ textAlign: 'center' }}>
        {title}
      </Text>

      {body ? (
        <Text
          variant="labelMuted"
          tone="muted"
          style={{ textAlign: 'center', marginTop: BODY_GAP, maxWidth: BODY_MAX_WIDTH }}
        >
          {body}
        </Text>
      ) : null}

      {children ? (
        <View style={{ alignSelf: 'stretch', marginTop: CHILDREN_GAP }}>{children}</View>
      ) : null}
    </View>
  );
}

/** The muted ink the empty-state glyph is drawn in. */
export function useEmptyStateIconColor(): string {
  return useTokens().colors.text.placeholder;
}

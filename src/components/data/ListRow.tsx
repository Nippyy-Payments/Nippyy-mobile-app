import * as Linking from 'expo-linking';
import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { useTokens } from '@/theme/ThemeProvider';

/**
 * The trailing affordance names the destination, and getting it wrong makes
 * every row a guess:
 *
 *   chevron  — another screen inside the app (default)
 *   external — a new browser tab
 *   none     — the row acts in place, or does not navigate
 */
export type RowAffordance = 'chevron' | 'external' | 'none';

export type ListRowProps = {
  leading?: ReactNode;
  title: string;
  /**
   * A second line earns its place only when it carries what the title
   * cannot. "Privacy policy" explains itself.
   */
  subtitle?: string | null;
  trailing?: ReactNode;
  affordance?: RowAffordance;
  danger?: boolean;
  /** The first row in a run has no divider above it. */
  first?: boolean;
  /** Must match the screen's gutter so the row bleeds to the screen edge. */
  gutter?: number;
  /** Opens externally. Mutually exclusive with `onPress` in practice. */
  href?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const PADDING_Y = 16;
const GAP = 13;
const CHEVRON = 18;
const EXTERNAL = 16;
const AFFORDANCE_STROKE = 2;

/**
 * The workhorse. Every list in the app is a stack of these: people, wallets,
 * settings, banks, devices, billers, legal documents.
 *
 * Rows bleed past the page gutter to the screen edge and divide with a 1px
 * hairline. In CSS that is `calc(100% + 48px)` with a negative margin; in RN
 * it is a negative horizontal margin plus matching padding, which needs no
 * width calculation at all.
 *
 * Do NOT wrap a stack of these in a Card — boxing a list is the fastest way
 * to make a screen stop looking like this app.
 */
export function ListRow({
  leading,
  title,
  subtitle,
  trailing,
  affordance = 'chevron',
  danger = false,
  first = false,
  gutter,
  href,
  onPress,
  style,
  testID,
}: ListRowProps) {
  const { colors, gutter: gutters, size, borderWidth } = useTokens();

  const inset = gutter ?? gutters.default;
  const interactive = Boolean(onPress || href);

  const handlePress = href ? () => void Linking.openURL(href) : onPress;

  return (
    <Pressable
      onPress={handlePress}
      disabled={!interactive}
      accessibilityRole={interactive ? (href ? 'link' : 'button') : undefined}
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      testID={testID}
      style={({ pressed }) => [
        {
          marginHorizontal: -inset,
          paddingHorizontal: inset,
          paddingVertical: PADDING_Y,
          minHeight: size.rowMin,
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: GAP,
          borderTopWidth: first ? 0 : borderWidth.hairline,
          borderTopColor: colors.border.subtle,
          backgroundColor: pressed && interactive ? colors.surface.quiet : 'transparent',
        },
        style,
      ]}
    >
      {leading}

      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          variant="bodyStrong"
          tone="strong"
          numberOfLines={1}
          style={danger ? { color: colors.status.danger } : undefined}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text variant="labelMuted" tone="muted" numberOfLines={1} style={{ marginTop: 1 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {trailing}

      {affordance === 'chevron' ? (
        <Icon
          name="chevronRight"
          size={CHEVRON}
          strokeWidth={AFFORDANCE_STROKE}
          color={colors.indicator.neutral}
        />
      ) : null}
      {affordance === 'external' ? (
        <Icon
          name="external"
          size={EXTERNAL}
          strokeWidth={AFFORDANCE_STROKE}
          color={colors.text.placeholder}
        />
      ) : null}
    </Pressable>
  );
}

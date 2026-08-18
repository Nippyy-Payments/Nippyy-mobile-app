import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { useTokens } from '@/theme/ThemeProvider';

export type ScreenHeaderProps = {
  title?: string;
  /**
   * Shows the back target. Defaults to `router.back()` — the designed button
   * stays exactly as drawn, it just drives the router rather than replacing
   * the platform gesture.
   */
  onBack?: () => void;
  /** Set false on a root screen that has nothing to go back to. */
  showBack?: boolean;
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** The back target is 42px, which clears the 44px minimum with its gap. */
const BACK_SIZE = 42;
/** The bar is pulled left so the glyph optically aligns with the gutter. */
const OPTICAL_INSET = -8;
const PAD_TOP = 6;
const PAD_BOTTOM = 8;
const GAP = 6;
/** The back arrow is drawn heavier than the icon set's default. */
const BACK_STROKE = 2.1;
const BACK_GLYPH = 22;

/**
 * The compact bar at the top of every pushed screen: a back target, the
 * screen name in Montserrat 20/700, and an optional trailing action.
 *
 * This is the single most repeated pattern in the app — it appears 31 times.
 */
export function ScreenHeader({
  title,
  onBack,
  showBack = true,
  action,
  style,
  testID,
}: ScreenHeaderProps) {
  const { colors, radius } = useTokens();
  const router = useRouter();

  const goBack = onBack ?? (() => router.back());

  return (
    <View
      testID={testID}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: GAP,
          paddingTop: PAD_TOP,
          paddingBottom: PAD_BOTTOM,
          marginLeft: OPTICAL_INSET,
        },
        style,
      ]}
    >
      {showBack ? (
        <Pressable
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel="Back"
          testID={testID ? `${testID}-back` : undefined}
          style={{
            width: BACK_SIZE,
            height: BACK_SIZE,
            borderRadius: radius.field,
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon
            name="arrowLeft"
            size={BACK_GLYPH}
            strokeWidth={BACK_STROKE}
            color={colors.text.strong}
          />
        </Pressable>
      ) : null}

      <View style={{ flex: 1, minWidth: 0 }}>
        {title ? (
          <Text variant="screenHeader" tone="strong" numberOfLines={1} accessibilityRole="header">
            {title}
          </Text>
        ) : null}
      </View>

      {action}
    </View>
  );
}

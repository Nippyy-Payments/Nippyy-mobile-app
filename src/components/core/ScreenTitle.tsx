import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '@/components/Text';

export type ScreenTitleProps = {
  children?: ReactNode;
  /** One sentence, and only when it removes a real doubt. */
  subhead?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** Vertical rhythm around the title block, from the design. */
const PAD_TOP = 8;
const PAD_BOTTOM = 4;
const SUBHEAD_GAP = 5;

/**
 * The 34px Montserrat title that opens a root screen.
 *
 * A root screen gets this; a pushed screen gets the smaller `ScreenHeader`.
 * That size difference is the app's only depth cue, so the two are not
 * interchangeable.
 */
export function ScreenTitle({ children, subhead, style, testID }: ScreenTitleProps) {
  return (
    <View testID={testID} style={[{ paddingTop: PAD_TOP, paddingBottom: PAD_BOTTOM }, style]}>
      <Text variant="screenTitle" tone="strong" accessibilityRole="header">
        {children}
      </Text>
      {subhead ? (
        <Text variant="body" tone="muted" style={{ marginTop: SUBHEAD_GAP }}>
          {subhead}
        </Text>
      ) : null}
    </View>
  );
}

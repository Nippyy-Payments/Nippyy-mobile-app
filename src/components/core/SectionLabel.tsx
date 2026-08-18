import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '@/components/Text';

export type SectionLabelProps = {
  children?: ReactNode;
  /** A text button at the trailing edge — "See all", "Add". */
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const GAP = 12;
const MARGIN_BOTTOM = 8;

/**
 * The 13/600 muted line that names a group of rows.
 *
 * This and surrounding whitespace are the only things separating one run of
 * rows from the next — the system groups with a label, never with a card or
 * a box.
 */
export function SectionLabel({ children, action, style, testID }: SectionLabelProps) {
  return (
    <View
      testID={testID}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          columnGap: GAP,
          marginBottom: MARGIN_BOTTOM,
        },
        style,
      ]}
    >
      {typeof children === 'string' ? (
        <Text variant="label" tone="muted">
          {children}
        </Text>
      ) : (
        children
      )}
      {action}
    </View>
  );
}

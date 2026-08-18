import type { ReactNode } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTokens } from '@/theme/ThemeProvider';

export type ScreenProps = {
  children?: ReactNode;
  /**
   * Page gutter. The app runs at 24px, settings screens at 20px, and Bills at
   * 22px — see PORTING_PLAN.md §4 for why that third value is worth revisiting.
   */
  gutter?: 'default' | 'tight' | 'bills';
  /** Scrolling is the default; full-screen flows that own their layout opt out. */
  scroll?: boolean;
  /** Leaves room for the tab bar. Off for full-screen flows, which have none. */
  withTabBar?: boolean;
  /**
   * A fixed element above the scroll area. The design uses `position: sticky`,
   * which RN has no equivalent for, so the header sits outside the scroll view
   * instead — see PORTING_PLAN.md §5.12.
   */
  header?: ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * The page container: safe area, gutter and scrolling in one place.
 *
 * Layout lives here rather than being repeated per screen, so a breakpoint
 * later lands at one seam per component (PORTING_PLAN.md §6).
 */
export function Screen({
  children,
  gutter = 'default',
  scroll = true,
  withTabBar = false,
  header,
  onRefresh,
  refreshing = false,
  contentStyle,
  testID,
}: ScreenProps) {
  const { colors, gutter: gutters, spacingRaw, spacing } = useTokens();
  const insets = useSafeAreaInsets();

  const paddingHorizontal = gutters[gutter];
  const paddingBottom =
    (withTabBar ? spacingRaw.tabScreenBottom : spacing['3xl']) + insets.bottom;

  // A full-screen flow lays itself out against the available height (the
  // design pins its primary action to the bottom), so the content box has to
  // fill when scrolling is off.
  const body = (
    <View style={[!scroll && styles.fill, { paddingHorizontal }, contentStyle]}>{children}</View>
  );

  return (
    <View
      testID={testID}
      style={[styles.fill, { backgroundColor: colors.surface.page, paddingTop: insets.top }]}
    >
      {header ? <View style={{ paddingHorizontal }}>{header}</View> : null}

      {scroll ? (
        <ScrollView
          style={styles.fill}
          contentContainerStyle={{ paddingBottom }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.text.subtle}
                colors={[colors.brand.default]}
              />
            ) : undefined
          }
        >
          {body}
        </ScrollView>
      ) : (
        <View style={[styles.fill, { paddingBottom }]}>{body}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });

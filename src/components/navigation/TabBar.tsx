import { BlurView } from 'expo-blur';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { useTheme } from '@/theme/ThemeProvider';
import type { IconName } from '@/components/icons';

/**
 * The tab bar receives react-navigation's props. A structural subset is
 * declared here rather than importing the type through an expo-router build
 * path, which is not a public entry point.
 */
export type TabBarProps = {
  state: {
    index: number;
    routes: { key: string; name: string }[];
  };
  navigation: {
    navigate: (name: string) => void;
    emit: (event: { type: 'tabPress'; target: string; canPreventDefault: true }) => {
      defaultPrevented: boolean;
    };
  };
  /** Tapping the centre action leaves the tab navigator entirely. */
  onSend: () => void;
};

type TabConfig = { route: string; label: string; icon: IconName };

/**
 * Four tabs plus the raised send action. The design labels the activity tab
 * "History", so the label and the route name deliberately differ.
 */
const TABS: TabConfig[] = [
  { route: 'index', label: 'Home', icon: 'tabHome' },
  { route: 'wallets', label: 'Wallets', icon: 'tabWallets' },
  { route: 'activity', label: 'History', icon: 'tabHistory' },
  { route: 'menu', label: 'Account', icon: 'tabAccount' },
];

const BLUR_INTENSITY = 14;
const PADDING_TOP = 8;
const PADDING_H = 20;
const PADDING_BOTTOM = 10;
/** Floor for the bottom inset on devices without a home indicator. */
const MIN_BOTTOM_INSET = 8;
const TAB_GAP = 3;
const TAB_ICON = 23;
const TAB_STROKE = 2;
const SEND_ICON = 25;
const SEND_STROKE = 2.2;

/**
 * The persistent bottom bar: four labelled tabs with a raised circular send
 * action in the centre.
 *
 * Translucent with a 14px backdrop blur so content shows through as it
 * scrolls under — the only transparency-and-blur in the whole system.
 *
 * It is not hidden by a flag on full-screen flows. Those routes live outside
 * the tab group entirely, so there is no bar to hide.
 */
export function TabBar({ state, navigation, onSend }: TabBarProps) {
  const { theme, isDark } = useTheme();
  const { colors, size, borderWidth } = theme;
  const insets = useSafeAreaInsets();

  const paddingBottom = PADDING_BOTTOM + Math.max(insets.bottom, MIN_BOTTOM_INSET);

  const renderTab = (tab: TabConfig) => {
    const routeIndex = state.routes.findIndex((r) => r.name === tab.route);
    const route = state.routes[routeIndex];
    const focused = routeIndex === state.index;

    const onPress = () => {
      if (!route) return;
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      if (!focused && !event.defaultPrevented) navigation.navigate(tab.route);
    };

    return (
      <Pressable
        key={tab.route}
        onPress={onPress}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={tab.label}
        testID={`tab-${tab.route}`}
        style={{ width: size.tabItemWidth, alignItems: 'center', rowGap: TAB_GAP }}
      >
        <Icon
          name={tab.icon}
          size={TAB_ICON}
          strokeWidth={TAB_STROKE}
          color={focused ? colors.brand.default : colors.text.subtle}
        />
        <Text
          variant="microStrong"
          style={{ color: focused ? colors.brand.default : colors.text.subtle }}
        >
          {tab.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <BlurView
        intensity={BLUR_INTENSITY}
        tint={isDark ? 'dark' : 'light'}
        // Android has no native backdrop filter; this is the supported path.
        experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: colors.chrome.tabBar,
            borderTopWidth: borderWidth.hairline,
            borderTopColor: colors.border.subtle,
          },
        ]}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: PADDING_TOP,
          paddingHorizontal: PADDING_H,
          paddingBottom,
        }}
      >
        {TABS.slice(0, 2).map(renderTab)}

        <Pressable
          onPress={onSend}
          accessibilityRole="button"
          accessibilityLabel="Send money"
          testID="tab-send"
          style={{
            width: size.tabSendButton,
            height: size.tabSendButton,
            borderRadius: size.tabSendButton / 2,
            backgroundColor: colors.brand.default,
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon
            name="send"
            size={SEND_ICON}
            strokeWidth={SEND_STROKE}
            color={colors.text.onBrand}
          />
        </Pressable>

        {TABS.slice(2).map(renderTab)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
});

import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/Text';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Phase 0 smoke screen.
 *
 * Verifies the scaffold end to end: both typefaces render, the type scale
 * resolves, tokens drive every value, and the theme switch works. Replaced by
 * the real Home screen in phase 5.
 */
export default function ScaffoldCheck() {
  const { theme, name, toggleTheme } = useTheme();
  const { colors, spacing, gutter, radius, size, borderWidth } = theme;
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: colors.surface.page }}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.lg,
        paddingBottom: insets.bottom + spacing['4xl'],
        paddingHorizontal: gutter.default,
      }}
    >
      <Text variant="screenTitle" tone="strong">
        Send money home in seconds
      </Text>
      <Text variant="body" tone="muted" style={{ marginTop: spacing.md }}>
        See the exact rate and fee up front — no hidden spread, and it lands almost instantly.
      </Text>

      <Text variant="label" tone="muted" style={{ marginTop: spacing['3xl'] }}>
        Montserrat — display
      </Text>
      <Text variant="screenHeader" tone="strong">
        Review transfer
      </Text>
      <Text variant="flowTitle" tone="strong">
        Create a PIN
      </Text>
      <Text variant="cardTitle" tone="strong">
        Face ID unlock
      </Text>

      <Text variant="label" tone="muted" style={{ marginTop: spacing['3xl'] }}>
        Space Grotesk — UI text
      </Text>
      <Text variant="bodyStrong" tone="strong">
        Ada Okeke
      </Text>
      <Text variant="labelMuted" tone="muted">
        GTBank · ···4471
      </Text>
      <Text variant="caption" tone="subtle">
        0.4% fee · arrives in seconds
      </Text>

      <Text variant="label" tone="muted" style={{ marginTop: spacing['3xl'] }}>
        Space Grotesk — money, tabular figures
      </Text>
      <Text variant="balanceHero" tone="strong">
        ₦3,624,097
      </Text>
      <View style={{ marginTop: spacing.sm }}>
        <Text variant="money" style={{ color: colors.money.in }}>
          +£2,400.00
        </Text>
        <Text variant="money" style={{ color: colors.money.out }}>
          -₦200,000
        </Text>
        <Text variant="money" style={{ color: colors.money.pending }}>
          -₵1,500
        </Text>
      </View>

      <Text variant="label" tone="muted" style={{ marginTop: spacing['3xl'] }}>
        Surfaces and hairlines
      </Text>
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
        {(
          [
            ['quiet', colors.surface.quiet],
            ['sunken', colors.surface.sunken],
            ['brand', colors.brand.soft],
          ] as const
        ).map(([label, background]) => (
          <View
            key={label}
            style={{
              flex: 1,
              height: size.tile.lg,
              borderRadius: radius.tile,
              backgroundColor: background,
              borderWidth: borderWidth.hairline,
              borderColor: colors.border.subtle,
            }}
          />
        ))}
      </View>

      <Pressable
        onPress={toggleTheme}
        style={({ pressed }) => [
          styles.action,
          {
            height: size.button.lg,
            borderRadius: radius.button.lg,
            backgroundColor: colors.brand.default,
            marginTop: spacing['3xl'],
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        <Text variant="buttonLg" style={{ color: colors.brand.onBrand }}>
          {name === 'dark' ? 'Switch to light' : 'Switch to dark'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  action: { alignItems: 'center', justifyContent: 'center' },
});

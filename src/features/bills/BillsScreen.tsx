import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { ListRow } from '@/components/data/ListRow';
import { RowTile, useRowTileForeground } from '@/components/data/RowTile';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { SectionLabel } from '@/components/core/SectionLabel';
import { BILL_CATEGORIES, RECENT_BILLS, billCategory } from '@/features/bills/categories';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Three across, matching the design. Laid out as rows of three rather than a
 * wrapping percentage grid, which drifts at odd widths — the same choice the
 * keypad makes.
 */
const COLUMNS = 3;
const TILE = 40;
const CARD_PAD_V = 16;
const CARD_PAD_H = 6;
const CARD_GAP = 9;

export function BillsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { colors, spacing, spacingRaw, gutter, radius, size, borderWidth } = theme;
  const brandFg = useRowTileForeground('brand');
  const quietFg = useRowTileForeground('quiet');

  const rows: (typeof BILL_CATEGORIES)[] = [];
  for (let i = 0; i < BILL_CATEGORIES.length; i += COLUMNS) {
    rows.push(BILL_CATEGORIES.slice(i, i + COLUMNS));
  }

  return (
    <Screen gutter="bills" header={<ScreenHeader title="Pay a bill" />}>
      <Text variant="body" tone="muted">
        Pay in your currency. It lands in theirs.
      </Text>

      <SectionLabel style={{ marginTop: spacingRaw.sectionGapSm }}>Categories</SectionLabel>

      <View style={{ rowGap: spacing.md }}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection: 'row', columnGap: spacing.md }}>
            {row.map((category) => (
              <Pressable
                key={category.id}
                testID={`bill-${category.id}`}
                onPress={() => router.push(`/money/bill/${category.id}`)}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  rowGap: CARD_GAP,
                  paddingVertical: CARD_PAD_V,
                  paddingHorizontal: CARD_PAD_H,
                  borderRadius: radius.card,
                  borderWidth: borderWidth.hairline,
                  borderColor: colors.border.subtle,
                }}
              >
                <RowTile tone="brand" size={TILE} radius={radius.tile}>
                  <Icon name={category.icon} size={size.icon.lg} color={brandFg} />
                </RowTile>
                <Text variant="captionStrong" tone="body" style={{ textAlign: 'center' }}>
                  {category.label}
                </Text>
              </Pressable>
            ))}
            {/* Keeps the last row aligned when it is not full. */}
            {Array.from({ length: COLUMNS - row.length }, (_, index) => (
              <View key={`filler-${index}`} style={{ flex: 1 }} />
            ))}
          </View>
        ))}
      </View>

      <SectionLabel style={{ marginTop: spacingRaw.sectionGapMd }}>Pay again</SectionLabel>
      {RECENT_BILLS.map((id, index) => {
        const category = billCategory(id);
        if (!category) return null;

        return (
          <ListRow
            key={id}
            first={index === 0}
            gutter={gutter.bills}
            leading={
              <RowTile>
                <Text variant="cardTitle" style={{ color: quietFg }}>
                  {category.monogram}
                </Text>
              </RowTile>
            }
            title={category.biller}
            subtitle={`${category.label} · ${category.account}`}
            onPress={() => router.push(`/money/bill/${category.id}`)}
          />
        );
      })}
    </Screen>
  );
}

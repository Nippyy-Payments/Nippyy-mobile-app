import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/core/Button';
import { ListRow } from '@/components/data/ListRow';
import { RowTile, useRowTileForeground } from '@/components/data/RowTile';
import { ScreenTitle } from '@/components/core/ScreenTitle';
import { SectionLabel } from '@/components/core/SectionLabel';
import { Text } from '@/components/Text';
import { useTheme } from '@/theme/ThemeProvider';

/** Account — navigation stub for phase 3. Built properly in phase 8. */
export default function MenuScreen() {
  const router = useRouter();
  const { theme, name, toggleTheme } = useTheme();
  const { spacing, spacingRaw, size, colors } = theme;

  const quietFg = useRowTileForeground('quiet');
  const dangerFg = useRowTileForeground('danger');

  return (
    <Screen withTabBar>
      <ScreenTitle>Account</ScreenTitle>

      <View style={{ marginTop: spacingRaw.sectionGapMd }}>
        <SectionLabel>Preferences</SectionLabel>
        <ListRow
          first
          leading={
            <RowTile>
              <Icon name="chart" size={size.icon.lg} color={quietFg} />
            </RowTile>
          }
          title="Component gallery"
          subtitle="Every primitive, both themes"
          onPress={() => router.push('/gallery')}
        />
        <ListRow
          leading={
            <RowTile>
              <Icon name="doc" size={size.icon.lg} color={quietFg} />
            </RowTile>
          }
          title="Privacy policy"
          affordance="external"
          href="https://nippyy.com/privacy-policy"
        />
      </View>

      <View style={{ marginTop: spacingRaw.sectionGapLg }}>
        <SectionLabel>Danger zone</SectionLabel>
        <ListRow
          first
          leading={
            <RowTile tone="danger">
              <Icon name="trash" size={size.icon.lg} color={dangerFg} />
            </RowTile>
          }
          title="Close account"
          subtitle="Delete your profile and recipients"
          danger
          onPress={() => {}}
        />
      </View>

      <View style={{ marginTop: spacingRaw.sectionGapMd }}>
        <SectionLabel>Appearance</SectionLabel>
        <Button variant="outline" size="md" fullWidth onPress={toggleTheme}>
          {name === 'dark' ? 'Switch to light' : 'Switch to dark'}
        </Button>
      </View>

      <Text
        variant="micro"
        tone="subtle"
        style={{ textAlign: 'center', marginTop: spacing.lg, color: colors.text.subtle }}
      >
        nippyy · FCA-registered · v2.4.0
      </Text>
    </Screen>
  );
}

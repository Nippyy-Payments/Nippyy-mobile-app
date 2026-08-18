import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { ListRow } from '@/components/data/ListRow';
import { RowTile, useRowTileForeground } from '@/components/data/RowTile';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { SectionLabel } from '@/components/core/SectionLabel';
import { SOCIAL_LINKS, SUPPORT_CONTACT } from '@/features/account/menu';
import { useTheme } from '@/theme/ThemeProvider';

export function SupportScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { spacingRaw, size } = theme;
  const quietFg = useRowTileForeground('quiet');

  return (
    <Screen header={<ScreenHeader title="Help & support" />}>
      <View style={{ marginTop: spacingRaw.sectionGapSm }}>
        <SectionLabel>Contact us</SectionLabel>
        {SUPPORT_CONTACT.map((entry, index) => (
          <ListRow
            key={entry.label}
            first={index === 0}
            testID={`support-${entry.icon}`}
            leading={
              <RowTile>
                <Icon name={entry.icon} size={21} color={quietFg} />
              </RowTile>
            }
            title={entry.label}
            subtitle={entry.sub}
            /* The affordance names the destination: a browser tab gets the
               external glyph, an in-app screen gets the chevron. */
            affordance={entry.href ? 'external' : 'chevron'}
            href={entry.href}
            onPress={entry.to ? () => router.push(entry.to as never) : undefined}
          />
        ))}
      </View>

      <View style={{ marginTop: spacingRaw.sectionGapLg }}>
        <SectionLabel>Connect with us</SectionLabel>
        {SOCIAL_LINKS.map((entry, index) => (
          <ListRow
            key={entry.label}
            first={index === 0}
            testID={`social-${entry.icon}`}
            leading={
              <RowTile>
                <Icon name={entry.icon} size={21} color={quietFg} />
              </RowTile>
            }
            title={entry.label}
            affordance="external"
            href={entry.href}
          />
        ))}
      </View>

      <View style={{ height: size.tapMin }} />
    </Screen>
  );
}

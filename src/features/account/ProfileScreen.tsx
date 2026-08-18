import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Avatar } from '@/components/data/Avatar';
import { Button } from '@/components/core/Button';
import { Card } from '@/components/core/Card';
import { DetailRow } from '@/components/data/DetailRow';
import { InlineAlert, useAlertIconColor } from '@/components/feedback/InlineAlert';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { SectionLabel } from '@/components/core/SectionLabel';
import { useTheme } from '@/theme/ThemeProvider';

const TAG = '@tobi.adeyemi';

export function ProfileScreen() {
  const { theme } = useTheme();
  const { colors, spacing, spacingRaw, size } = theme;
  const infoFg = useAlertIconColor('info');

  const [copied, setCopied] = useState(false);

  return (
    <Screen
      header={
        <ScreenHeader
          title="Your details"
          action={
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          }
        />
      }
    >
      <View style={{ alignItems: 'center', paddingTop: spacing.sm }}>
        <Avatar name="Tobi Adeyemi" size="xl" />
        <Text variant="screenHeader" tone="strong" style={{ marginTop: spacing.md }}>
          Tobi Adeyemi
        </Text>

        <Pressable
          onPress={() => setCopied(true)}
          accessibilityRole="button"
          accessibilityLabel={copied ? 'Tag copied' : `Copy ${TAG}`}
          testID="copy-tag"
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: spacing.xs,
            marginTop: spacing.xs,
          }}
        >
          <Text
            variant="labelMuted"
            style={{ color: copied ? colors.status.success : colors.text.muted }}
          >
            {copied ? 'Copied' : TAG}
          </Text>
          <Icon name="copy" size={12} color={copied ? colors.status.success : colors.text.muted} />
        </Pressable>
      </View>

      <SectionLabel style={{ marginTop: spacingRaw.sectionGapMd }}>Personal</SectionLabel>
      <Card tone="sunken">
        <DetailRow label="Legal name" value="Tobi Adeyemi" divider />
        <DetailRow label="Date of birth" value="14 March 1994" divider />
        <DetailRow label="Phone" value="+234 803 114 2208" numeric divider />
        <DetailRow label="Email" value="tobi@example.com" />
      </Card>

      <SectionLabel style={{ marginTop: spacingRaw.sectionGapSm }}>Address</SectionLabel>
      <Card tone="sunken">
        <DetailRow label="Line 1" value="14 Adeola Odeku Street" divider />
        <DetailRow label="City" value="Victoria Island, Lagos" divider />
        <DetailRow label="Country" value="🇳🇬 Nigeria" />
      </Card>

      <InlineAlert
        style={{ marginTop: spacingRaw.sectionGapSm }}
        tone="info"
        title="Locked while verified"
        detail="Changing your legal name or date of birth needs a new identity check. Contact support to start one."
        icon={<Icon name="shield" size={size.icon.sm} color={infoFg} />}
      />
    </Screen>
  );
}

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Button } from '@/components/core/Button';
import { Keypad } from '@/components/forms/Keypad';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { ScreenTitle } from '@/components/core/ScreenTitle';
import { useTheme } from '@/theme/ThemeProvider';

/** The design ships one corridor; the picker behind this chip is deferred. */
const DIAL_CODE = '+234';
const DIAL_FLAG = '🇳🇬';
const NATIONAL_LENGTH = 10;

const FIELD_GAP = 8;
const CHIP_GAP = 7;
const CHIP_PAD = 14;

/** Groups a Nigerian national number as the design shows it: 803 114 2208. */
export function groupNumber(digits: string): string {
  const trimmed = digits.slice(0, NATIONAL_LENGTH);
  const parts = [trimmed.slice(0, 3), trimmed.slice(3, 6), trimmed.slice(6)];
  return parts.filter(Boolean).join(' ');
}

export function PhoneScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { colors, spacing, spacingRaw, size, radius } = theme;

  const [digits, setDigits] = useState('8031142208');
  const complete = digits.length === NATIONAL_LENGTH;

  return (
    <Screen scroll={false} header={<ScreenHeader />}>
      <ScreenTitle subhead="We'll text you a six-digit code to confirm it's you.">
        What&apos;s your number?
      </ScreenTitle>

      <View style={{ flexDirection: 'row', columnGap: FIELD_GAP, marginTop: spacingRaw.sectionGapSm }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: CHIP_GAP,
            height: size.field.md,
            paddingHorizontal: CHIP_PAD,
            backgroundColor: colors.surface.quiet,
            borderRadius: radius.field,
            flexShrink: 0,
          }}
        >
          <Text variant="emptyTitle">{DIAL_FLAG}</Text>
          <Text variant="phoneNumber" tone="strong">
            {DIAL_CODE}
          </Text>
          <Icon name="chevronDown" size={13} color={colors.text.muted} strokeWidth={2} />
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            height: size.field.md,
            paddingHorizontal: CHIP_PAD,
            backgroundColor: colors.surface.quiet,
            borderRadius: radius.field,
            borderWidth: theme.borderWidth.strong,
            borderColor: colors.border.focus,
          }}
        >
          <Text variant="phoneNumber" tone="strong" testID="phone-number">
            {groupNumber(digits)}
          </Text>
        </View>
      </View>

      <View style={{ flex: 1, minHeight: spacing.lg }} />

      <Button
        variant="primary"
        size="lg"
        fullWidth
        disabled={!complete}
        onPress={() => router.push('/onboarding/otp')}
      >
        {complete ? 'Send me a code' : `Enter ${NATIONAL_LENGTH} digits`}
      </Button>

      <Keypad
        decimal={false}
        style={{ marginTop: spacing.lg }}
        onKey={(key) =>
          setDigits((current) =>
            key === 'back' ? current.slice(0, -1) : (current + key).slice(0, NATIONAL_LENGTH)
          )
        }
      />
    </Screen>
  );
}
